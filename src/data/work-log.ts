export type WorkCategory = "Home Server" | "Service Integration";
export type WorkRepository = "personal-hub" | "sensor-monitor";

export type WorkLogStory =
  | {
      type: "solution";
      problem: string;
      cause: string;
      decision: string;
      outcome: string;
    }
  | {
      type: "implementation";
      goal: string;
      implementation: string;
      decision: string;
      outcome: string;
    }
  | {
      type: "decision";
      background: string;
      options: string;
      decision: string;
      outcome: string;
    };

export interface WorkLogEntry {
  slug: string;
  date: string;
  category: WorkCategory;
  repository: WorkRepository;
  title: string;
  summary: string;
  story: WorkLogStory;
  tags: string[];
}

export const workLogs: WorkLogEntry[] = [
  {
    slug: "nextjs-hub-migration",
    date: "2026-07-19",
    category: "Home Server",
    repository: "personal-hub",
    title: "운영 허브를 Next.js 중심으로 재설계",
    summary: "관리 기능보다 서비스 소개와 상태 확인에 집중하도록 기존 Spring 허브를 Next.js 애플리케이션으로 전환했습니다.",
    story: {
      type: "decision",
      background: "초기 허브는 프로젝트 정보를 데이터베이스에서 관리했지만, 실제 운영에서는 정적인 소개 화면과 서비스 상태 확인이 핵심이었습니다.",
      options: "Spring 관리 기능을 유지하거나, 기존 앱을 즉시 교체하거나, 검증 기간을 두고 가벼운 프런트엔드 중심 구조로 전환하는 방안을 비교했습니다.",
      decision: "Next.js Route Handler가 상태 API를 담당하고 공개 콘텐츠는 정적으로 관리하도록 단순화했습니다. 기존 Spring 앱은 전환 검증이 끝날 때까지 보존했습니다.",
      outcome: "화면과 운영 API의 책임이 분명해졌고, 데이터베이스 없이도 허브를 독립적으로 배포할 수 있는 구조가 됐습니다.",
    },
    tags: ["Next.js", "Architecture"],
  },
  {
    slug: "migration-aware-sensor-deploy",
    date: "2026-07-19",
    category: "Service Integration",
    repository: "personal-hub",
    title: "Sensor Monitor를 홈서버 운영 경계에 편입",
    summary: "두 애플리케이션의 상태 감시와 데이터베이스 경계를 연결하고, 스키마 변경이 포함된 릴리스를 별도 절차로 검증했습니다.",
    story: {
      type: "solution",
      problem: "Backend와 Explain을 홈서버에 편입하면서 공개 라우팅, 내부 상태 감시, 전용 데이터베이스, migration 적용을 함께 안전하게 맞춰야 했습니다.",
      cause: "외부 사용자가 접근할 경로와 컨테이너 내부 운영 경로의 요구가 다르고, 일반 이미지 교체만으로는 데이터베이스 변경의 복구 지점을 보장할 수 없었습니다.",
      decision: "두 프로세스의 health를 각각 내부 URL로 감시하고 전용 database와 role을 사용했습니다. migration 릴리스는 자동 교체에서 분리해 백업 후 수동 적용했습니다.",
      outcome: "Flyway V4·V5 적용과 서비스 상태를 함께 확인했으며, 공개 센서 적재 차단과 내부 인증 응답도 재검증했습니다.",
    },
    tags: ["Flyway", "Deployment", "Health Check"],
  },
  {
    slug: "public-routing",
    date: "2026-07-18",
    category: "Home Server",
    repository: "personal-hub",
    title: "홈 네트워크를 열지 않는 공개 라우팅 구성",
    summary: "Outbound tunnel과 nginx, 서비스별 서브도메인을 조합해 애플리케이션 포트를 직접 공개하지 않는 진입 경로를 구성했습니다.",
    story: {
      type: "implementation",
      goal: "홈 네트워크에 inbound 포트를 열지 않으면서 여러 서비스를 각자의 루트 경로로 안전하게 공개하는 것이 목표였습니다.",
      implementation: "Cloudflare Tunnel을 단일 외부 통로로 두고, nginx가 server name에 따라 각 컨테이너 origin으로 요청을 전달하도록 구성했습니다.",
      decision: "base path를 애플리케이션에 추가하는 대신 서비스별 서브도메인을 사용하고, apex와 wildcard 인증서는 DNS-01로 갱신하도록 했습니다.",
      outcome: "애플리케이션의 라우팅 가정을 바꾸지 않은 채 공개 진입점과 컨테이너 내부 감시 주소를 분리했습니다.",
    },
    tags: ["Cloudflare Tunnel", "nginx", "TLS"],
  },
  {
    slug: "sensor-ingest-boundary",
    date: "2026-07-16",
    category: "Service Integration",
    repository: "sensor-monitor",
    title: "인증 저장소와 런타임 상태 경계 분리",
    summary: "별도 Redis와 설정 엔티티에 섞여 있던 인증·텔레메트리 상태를 PostgreSQL과 전용 상태 모델로 재배치했습니다.",
    story: {
      type: "solution",
      problem: "Refresh Token만을 위해 Redis를 함께 운영했고, heartbeat와 alarm 같은 런타임 값이 장치 설정과 같은 엔티티에 있어 설정 변경 시각의 의미가 흐려졌습니다.",
      cause: "영속 인증 상태, 장치 구성, 계속 변하는 텔레메트리 상태의 수명주기를 초기 모델에서 분리하지 않았습니다.",
      decision: "Refresh Token은 기존 PostgreSQL로 옮기고, Device에는 설정만 남겼습니다. lastSeenAt은 DeviceStatus, inAlarm과 lastAlertAt은 이후 ChannelStatus가 소유하도록 경계를 나눴습니다.",
      outcome: "별도 저장소 운영을 줄이면서 장치 설정 감사 시각과 수신·알람 상태 갱신을 독립적으로 추적할 수 있게 됐습니다.",
    },
    tags: ["Domain Design", "PostgreSQL"],
  },
  {
    slug: "physical-device-channel-model",
    date: "2026-07-18",
    category: "Service Integration",
    repository: "sensor-monitor",
    title: "수신 모델을 물리 장치·채널 구조로 전환",
    summary: "센서 종류별 고정 필드 대신 물리 장치와 채널, 동시 관측 batch를 기준으로 저장 모델을 정규화했습니다.",
    story: {
      type: "decision",
      background: "고정된 센서 필드 중심 모델은 장치마다 다른 채널 구성과 한 시점에 함께 수집된 값의 관계를 표현하기 어려웠습니다.",
      options: "센서 종류별 테이블을 계속 늘리는 방식과, 장치·채널을 독립 엔티티로 두고 관측 batch를 보존하는 방식을 비교했습니다.",
      decision: "Device와 Channel의 수명주기를 분리하고, 같은 시점의 readings를 batch로 묶으며 채널별 임계 정책을 적용하도록 모델을 재구성했습니다.",
      outcome: "장치 구성이 달라져도 스키마를 반복 변경하지 않고 채널을 확장할 수 있으며, 동시 관측의 맥락도 보존할 수 있게 됐습니다.",
    },
    tags: ["Data Modeling", "PostgreSQL"],
  },
  {
    slug: "external-simulator-boundary",
    date: "2026-04-06",
    category: "Service Integration",
    repository: "sensor-monitor",
    title: "시뮬레이터를 외부 데이터 생산자로 분리",
    summary: "Backend 내부에서 데이터를 만들던 구조를 제거하고 실제 게이트웨이처럼 HTTP API만 사용하는 독립 Python 프로세스로 전환했습니다.",
    story: {
      type: "solution",
      problem: "애플리케이션 안에서 센서 데이터를 직접 생성하면 수신 API를 거치지 않아 외부 장치 연동 경계와 실패 상황을 검증하기 어려웠습니다.",
      cause: "데모 데이터 생성기가 Backend의 수명주기와 저장 구현에 결합돼 실제 producer와 다른 경로를 사용했습니다.",
      decision: "내장 simulator를 제거하고 Backend HTTP API만 호출하는 독립 Python 프로세스로 분리했습니다. 이후 실측 CSV replay와 운영시간 기반 synthetic 모드를 같은 producer 경계에 추가했습니다.",
      outcome: "Backend를 수정하지 않고 데이터 소스를 교체할 수 있고, 인증·부분 실패·재시도까지 실제 수신 경로에서 검증할 수 있게 됐습니다.",
    },
    tags: ["Python", "API Boundary"],
  },
  {
    slug: "home-server-core",
    date: "2026-07-17",
    category: "Home Server",
    repository: "personal-hub",
    title: "독립 서비스를 위한 홈서버 운영 기반 구축",
    summary: "Compose와 nginx, PostgreSQL, 상태 집계를 하나의 운영 단위로 묶고 서비스별 수명주기와 데이터 경계를 분리했습니다.",
    story: {
      type: "implementation",
      goal: "서로 다른 애플리케이션을 한 서버에서 운영하면서도 배포, 네트워크, 데이터의 경계를 독립적으로 유지해야 했습니다.",
      implementation: "Docker Compose 내부 네트워크와 nginx 진입점, 영속 데이터 볼륨을 구성하고 각 서비스의 health 응답을 허브에서 통합했습니다.",
      decision: "공개 주소를 다시 호출하지 않고 환경별 컨테이너 URL을 서버에 주입했으며, health 계약은 HTTP 200과 status UP으로 통일했습니다.",
      outcome: "서비스를 개별 교체해도 다른 컨테이너와 데이터 볼륨을 유지할 수 있고, 공개 화면에서 운영 상태를 일관되게 확인할 수 있게 됐습니다.",
    },
    tags: ["Docker Compose", "Observability"],
  },
  {
    slug: "synchronous-ingest-pipeline",
    date: "2026-07-15",
    category: "Service Integration",
    repository: "sensor-monitor",
    title: "센서 수신 파이프라인을 동기 처리로 단순화",
    summary: "현재 운영 규모에 맞춰 Kafka fan-out을 제거하고 저장부터 임계 판정과 알림 생성까지 하나의 트랜잭션으로 묶었습니다.",
    story: {
      type: "decision",
      background: "센서 수신 경로가 메시지 브로커를 거치면서 구성 요소는 늘었지만, 현재 규모에서는 비동기 분산 처리의 운영 이점이 충분하지 않았습니다.",
      options: "Kafka 기반 fan-out을 유지하는 방식과, 데이터 저장·상태 갱신·임계 판정·알림 생성을 한 트랜잭션에서 처리하는 방식을 비교했습니다.",
      decision: "실패 경계와 데이터 정합성을 먼저 명확히 하기 위해 동기 트랜잭션 파이프라인을 선택했습니다.",
      outcome: "센서 저장과 상태 갱신의 원자성을 확보하고, 실패 데이터와 freshness 판정이 어디에서 이뤄지는지 단순하게 추적할 수 있게 됐습니다.",
    },
    tags: ["Spring Boot", "Transactions"],
  },
  {
    slug: "factory-zone-access-model",
    date: "2026-07-15",
    category: "Service Integration",
    repository: "sensor-monitor",
    title: "조직 권한을 Factory·Zone 접근 모델로 전환",
    summary: "추상적인 조직 계층과 여섯 역할을 제조 현장의 공장·구역 범위와 네 역할로 단순화했습니다.",
    story: {
      type: "decision",
      background: "Organization·Group과 여섯 단계 역할은 범용적으로 보였지만, 제조 센서 데이터에서 누가 어떤 설비를 볼 수 있는지 직관적으로 설명하기 어려웠습니다.",
      options: "범용 조직 모델을 유지하는 방식과, Factory·Zone·ZoneUser를 명시하고 역할별 데이터 범위를 계산하는 방식을 비교했습니다.",
      decision: "도메인을 Factory와 Zone으로 바꾸고 역할은 SYSTEM_ADMIN·FACTORY_ADMIN·MEMBER·VIEWER로 줄였습니다. 접근 가능한 device id 계산은 AccessControlService 한 곳에 모았습니다.",
      outcome: "관리자·사용자의 조회 및 변경 범위가 실제 설비 계층과 일치하고, REST와 SSE가 같은 접근 범위 규칙을 사용할 수 있게 됐습니다.",
    },
    tags: ["RBAC", "Domain Design"],
  },
  {
    slug: "realtime-explain-boundary",
    date: "2026-07-15",
    category: "Service Integration",
    repository: "sensor-monitor",
    title: "이상 탐지와 설명 생성을 별도 서비스로 분리",
    summary: "Spring의 규칙 기반 탐지 결과를 커밋 후 SSE로 전달하고, Python 서비스는 이상 근거와 권고 생성만 담당하도록 경계를 나눴습니다.",
    story: {
      type: "decision",
      background: "센서 이상 판정과 LLM 설명 생성을 같은 처리 경로에 두면 외부 API 지연이나 실패가 데이터 저장과 탐지 결과까지 흔들 수 있었습니다.",
      options: "LLM이 이상 여부까지 판단하는 방식과, Spring이 규칙으로 탐지한 뒤 FastAPI 서비스가 설명과 권고만 보강하는 방식을 비교했습니다.",
      decision: "탐지는 Spring의 임계값·freshness 규칙으로 유지하고 explain 서비스를 HTTP 경계로 분리했습니다. 저장·알림 이벤트는 트랜잭션 커밋 뒤 SSE로 보내며 외부 설명 호출은 수신 트랜잭션 밖에서 수행합니다.",
      outcome: "LLM provider를 echo와 Gemini 사이에서 교체해도 탐지와 저장 정합성이 유지되고, 대시보드는 확정된 데이터만 실시간으로 받을 수 있게 됐습니다.",
    },
    tags: ["FastAPI", "SSE", "Architecture"],
  },
  {
    slug: "manufacturing-monitoring-scope",
    date: "2026-07-14",
    category: "Service Integration",
    repository: "sensor-monitor",
    title: "제조 센서 모니터링으로 제품 범위 재정의",
    summary: "범용 IoT 플랫폼 확장보다 게이트웨이 이후의 제조 센서 수집·관측·설명에 집중하도록 프로젝트 범위를 좁혔습니다.",
    story: {
      type: "decision",
      background: "범용 IoT 플랫폼을 목표로 하면 장치 프로토콜, 클라우드 인프라, 분산 처리까지 범위가 넓어져 핵심 사용 흐름을 검증하기 어려웠습니다.",
      options: "플랫폼 기능을 넓게 구현하는 방향과, 제조 현장의 수집·관측·이상 설명을 로컬에서 완결된 데모로 만드는 방향을 비교했습니다.",
      decision: "게이트웨이 이후의 데이터 경로에 집중하고 Factory·Zone·Device·Channel 용어로 도메인을 정리했습니다. 클라우드와 MSA 확장은 운영 근거가 생길 때까지 보류했습니다.",
      outcome: "구현 우선순위가 센서 수신, 운영 화면, 재현 가능한 데이터, 설명 경로로 좁혀져 하나의 시나리오로 연결할 수 있게 됐습니다.",
    },
    tags: ["Architecture", "Product Scope"],
  },
];

const recentWorkLogSlugs = new Set(["nextjs-hub-migration", "physical-device-channel-model", "public-routing"]);

export const recentWorkLogs = workLogs.filter((entry) => recentWorkLogSlugs.has(entry.slug));
