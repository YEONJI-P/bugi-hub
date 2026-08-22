import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Infrastructure",
  description: "GCP 단일 VM의 공개 라우팅, 독립 서비스 배포와 안전한 데이터 경계",
};

const operatingModel = [
  {
    label: "Runtime",
    title: "GCP Compute Engine 단일 VM",
    summary: "오리건 us-west1의 e2-medium과 Debian 13에서 하나의 Compose project를 실행합니다.",
    reason: "현재 트래픽에서는 서비스를 여러 관리형 플랫폼으로 나누는 비용보다 단일 운영 경계를 유지하는 편이 단순합니다.",
  },
  {
    label: "Ingress",
    title: "Cloudflare proxy와 nginx",
    summary: "Cloudflare DNS가 고정 IP의 nginx 80/443으로 요청을 전달하고 각 서비스는 독립 hostname의 루트에서 동작합니다.",
    reason: "애플리케이션과 PostgreSQL 포트를 공개하지 않고 공개 진입점만 nginx로 제한합니다.",
  },
  {
    label: "Storage",
    title: "PostgreSQL 전용 Persistent Disk",
    summary: "VM boot disk와 분리된 20GB pd-balanced disk에 PostgreSQL 데이터를 보관하고 서비스별 database와 role을 유지합니다.",
    reason: "VM 교체와 애플리케이션 배포에서 데이터 수명주기를 분리하기 위해서입니다.",
  },
  {
    label: "Deployment",
    title: "승인한 revision만 수동 배포",
    summary: "private self-hosted runner의 GitHub Actions workflow가 선택한 main revision과 불변 SHA 이미지를 적용합니다.",
    reason: "main push만으로 운영 환경을 바꾸지 않고 배포 시점과 rollback 좌표를 명시적으로 관리합니다.",
  },
  {
    label: "Recovery",
    title: "검증된 backup과 직전 이미지 보존",
    summary: "논리 backup·row 기준선·직전 image를 보존하고 VM 재부팅과 TLS 갱신 경로를 별도로 검증합니다.",
    reason: "데이터·애플리케이션·호스트 복구를 한 번에 되돌리지 않고 경계별로 확인하기 위해서입니다.",
  },
];

export default function HomeServerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Infrastructure project"
        title="Infrastructure"
        description="독립 애플리케이션을 GCP 단일 VM의 Docker Compose로 실행하고 nginx 라우팅, 이미지 pin, PostgreSQL Persistent Disk와 rollback 경계를 관리합니다."
        badge={<span className="running-badge"><i />운영 중</span>}
        actions={
          <div className="button-links">
            <Link className="primary-button" href="/work-log?repo=home-server">운영 작업 기록 →</Link>
          </div>
        }
      />

      <section className="content-section" aria-labelledby="server-boundary-heading">
        <div className="section-label">
          <span className="eyebrow" id="server-boundary-heading">System boundary</span>
          <span className="mono-meta">GCP 운영 접점</span>
        </div>
        <div className="scope-grid">
          <article className="scope-card scope-card-primary">
            <span>IN SCOPE</span>
            <h2>라우팅과 실행 버전, 데이터 경계를 관리합니다</h2>
            <ul>
              <li>GCP VM과 PostgreSQL Persistent Disk</li>
              <li>Cloudflare proxied DNS와 nginx 공개 라우팅</li>
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
              <li>nginx 이외 애플리케이션·DB 포트 공개</li>
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
        <div className="architecture-map" aria-label="인터넷 요청이 Cloudflare proxy와 GCP 고정 IP의 nginx를 거쳐 Bugi Hub Web 또는 독립 서비스로 전달되는 구조">
          <article className="architecture-stage">
            <span>PUBLIC EDGE</span>
            <h2>Cloudflare DNS · Proxy</h2>
            <p>서비스별 hostname 요청을 GCP의 고정 origin IP로 전달하고 외부 접점을 한곳에서 관리합니다.</p>
          </article>

          <span className="architecture-arrow" aria-hidden="true">→</span>

          <article className="architecture-stage architecture-core">
            <span>GCP COMPUTE ENGINE</span>
            <h2>nginx와 Compose가 공개·내부 경계를 나눕니다</h2>
            <ol>
              <li><b>01</b><span>80/443에서 TLS와 hostname 구분</span></li>
              <li><b>02</b><span>서비스별 Docker upstream 선택</span></li>
              <li><b>03</b><span>Sensor ingest의 method·rate·body·인증 제한</span></li>
              <li><b>04</b><span>Persistent Disk의 PostgreSQL 연결</span></li>
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
          <span className="eyebrow" id="server-decisions-heading">Operating model</span>
          <Link className="section-link" href="/work-log?repo=home-server">운영 작업 기록 →</Link>
        </div>
        <div className="decision-grid">
          {operatingModel.map((decision, index) => (
            <article className="decision-card" key={decision.label}>
              <div className="decision-card-head">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{decision.label}</small>
              </div>
              <h2>{decision.title}</h2>
              <p className="decision-summary">{decision.summary}</p>
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
            <li><span>02</span>논리 backup과 checksum, row 기준선을 복구 좌표로 보존합니다.</li>
            <li><span>03</span>검증된 40자리 SHA 이미지와 정확한 main revision만 배포합니다.</li>
            <li><span>04</span>내부 health와 공개 route, ingest 제한을 함께 확인합니다.</li>
            <li><span>05</span>실패하면 Git·DB를 건드리지 않고 직전 이미지로 되돌립니다.</li>
          </ol>
        </div>
      </section>
    </>
  );
}
