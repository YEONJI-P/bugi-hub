# Bugi Hub 작업 지침

이 저장소는 Bugi Hub의 독립 Next.js 애플리케이션이다. 현재 구성, 실행, 상태 감시와 이미지 계약은 `README.md`가 정본이다.

## Next.js 규칙

<!-- BEGIN:nextjs-agent-rules -->
이 버전은 학습 데이터의 Next.js와 API, 관례, 파일 구조가 다를 수 있다. 코드를 변경하기 전에 `node_modules/next/dist/docs/`의 관련 가이드를 읽고 deprecation 안내를 따른다.
<!-- END:nextjs-agent-rules -->

## 저장소 경계

- 이 저장소는 공개 화면, 정적 Work Log, 상태 Route Handler, 테스트, Docker 이미지와 CI를 소유한다.
- `personal-hub`에서 분리된 Git 이력을 보존한다. 과거 저장소나 Java 앱, compose, nginx, TLS 등 인프라 파일을 다시 가져오지 않는다.
- 배포 이미지 pin, 컨테이너 네트워크, 공개 라우팅과 런타임 비밀값은 `home-server-infra`가 소유한다.
- 애플리케이션은 origin 루트에서 서빙한다. 인프라 편입을 위해 base path를 추가하지 않는다.

## 상태와 데이터

- 프로젝트 소개와 작업 기록은 정적 코드로 관리하며 콘텐츠 DB나 관리자 화면을 추가하지 않는다.
- PostgreSQL `SELECT 1`은 플랫폼 상태 감시 계약이다. 콘텐츠 DB로 오해해 제거하거나 애플리케이션 데이터 접근으로 확장하지 않는다.
- 내부 상태 주소와 DB 접속 정보는 서버에서만 사용하고 공개 API에는 이름과 `UP`/`DOWN` 결과만 반환한다.
- health 응답 계약은 HTTP 200과 `{"status":"UP"}`이다. DB health는 연결 실패 시 HTTP 503을 반환한다.

## 환경과 비밀값

- `.env`, credential, 인증서, 토큰과 실제 비밀값은 읽거나 추적하거나 이미지에 복사하지 않는다.
- 새 환경변수는 실제 서버 소비 코드와 `README.md`의 이름을 함께 맞춘다.
- 브라우저에 노출할 의도가 없는 값에는 `NEXT_PUBLIC_` 접두사를 사용하지 않는다.

## 변경 확인

루트에서 다음을 모두 실행한다.

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Dockerfile이나 런타임 경계를 바꾸면 이미지를 빌드하고 `/actuator/health`와 Docker health 상태를 함께 확인한다.
