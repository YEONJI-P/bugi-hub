# Bugi Hub Web

Personal Hub의 공개 웹 화면과 통합 상태 API를 담당하는 Next.js 앱이다. 프로젝트 소개와 작업 기록은 코드의 정적 데이터로 관리하며, 별도 관리 화면이나 콘텐츠 DB를 두지 않는다.

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

## 서버 전용 설정

- `STATUS_SENSOR_MONITOR_BACKEND_URL`: Sensor Backend의 컨테이너 내부 base URL
- `STATUS_SENSOR_MONITOR_EXPLAIN_URL`: Sensor Explain의 컨테이너 내부 base URL
- `STATUS_REQUEST_TIMEOUT_MS`: 개별 상태 확인 제한 시간, 기본 3000ms
- `STATUS_REFRESH_INTERVAL_MS`: 서버 측 상태 결과 보관 시간, 기본 30000ms
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`: PostgreSQL 상태 확인용 접속 정보

브라우저는 `/api/status`의 정제된 결과만 사용한다. 내부 URL과 데이터베이스 접속 정보는 공개 응답에 포함하지 않는다.

## HTTP 경로

- `GET /api/status`: 서비스와 인프라의 `UP`/`DOWN` 상태
- `GET /actuator/health`: 앱 자체 health, `{"status":"UP"}`
- `GET /actuator/health/db`: PostgreSQL 연결 health
