import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Personal Hub",
  description: "Personal Hub의 홈서버 운영 경계와 서비스 통합 구조, 주요 설계 결정",
};

const designDecisions = [
  {
    label: "Public ingress",
    title: "공개 경로와 관리 경로 분리",
    before: "Tailscale 주소와 홈서버 포트 공개를 함께 고려",
    current: "공개 요청은 outbound Cloudflare Tunnel로만 받고 Tailscale은 SSH 관리에만 사용",
    reason: "공인 origin IP와 공유기 포트포워딩 없이 공개 범위를 nginx 앞단으로 한정하기 위해서입니다.",
  },
  {
    label: "Routing",
    title: "서비스별 독립 origin 유지",
    before: "하나의 도메인 아래 base path로 여러 앱을 연결",
    current: "apex는 Personal Hub, 외부 서비스는 각 subdomain의 루트에서 제공",
    reason: "서비스 편입 때문에 asset·redirect·API 경로를 수정하지 않고 각 앱의 배포 독립성을 지키기 위해서입니다.",
  },
  {
    label: "Service ownership",
    title: "코드와 운영 접점의 소유권 분리",
    before: "서로 다른 런타임의 서비스 코드와 배포 구성을 한 저장소에서 함께 변경",
    current: "각 저장소는 코드·테스트·이미지를, Personal Hub는 compose·routing·health 접점을 소유",
    reason: "서비스 내부 구현을 침범하지 않으면서 홈서버에서 실행되는 버전과 연결 계약을 한곳에서 관리하기 위해서입니다.",
  },
  {
    label: "Deployment",
    title: "검증된 SHA를 배포 좌표로 사용",
    before: "가변 tag를 pull해 실행 결과가 시점에 따라 달라질 수 있는 방식",
    current: "원본 저장소의 CI를 통과한 commit SHA 이미지와 migration 조건을 확인한 뒤 반영",
    reason: "실행 중인 코드의 근거를 남기고 schema 호환성이 없는 변경은 자동 배포에서 분리하기 위해서입니다.",
  },
  {
    label: "Health boundary",
    title: "공개 라우팅과 내부 감시 분리",
    before: "외부 도메인 응답만으로 서비스와 내부 의존성 상태를 함께 판단",
    current: "Next.js 상태 API가 Docker 내부 health URL과 PostgreSQL 연결을 각각 확인",
    reason: "Tunnel·DNS 장애와 애플리케이션·데이터베이스 장애를 구분하고 브라우저에는 최소 상태만 전달하기 위해서입니다.",
  },
];

export default function PersonalHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Infrastructure project"
        title="Personal Hub"
        description="서로 다른 프로젝트를 독립 컨테이너로 유지하면서 공개 라우팅, 배포 버전, 데이터베이스와 상태 확인 접점을 하나의 운영 계약으로 묶는 개인 홈서버 플랫폼입니다."
        badge={<span className="running-badge"><i />운영 중</span>}
        actions={
          <div className="button-links">
            <Link className="primary-button" href="/work-log?repo=personal-hub">설계 변화 기록 →</Link>
            <a href="https://github.com/YEONJI-P/personal-hub" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        }
      />

      <section className="content-section" aria-labelledby="hub-boundary-heading">
        <div className="section-label">
          <span className="eyebrow" id="hub-boundary-heading">System boundary</span>
          <span className="mono-meta">운영 접점</span>
        </div>
        <div className="scope-grid">
          <article className="scope-card scope-card-primary">
            <span>IN SCOPE</span>
            <h2>서비스가 홈서버에서 만나는 지점을 책임합니다</h2>
            <ul>
              <li>Cloudflare Tunnel과 nginx 공개 라우팅</li>
              <li>독립 컨테이너의 네트워크와 실행 버전</li>
              <li>서비스별 health URL과 통합 상태 표시</li>
              <li>공유 PostgreSQL의 database·role 경계</li>
              <li>TLS 갱신과 비파괴 배포·rollback 절차</li>
            </ul>
          </article>
          <article className="scope-card">
            <span>OUT OF SCOPE</span>
            <h2>편입한 서비스의 내부 구현은 소유하지 않습니다</h2>
            <ul>
              <li>Sensor Monitor의 도메인·API·화면 구현</li>
              <li>서비스 편입을 위한 base path 강제</li>
              <li>공인 IP 노출과 공유기 포트포워딩</li>
              <li>검증되지 않은 이미지의 자동 배포</li>
              <li>서비스 간 database·credential 공유</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="content-section" aria-labelledby="hub-architecture-heading">
        <div className="section-label">
          <span className="eyebrow" id="hub-architecture-heading">Architecture</span>
          <span className="mono-meta">공개 요청 기준</span>
        </div>
        <div className="architecture-map" aria-label="인터넷 요청이 Cloudflare Tunnel과 nginx를 거쳐 Personal Hub 또는 독립 Sensor Monitor 서비스로 전달되는 구조">
          <article className="architecture-stage">
            <span>PUBLIC EDGE</span>
            <h2>Cloudflare Tunnel</h2>
            <p>홈서버 connector가 만든 outbound 연결을 통해 hostname별 HTTPS 요청만 origin으로 전달합니다.</p>
          </article>

          <span className="architecture-arrow" aria-hidden="true">→</span>

          <article className="architecture-stage architecture-core">
            <span>HOME SERVER EDGE</span>
            <h2>nginx가 공개 경계를 결정합니다</h2>
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
              <h2>Next.js · Personal Hub</h2>
              <p>프로젝트 설명과 Work Log를 제공하고 내부 서비스·PostgreSQL 상태를 집계합니다.</p>
            </article>
            <article>
              <span>SERVICE ORIGIN</span>
              <h2>Independent services</h2>
              <p>Sensor Monitor처럼 별도 저장소와 이미지 수명주기를 가진 서비스를 subdomain으로 연결합니다.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section" aria-labelledby="hub-decisions-heading">
        <div className="section-label">
          <span className="eyebrow" id="hub-decisions-heading">Design decisions</span>
          <Link className="section-link" href="/work-log?repo=personal-hub">설계 변화 기록 →</Link>
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

      <section className="content-section" aria-labelledby="hub-safety-heading">
        <div className="section-label">
          <span className="eyebrow" id="hub-safety-heading">Change safety</span>
          <span className="mono-meta">비파괴 전환</span>
        </div>
        <div className="integration-card">
          <div><h2>되돌릴 수 있는 경계를<br />먼저 확보한 뒤 전환합니다</h2></div>
          <ol>
            <li><span>01</span>현재 컨테이너·설정·데이터베이스 상태를 먼저 확인합니다.</li>
            <li><span>02</span>기존 이미지와 database backup을 rollback 좌표로 보존합니다.</li>
            <li><span>03</span>변경 대상 서비스만 build·교체하고 다른 서비스는 건드리지 않습니다.</li>
            <li><span>04</span>내부 health와 공개 route, 접근 차단 경계를 함께 검증합니다.</li>
            <li><span>05</span>schema 호환성이 확인된 변경만 자동 배포 대상으로 확장합니다.</li>
          </ol>
        </div>
      </section>
    </>
  );
}
