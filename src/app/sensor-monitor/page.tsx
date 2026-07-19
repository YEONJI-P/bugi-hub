import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sensor Monitor",
  description: "Sensor Monitor의 데이터 처리 흐름과 Personal Hub 운영 접점",
};

export default function SensorMonitorPage() {
  return (
    <>
      <header className="detail-hero">
        <div className="hero-meta"><span className="eyebrow">Featured project</span><span className="running-badge"><i />운영 중</span></div>
        <h1>Sensor<br />Monitor</h1>
        <p>제조 설비의 센서 데이터를 수집하고, 임계값 이탈과 수신 중단을 감지하며, 이상 징후의 근거와 권고를 제공하는 모니터링 서비스입니다.</p>
        <div className="button-links">
          <a className="primary-button" href="https://sensor.bugihub.site" target="_blank" rel="noreferrer">라이브 서비스 ↗</a>
          <a href="https://github.com/YEONJI-P/sensor-monitor" target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </header>

      <section className="content-section" aria-labelledby="overview-heading">
        <div className="section-label"><span className="eyebrow" id="overview-heading">Overview</span><span className="mono-meta">하는 일</span></div>
        <div className="fact-grid">
          {[
            ["01", "수집과 감시", "게이트웨이가 보낸 측정값을 저장하고, 방향별 임계값과 기대 수신 주기를 기준으로 이상을 판정합니다."],
            ["02", "실시간 전달", "저장과 알림 생성이 끝난 뒤 SSE 이벤트를 전달해 대시보드가 최신 측정값과 알림을 갱신합니다."],
            ["03", "설명 보강", "명시적인 규칙이 이상을 탐지하고, 별도 Explain 서비스가 알림의 근거와 권고를 보강합니다."],
          ].map(([index, title, body]) => (
            <article className="fact-card" key={index}><span>{index}</span><h2>{title}</h2><p>{body}</p></article>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="flow-heading">
        <div className="section-label"><span className="eyebrow" id="flow-heading">Processing flow</span><span className="mono-meta">수집부터 설명까지</span></div>
        <div className="process-flow" aria-label="게이트웨이에서 Backend와 PostgreSQL을 거쳐 대시보드와 Explain 서비스로 이어지는 처리 흐름">
          <FlowNode title="Gateway" detail="HTTP · JSON" />
          <span className="flow-arrow">→</span>
          <FlowNode title="Sensor Backend" detail="검증 · 저장 · 감지" accent />
          <span className="flow-arrow">→</span>
          <FlowNode title="PostgreSQL" detail="시계열 · 알림 이력" />
          <div className="flow-outputs"><FlowNode title="Dashboard" detail="SSE" /><FlowNode title="Explain" detail="근거 · 권고" /></div>
        </div>
      </section>

      <section className="content-section integration-card" aria-labelledby="integration-heading">
        <div><span className="eyebrow" id="integration-heading">Personal Hub integration</span><h2>서비스 코드는 독립적으로,<br />운영 접점은 하나의 계약으로</h2></div>
        <ol>
          <li><span>01</span>독립된 Sensor origin을 Tunnel과 nginx가 연결합니다.</li>
          <li><span>02</span>Backend와 Explain health를 내부 URL로 각각 감시합니다.</li>
          <li><span>03</span>공유 PostgreSQL 안에서도 전용 database와 role을 유지합니다.</li>
          <li><span>04</span>애플리케이션 포트는 공개하지 않고 필요한 경로만 프록시합니다.</li>
        </ol>
      </section>
    </>
  );
}

function FlowNode({ title, detail, accent = false }: { title: string; detail: string; accent?: boolean }) {
  return <div className={`flow-node${accent ? " accent" : ""}`}><strong>{title}</strong><small>{detail}</small></div>;
}
