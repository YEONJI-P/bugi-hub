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
    slug: "sensor-image-update-flow",
    date: "2026-07-19",
    category: "Service Integration",
    repository: "sensor-monitor",
    title: "검토 가능한 이미지 배포 흐름 구축",
    summary: "애플리케이션 빌드와 홈서버 반영 사이에 검토 단계를 두고, 동일 커밋에서 만든 이미지를 추적할 수 있게 했습니다.",
    story: {
      type: "solution",
      problem: "홈서버가 최신 태그를 바로 따라가면 어떤 소스가 배포됐는지 확인하기 어렵고, 스키마 변경이 포함된 릴리스도 같은 방식으로 교체될 수 있었습니다.",
      cause: "애플리케이션 저장소의 이미지 생성과 배포 저장소의 버전 선택이 명시적인 계약 없이 이어져 있었습니다.",
      decision: "Backend와 Explain 이미지를 같은 commit SHA로 발행하고, 배포 저장소의 버전 변경을 검토한 뒤 홈서버가 반영하도록 책임을 나눴습니다.",
      outcome: "실행 중인 소스 버전을 추적할 수 있게 됐고, 자동 반영이 실패하거나 수동 검증이 필요한 릴리스에서는 기존 컨테이너를 유지할 수 있게 됐습니다.",
    },
    tags: ["CI", "Docker", "GHCR"],
  },
  {
    slug: "sensor-channel-operations-ui",
    date: "2026-07-19",
    category: "Service Integration",
    repository: "sensor-monitor",
    title: "장치·채널 중심 운영 화면 설계",
    summary: "운영자가 구역에서 장치를 찾고 채널 이상을 확인하는 흐름에 맞춰 대시보드와 관리 화면을 재구성했습니다.",
    story: {
      type: "implementation",
      goal: "센서 종류별 화면이 아니라 실제 설비 위치와 물리 장치를 기준으로 이상 채널을 빠르게 좁힐 수 있는 운영 흐름이 필요했습니다.",
      implementation: "구역 → 장치 → 채널 탐색 구조를 만들고, 대표 채널 20개와 실시간 값, 저장 시점 marker를 한 화면 흐름으로 연결했습니다.",
      decision: "실시간 값이 들어올 때마다 축이 흔들리지 않도록 시간축을 고정하고, 장치 단위 batch 이벤트로 화면을 갱신했습니다.",
      outcome: "현재 값과 저장된 이력을 같은 맥락에서 비교하고, 문제가 발생한 물리 장치와 채널까지 단계적으로 추적할 수 있게 됐습니다.",
    },
    tags: ["Dashboard", "SSE"],
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
    date: "2026-07-18",
    category: "Service Integration",
    repository: "sensor-monitor",
    title: "센서 수신과 사용자 인증 경계 분리",
    summary: "사람용 로그인과 장치 수신을 분리하고, 저장된 설정과 실시간 연결 상태의 책임을 명확히 했습니다.",
    story: {
      type: "solution",
      problem: "사용자 JWT 흐름과 장치의 지속적인 데이터 수신을 같은 인증 모델로 다루면 권한과 장애 범위를 구분하기 어려웠습니다.",
      cause: "사람의 세션 수명주기, 장치 공유 키, heartbeat와 alarm 상태가 서로 다른 특성을 갖지만 하나의 런타임 경계에 섞여 있었습니다.",
      decision: "수신 전용 공유 키 검증을 분리하고, Refresh Token과 장치 설정은 PostgreSQL에 보존하되 heartbeat와 alarm은 별도 상태 모델로 관리했습니다.",
      outcome: "공유 키가 없는 적재 요청을 차단하면서 사용자 인증과 장치 연결 장애를 독립적으로 진단할 수 있게 됐습니다.",
    },
    tags: ["Security", "PostgreSQL"],
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
    slug: "reproducible-demo-topology",
    date: "2026-07-18",
    category: "Service Integration",
    repository: "sensor-monitor",
    title: "재현 가능한 센서 데모 파이프라인 구성",
    summary: "새 환경에서도 동일한 설비 구조가 만들어지고, 시뮬레이터부터 저장·실시간 화면·설명 서비스까지 데이터가 흐르도록 연결했습니다.",
    story: {
      type: "implementation",
      goal: "로컬과 공개 환경에서 별도 수작업 없이 같은 공장·구역·장치 구조와 데이터 흐름을 재현해야 했습니다.",
      implementation: "Flyway로 기준 topology를 만들고, 독립 Python simulator가 물리 장치 단위 batch를 전송하며 SSE 화면과 FastAPI 설명 서비스가 이를 소비하도록 연결했습니다.",
      decision: "무작위 데이터만 생성하지 않고 실측 CSV replay도 지원했으며, simulator와 Backend의 수명주기를 분리했습니다.",
      outcome: "빈 데이터베이스에서도 데모 환경을 반복 생성하고, 수신부터 시각화와 설명까지 전체 경로를 한 번에 확인할 수 있게 됐습니다.",
    },
    tags: ["Simulator", "SSE", "FastAPI"],
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

const recentWorkLogSlugs = new Set(["nextjs-hub-migration", "sensor-image-update-flow", "public-routing"]);

export const recentWorkLogs = workLogs.filter((entry) => recentWorkLogSlugs.has(entry.slug));
