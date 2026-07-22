import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Home Server",
  description: "Home Server의 공개 라우팅, 독립 서비스 배포와 안전한 변경 경계",
};

const designDecisions = [
  {
    label: "Public ingress",
    title: "공개 경로와 관리 경로 분리",
    before: "홈 네트워크에 inbound 포트를 열고 같은 경로로 운영 관리",
    current: "공개 요청은 outbound Cloudflare Tunnel로만 받고 Tailscale은 SSH 관리에만 사용",
    reason: "공인 origin IP와 공유기 포트포워딩 없이 공개 범위를 nginx 앞단으로 한정하기 위해서입니다.",
  },
  {
    label: "Routing",
    title: "서비스별 독립 origin 유지",
    before: "하나의 도메인 아래 base path로 여러 앱을 연결",
    current: "Bugi Hub Web과 외부 서비스가 각 hostname의 루트에서 동작",
    reason: "인프라 편입 때문에 asset·redirect·API 경로를 수정하지 않고 앱의 배포 독립성을 지키기 위해서입니다.",
  },
  {
    label: "Ownership",
    title: "애플리케이션과 배포 설정의 소유권 분리",
    before: "서비스 코드와 홈서버 설정을 한 저장소에서 함께 변경",
    current: "각 앱은 코드·테스트·이미지를, Home Server는 Compose·routing·pin을 소유",
    reason: "서비스 내부 구현을 침범하지 않으면서 운영 서버의 실행 버전과 연결 계약을 한곳에서 관리하기 위해서입니다.",
  },
  {
    label: "Deployment",
    title: "검증된 SHA를 배포 좌표로 사용",
    before: "가변 tag를 pull해 실행 결과가 시점에 따라 달라질 수 있는 방식",
    current: "애플리케이션 CI를 통과한 commit SHA 이미지를 Compose에 직접 고정",
    reason: "현재 실행 중인 코드를 추적하고 실패 시 직전 이미지 reference로 되돌리기 위해서입니다.",
  },
  {
    label: "Data boundary",
    title: "공유 인스턴스 안에서도 서비스별 DB 경계 유지",
    before: "서비스가 같은 database와 credential을 함께 사용할 수 있는 구조",
    current: "PostgreSQL 인스턴스만 공유하고 서비스별 database와 role을 분리",
    reason: "운영 자원은 절약하면서 migration과 접근 권한의 소유권은 서비스별로 유지하기 위해서입니다.",
  },
];

export default function HomeServerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Infrastructure project"
        title="Home Server"
        description="독립 애플리케이션을 Docker Compose로 실행하고 Cloudflare Tunnel·nginx 라우팅, 이미지 pin, PostgreSQL과 rollback 경계를 관리하는 홈서버입니다."
        badge={<span className="running-badge"><i />운영 중</span>}
        actions={
          <div className="button-links">
            <Link className="primary-button" href="/work-log?repo=home-server">운영 작업 기록 →</Link>
            <a href="https://github.com/YEONJI-P/home-server-infra" target="_blank" rel="noreferrer">GitHub · 공개 예정 ↗</a>
          </div>
        }
      />

      <section className="content-section" aria-labelledby="server-boundary-heading">
        <div className="section-label">
          <span className="eyebrow" id="server-boundary-heading">System boundary</span>
          <span className="mono-meta">운영 접점</span>
        </div>
        <div className="scope-grid">
          <article className="scope-card scope-card-primary">
            <span>IN SCOPE</span>
            <h2>라우팅과 실행 버전, 데이터 경계를 관리합니다</h2>
            <ul>
              <li>Cloudflare Tunnel과 nginx 공개 라우팅</li>
              <li>서비스별 Docker 네트워크와 image pin</li>
              <li>컨테이너 health와 공개 route 검증</li>
              <li>공유 PostgreSQL의 database·role 경계</li>
              <li>TLS 갱신과 비파괴 rollback 절차</li>
            </ul>
          </article>
          <article className="scope-card">
            <span>OUT OF SCOPE</span>
            <h2>각 애플리케이션의 코드는 원래 저장소가 소유합니다</h2>
            <ul>
              <li>Bugi Hub Web 화면과 상태 API 구현</li>
              <li>Sensor Monitor 도메인·API·화면 구현</li>
              <li>서비스 편입을 위한 base path 강제</li>
              <li>공인 IP 노출과 공유기 포트포워딩</li>
              <li>서비스 간 database·credential 공유</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="content-section" aria-labelledby="server-architecture-heading">
        <div className="section-label">
          <span className="eyebrow" id="server-architecture-heading">Architecture</span>
          <span className="mono-meta">공개 요청 기준</span>
        </div>
        <div className="architecture-map" aria-label="인터넷 요청이 Cloudflare Tunnel과 nginx를 거쳐 Bugi Hub Web 또는 독립 서비스로 전달되는 구조">
          <article className="architecture-stage">
            <span>PUBLIC EDGE</span>
            <h2>Cloudflare Tunnel</h2>
            <p>홈서버 connector의 outbound 연결을 통해 hostname별 HTTPS 요청만 origin으로 전달합니다.</p>
          </article>

          <span className="architecture-arrow" aria-hidden="true">→</span>

          <article className="architecture-stage architecture-core">
            <span>HOME SERVER EDGE</span>
            <h2>nginx가 hostname과 공개 경계를 확인합니다</h2>
            <ol>
              <li><b>01</b><span>origin TLS 검증과 hostname 구분</span></li>
              <li><b>02</b><span>서비스별 Docker upstream 선택</span></li>
              <li><b>03</b><span>외부 ingest 같은 비공개 경로 차단</span></li>
              <li><b>04</b><span>각 앱의 origin 루트로 요청 전달</span></li>
            </ol>
          </article>

          <span className="architecture-arrow" aria-hidden="true">→</span>

          <div className="architecture-outputs">
            <article>
              <span>APEX ORIGIN</span>
              <h2>Next.js · Bugi Hub Web</h2>
              <p>프로젝트와 Work Log를 제공하고 내부 서비스·PostgreSQL 상태를 집계합니다.</p>
            </article>
            <article>
              <span>SERVICE ORIGIN</span>
              <h2>Independent services</h2>
              <p>Sensor Monitor처럼 별도 저장소와 이미지 수명주기를 가진 서비스를 연결합니다.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section" aria-labelledby="server-decisions-heading">
        <div className="section-label">
          <span className="eyebrow" id="server-decisions-heading">Design decisions</span>
          <Link className="section-link" href="/work-log?repo=home-server">운영 작업 기록 →</Link>
        </div>
        <div className="decision-grid">
          {designDecisions.map((decision, index) => (
            <article className="decision-card" key={decision.label}>
              <div className="decision-card-head">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{decision.label}</small>
              </div>
              <h2>{decision.title}</h2>
              <div className="decision-shift">
                <div><span>이전</span><p>{decision.before}</p></div>
                <i aria-hidden="true">→</i>
                <div><span>현재</span><p>{decision.current}</p></div>
              </div>
              <p className="decision-reason">{decision.reason}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="server-safety-heading">
        <div className="section-label">
          <span className="eyebrow" id="server-safety-heading">Change safety</span>
          <span className="mono-meta">비파괴 배포</span>
        </div>
        <div className="integration-card">
          <div><h2>컨테이너와 데이터의<br />복구 지점을 지키며 바꿉니다</h2></div>
          <ol>
            <li><span>01</span>현재 image reference와 Git·DB 상태를 먼저 확인합니다.</li>
            <li><span>02</span>검증된 40자리 SHA 이미지만 배포 좌표로 사용합니다.</li>
            <li><span>03</span>변경 대상 서비스만 교체하고 volume은 유지합니다.</li>
            <li><span>04</span>내부 health와 공개 route, 접근 차단을 함께 확인합니다.</li>
            <li><span>05</span>실패하면 Git·DB를 건드리지 않고 직전 이미지로 되돌립니다.</li>
          </ol>
        </div>
      </section>
    </>
  );
}
