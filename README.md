# Bugi Hub

Bugi Hub의 공개 웹 화면과 플랫폼 상태 API를 제공하는 독립 Next.js 저장소다. 프로젝트 소개와 선별한 작업 기록은 코드의 정적 데이터로 관리하며 콘텐츠 DB나 관리 화면을 두지 않는다.

이 저장소의 이력은 `YEONJI-P/personal-hub`의 `apps/bugi-hub-web` 디렉터리를 `git filter-repo --subdirectory-filter apps/bugi-hub-web`로 분리해 보존했다. 기존 `personal-hub` 저장소는 보존 자료이며 이 저장소에서 수정하지 않는다.

## 로컬 실행

Node.js 22와 npm을 기준으로 한다.

```bash
npm ci
npm run dev
```

기본 주소는 `http://localhost:3000`이다. 외부 health 대상이나 PostgreSQL 설정이 없으면 상태 패널은 `대상 없음`으로 표시된다.

## 확인 명령

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 상태 감시

브라우저는 `/api/status`의 정제된 결과만 사용한다. 내부 URL과 데이터베이스 접속 정보는 공개 응답에 포함하지 않는다.

- `STATUS_SENSOR_MONITOR_BACKEND_URL`: Sensor Backend의 컨테이너 내부 base URL
- `STATUS_SENSOR_MONITOR_EXPLAIN_URL`: Sensor Explain의 컨테이너 내부 base URL
- `STATUS_REQUEST_TIMEOUT_MS`: 개별 상태 확인 제한 시간, 기본 3000ms
- `STATUS_REFRESH_INTERVAL_MS`: 서버 측 상태 결과 보관 시간, 기본 30000ms
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`: PostgreSQL 플랫폼 상태 확인용 접속 정보

PostgreSQL 연결은 `SELECT 1`만 실행한다. 이 연결은 Bugi Hub 콘텐츠 저장용 DB가 아니라 홈서버 플랫폼 상태 감시 대상이다.

## HTTP 경로

- `GET /api/status`: 서비스와 인프라의 `UP`/`DOWN` 상태
- `GET /actuator/health`: 앱 자체 health, `{"status":"UP"}`
- `GET /actuator/health/db`: PostgreSQL 연결 health

## 컨테이너

```bash
docker build -t bugi-hub:local .
docker run --rm -p 8080:8080 bugi-hub:local
```

이미지는 non-root 사용자로 실행되며 `/actuator/health`를 Docker healthcheck로 사용한다. 런타임 상태 감시 값은 이미지에 넣지 않고 배포 환경에서 주입한다.

## CI와 배포 경계

GitHub Actions는 저장소 루트에서 lint, typecheck, test, production build를 순서대로 통과한 뒤 `main`의 저장소 HEAD 40자리 SHA로 이미지를 발행한다.

```text
ghcr.io/yeonji-p/bugi-hub:<40-character-commit-sha>
```

이 저장소는 앱 코드, 테스트, 컨테이너 이미지 발행까지 소유한다. 실행 이미지 pin, 네트워크, 라우팅과 런타임 비밀값은 `home-server-infra`가 소유하며, 해당 저장소의 updater 계약이 마련된 뒤에만 자동 pin PR을 연결한다.
