#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <bugi-server-infra-checkout>" >&2
  exit 2
fi

infra_checkout=$1
: "${SOURCE_SHA:?SOURCE_SHA is required}"
: "${INFRA_REPOSITORY:?INFRA_REPOSITORY is required}"
: "${GH_TOKEN:?GH_TOKEN is required}"

if [[ ! $SOURCE_SHA =~ ^[0-9a-f]{40}$ ]]; then
  echo "SOURCE_SHA must be a lowercase 40-character Git SHA" >&2
  exit 2
fi

cd "$infra_checkout"

if [[ -n $(git status --porcelain) ]]; then
  echo "bugi-server-infra checkout must be clean before updating the image pin" >&2
  exit 1
fi

python3 ops/update_bugi_hub_pin.py \
  --repo-root . \
  --revision "$SOURCE_SHA"

if git diff --quiet; then
  echo "bugi-server-infra already pins Bugi Hub $SOURCE_SHA"
  exit 0
fi

mapfile -t changed_paths < <(git diff --name-only)
if [[ ${#changed_paths[@]} -ne 1 || ${changed_paths[0]} != "docker-compose.yml" ]]; then
  echo "Bugi Hub release PR must change only docker-compose.yml" >&2
  printf 'unexpected changed path: %s\n' "${changed_paths[@]}" >&2
  exit 1
fi

git diff --check

mapfile -t changed_lines < <(
  git diff --unified=0 -- docker-compose.yml \
    | grep -E '^[+-]' \
    | grep -Ev '^---|^\+\+\+' \
    || true
)

if [[ ${#changed_lines[@]} -ne 2 ]]; then
  echo "Bugi Hub release must replace exactly one image pin" >&2
  printf 'changed line: %s\n' "${changed_lines[@]}" >&2
  exit 1
fi

for line in "${changed_lines[@]}"; do
  if [[ ! $line =~ ^[-+][[:space:]]*image:[[:space:]]*ghcr\.io/yeonji-p/bugi-hub:[0-9a-f]{40}[[:space:]]*$ ]]; then
    echo "Unexpected Bugi Hub release diff line: $line" >&2
    exit 1
  fi
done

if ! printf '%s\n' "${changed_lines[@]}" \
    | grep -Eq "^\+[[:space:]]*image:[[:space:]]*ghcr\.io/yeonji-p/bugi-hub:$SOURCE_SHA[[:space:]]*$"; then
  echo "Bugi Hub release is missing the pin for $SOURCE_SHA" >&2
  exit 1
fi

branch="automation/bugi-hub-$SOURCE_SHA"
existing_pr=$(gh pr list \
  --repo "$INFRA_REPOSITORY" \
  --state all \
  --head "$branch" \
  --json url \
  --jq '.[0].url // empty')
if [[ -n $existing_pr ]]; then
  echo "Bugi Hub release PR already exists: $existing_pr"
  exit 0
fi

if git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
  echo "Remote branch already exists without a matching PR: $branch" >&2
  exit 1
fi

git switch -c "$branch"
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add docker-compose.yml

mapfile -t staged_paths < <(git diff --cached --name-only)
if [[ ${#staged_paths[@]} -ne 1 || ${staged_paths[0]} != "docker-compose.yml" ]]; then
  echo "Bugi Hub release commit must stage only docker-compose.yml" >&2
  exit 1
fi

git diff --cached --check
git commit -m "chore(deploy): Bugi Hub 이미지 SHA 갱신"
git push --set-upstream origin "$branch"

short_sha=${SOURCE_SHA:0:7}
gh pr create \
  --repo "$INFRA_REPOSITORY" \
  --base main \
  --head "$branch" \
  --title "chore(deploy): Bugi Hub $short_sha 이미지 갱신" \
  --body-file - <<EOF
Bugi Hub main CI와 이미지 발행이 모두 성공한 뒤 자동으로 생성된 배포 제안입니다.

- source SHA: \`$SOURCE_SHA\`
- workflow run: $GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID
- 변경 범위: \`docker-compose.yml\`의 Bugi Hub image pin 한 줄만
- 자동 적용: 없음. 병합 후 bugi-server-infra의 \`Deploy GCP\` workflow를 사용자가 직접 실행

병합 전 확인:

- [ ] Bugi Hub GHCR 이미지가 source SHA로 발행됨
- [ ] image pin 외 env·network·nginx·DB 변경이 섞이지 않음
- [ ] 새 이미지와 현재 PostgreSQL·내부 health 계약이 호환됨

이 PR은 자동 병합하거나 자동 배포하지 않습니다.
EOF
