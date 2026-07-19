export type WorkCategory = "Home Server" | "Service Integration";

export interface WorkLogEntry {
  slug: string;
  date: string;
  category: WorkCategory;
  title: string;
  summary: string;
  details: string[];
  tags: string[];
}

export const workLogs: WorkLogEntry[] = [
  {
    slug: "nextjs-hub-migration",
    date: "2026-07-19",
    category: "Home Server",
    title: "Bugi Hub를 Next.js로 전환하기로 결정",
    summary: "프로젝트 목록을 DB에서 관리하지 않고 정적인 소개 화면과 서버 상태 API에 집중하도록 구조를 단순화했습니다.",
    details: ["기존 Spring 앱은 검증이 끝날 때까지 보존", "상태 확인은 Next.js Route Handler에서 담당", "작업 기록은 선별해 수동으로 공개"],
    tags: ["Next.js", "Architecture"],
  },
  {
    slug: "sensor-image-update-flow",
    date: "2026-07-19",
    category: "Service Integration",
    title: "Sensor 이미지 갱신 흐름 정리",
    summary: "CI에서 만든 이미지를 검토 가능한 변경으로 연결하고 홈서버가 정해진 주기로 반영하는 운영 흐름을 정리했습니다.",
    details: ["애플리케이션 저장소와 배포 저장소의 책임 분리", "자동 반영 전 변경 검토 단계 유지", "실패 시 기존 컨테이너를 유지하는 방향"],
    tags: ["CI", "Docker"],
  },
  {
    slug: "public-routing",
    date: "2026-07-18",
    category: "Home Server",
    title: "Tunnel 기반 외부 공개 경로 구성",
    summary: "홈 네트워크의 포트를 직접 열지 않고 outbound tunnel과 nginx를 통해 서비스별 origin을 연결했습니다.",
    details: ["공개 라우팅과 컨테이너 내부 감시 주소 분리", "서비스별 독립 origin 유지", "애플리케이션 포트 직접 공개 방지"],
    tags: ["Cloudflare Tunnel", "nginx"],
  },
  {
    slug: "sensor-service-boundary",
    date: "2026-07-18",
    category: "Service Integration",
    title: "Sensor Monitor 운영 접점 연결",
    summary: "Backend와 Explain의 health, 공개 라우팅, 전용 데이터베이스 경계를 Personal Hub 계약에 연결했습니다.",
    details: ["두 프로세스의 health를 각각 감시", "센서 적재 경로는 공개 프록시에서 차단", "공유 PostgreSQL 안에서 전용 database와 role 사용"],
    tags: ["Health Check", "PostgreSQL"],
  },
  {
    slug: "home-server-core",
    date: "2026-07-17",
    category: "Home Server",
    title: "홈서버 기본 실행 단위 구성",
    summary: "Docker Compose를 기준으로 nginx, 데이터베이스, 허브 서비스를 하나의 운영 단위로 묶었습니다.",
    details: ["서비스 이름으로 연결되는 내부 네트워크", "nginx를 단일 공개 진입점으로 사용", "데이터 볼륨과 애플리케이션 수명주기 분리"],
    tags: ["Docker Compose", "nginx"],
  },
  {
    slug: "monitoring-targets",
    date: "2026-07-16",
    category: "Home Server",
    title: "설정 기반 상태 감시 분리",
    summary: "공개 주소 대신 컨테이너 내부 URL을 환경별로 주입해 서비스 상태를 확인하도록 경계를 정리했습니다.",
    details: ["health 응답 계약을 HTTP 200과 status UP으로 통일", "대상 URL은 서버에서만 사용", "화면은 통합된 상태 응답만 소비"],
    tags: ["Observability", "API"],
  },
];

export const recentWorkLogs = workLogs.slice(0, 3);
