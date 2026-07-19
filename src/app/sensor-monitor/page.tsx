import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Sensor Monitor",
  description: "Sensor Monitor의 시스템 경계와 데이터 처리 구조, 주요 설계 결정",
};

const designDecisions = [
  {
    label: "Ingest model",
    title: "동시 관측의 맥락을 보존",
    before: "채널 하나를 Device 하나로 보고 scalar 값을 개별 요청으로 저장",
    current: "물리 Device 아래 Channel을 두고 한 시점의 readings를 MeasurementBatch로 저장",
    reason: "같은 설비에서 동시에 관측된 여러 채널 값을 사후에도 하나의 사건으로 다루기 위해서입니다.",
  },
  {
    label: "Processing",
    title: "현재 규모에 맞춘 동기 처리",
    before: "Kafka를 경유해 저장과 후속 처리를 분산",
    current: "저장·상태 갱신·임계 판정·알림 생성을 PostgreSQL 단일 트랜잭션으로 처리",
    reason: "소비자가 하나인 현재 단계에서는 분산 처리보다 실패 경계와 데이터 원자성이 더 중요하기 때문입니다.",
  },
  {
    label: "Access model",
    title: "제조 현장에 맞춘 권한 범위",
    before: "범용 Organization·Group 계층과 여섯 단계 역할",
    current: "Factory·Zone 계층과 SYSTEM_ADMIN·FACTORY_ADMIN·MEMBER·VIEWER",
    reason: "사용자의 권한을 실제 설비 위치와 연결하고 REST·SSE에 같은 접근 범위를 적용하기 위해서입니다.",
  },
  {
    label: "Runtime state",
    title: "설정과 텔레메트리 수명주기 분리",
    before: "Device 설정과 heartbeat·alarm 상태가 함께 변경되고 Refresh Token은 Redis에 저장",
    current: "설정은 Device, 수신 상태는 DeviceStatus, 알람 상태는 ChannelStatus, 인증 상태는 PostgreSQL이 소유",
    reason: "설정 감사 시각과 빈번한 런타임 갱신을 분리하고 별도 저장소 운영을 줄이기 위해서입니다.",
  },
  {
    label: "Detection & explain",
    title: "판정과 생성형 설명의 책임 분리",
    before: "이상 판정과 설명 생성이 하나의 처리 흐름에 결합될 수 있는 구조",
    current: "Spring 규칙이 이상을 판정하고 FastAPI Explain은 근거와 권고만 생성",
    reason: "외부 LLM의 지연·실패·모델 교체가 센서 저장과 이상 판정의 정합성에 영향을 주지 않게 하기 위해서입니다.",
  },
];

export default function SensorMonitorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Featured project"
        title="Sensor Monitor"
        description="게이트웨이 이후의 제조 센서 데이터를 물리 장치와 채널 단위로 수집하고, 규칙 기반 이상 탐지부터 실시간 전달과 설명 생성까지 연결하는 모니터링 서비스입니다."
        badge={<span className="running-badge"><i />운영 중</span>}
        actions={
          <div className="button-links">
            <a className="primary-button" href="https://sensor.bugihub.site" target="_blank" rel="noreferrer">라이브 서비스 ↗</a>
            <a href="https://github.com/YEONJI-P/sensor-monitor" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        }
      />

      <section className="content-section" aria-labelledby="boundary-heading">
        <div className="section-label">
          <span className="eyebrow" id="boundary-heading">System boundary</span>
          <span className="mono-meta">게이트웨이 이후</span>
        </div>
        <div className="scope-grid">
          <article className="scope-card scope-card-primary">
            <span>IN SCOPE</span>
            <h2>센서 데이터의 수집 이후를 책임합니다</h2>
            <ul>
              <li>물리 장치 단위 HTTP/JSON batch 수신</li>
              <li>채널별 판독 저장과 임계 방향 판정</li>
              <li>장치 수신 지연과 알림 상태 관리</li>
              <li>Factory·Zone 기준 접근 제어</li>
              <li>SSE 실시간 전달과 이상 설명 연결</li>
            </ul>
          </article>
          <article className="scope-card">
            <span>OUT OF SCOPE</span>
            <h2>현장 수집과 검증 전 확장은 경계 밖에 둡니다</h2>
            <ul>
              <li>Modbus·OPC-UA 같은 장치 프로토콜 변환</li>
              <li>LLM을 이용한 이상 여부 자체의 판정</li>
              <li>운영 근거가 확인되기 전의 Kafka·MQTT·TimescaleDB 도입</li>
              <li>운영 필요가 확인되지 않은 MSA 확장</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="content-section" aria-labelledby="architecture-heading">
        <div className="section-label">
          <span className="eyebrow" id="architecture-heading">Architecture</span>
          <span className="mono-meta">트랜잭션 경계 기준</span>
        </div>
        <div className="architecture-map" aria-label="게이트웨이와 외부 시뮬레이터에서 Spring Backend의 PostgreSQL 트랜잭션을 거쳐 커밋 후 대시보드와 Explain 서비스로 이어지는 구조">
          <article className="architecture-stage">
            <span>PRODUCER</span>
            <h2>Gateway · Simulator</h2>
            <p>물리 장치 코드와 같은 관측 시점의 채널 값 묶음을 HTTP/JSON으로 전송합니다.</p>
          </article>

          <span className="architecture-arrow" aria-hidden="true">→</span>

          <article className="architecture-stage architecture-core">
            <span>SPRING BACKEND</span>
            <h2>한 요청, 하나의 명확한 처리 경계</h2>
            <ol>
              <li><b>01</b><span>장치·채널 검증과 부분 실패 분리</span></li>
              <li><b>02</b><span>Batch·Reading 저장과 DeviceStatus 갱신</span></li>
              <li><b>03</b><span>채널별 임계 판정과 Alert 생성</span></li>
              <li><b>04</b><span>PostgreSQL transaction commit</span></li>
            </ol>
          </article>

          <span className="architecture-arrow" aria-hidden="true">→</span>

          <div className="architecture-outputs">
            <article>
              <span>AFTER COMMIT</span>
              <h2>Dashboard · SSE</h2>
              <p>확정된 batch와 알림만 접근 범위에 맞춰 실시간으로 전달합니다.</p>
            </article>
            <article>
              <span>OUTSIDE TRANSACTION</span>
              <h2>FastAPI · Explain</h2>
              <p>규칙이 탐지한 결과에 근거와 권고를 보강하며 저장 흐름을 막지 않습니다.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section" aria-labelledby="decisions-heading">
        <div className="section-label">
          <span className="eyebrow" id="decisions-heading">Design decisions</span>
          <Link className="section-link" href="/work-log?repo=sensor-monitor">설계 변화 기록 →</Link>
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

      <section className="content-section" aria-labelledby="integration-heading">
        <div className="section-label">
          <span className="eyebrow" id="integration-heading">Personal Hub integration</span>
          <span className="mono-meta">운영 접점</span>
        </div>
        <div className="integration-card">
          <div><h2>서비스 코드는 독립적으로,<br />운영 접점은 하나의 계약으로</h2></div>
          <ol>
            <li><span>01</span>Sensor 저장소는 코드·테스트·불변 SHA 이미지를 소유합니다.</li>
            <li><span>02</span>Personal Hub는 Tunnel·nginx 라우팅과 배포 버전을 관리합니다.</li>
            <li><span>03</span>Backend와 Explain은 내부 URL로 각각 상태를 감시합니다.</li>
            <li><span>04</span>공유 PostgreSQL에서도 전용 database와 role을 유지합니다.</li>
            <li><span>05</span>센서 적재 경로는 공개 프록시에서 차단하고 내부 producer만 호출합니다.</li>
          </ol>
        </div>
      </section>
    </>
  );
}
