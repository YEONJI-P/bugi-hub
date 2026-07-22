import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Bugi Hub Web",
  description: "Bugi Hub Web의 콘텐츠 구조, 상태 집계 경계와 컨테이너 배포 방식",
};

const designDecisions = [
  {
    label: "Content model",
    title: "공개 콘텐츠를 코드로 관리",
    before: "프로젝트 소개를 별도 관리 화면과 데이터베이스에서 편집",
    current: "선별한 프로젝트와 작업 기록을 타입이 있는 정적 데이터로 관리",
    reason: "변경 빈도가 낮은 포트폴리오 콘텐츠를 애플리케이션 배포 이력과 함께 검토하기 위해서입니다.",
  },
  {
    label: "Status boundary",
    title: "서버가 내부 상태를 최소 정보로 변환",
    before: "브라우저가 운영 주소와 의존성 세부 정보를 직접 알아야 하는 구조",
    current: "Route Handler가 내부 health와 PostgreSQL을 확인하고 이름과 UP·DOWN만 반환",
    reason: "브라우저에 내부 주소나 접속 정보를 노출하지 않으면서 운영 상태를 보여주기 위해서입니다.",
  },
  {
    label: "Database",
    title: "콘텐츠 저장과 플랫폼 감시를 분리",
    before: "PostgreSQL 연결이 애플리케이션 콘텐츠 저장소처럼 보일 수 있는 구성",
    current: "콘텐츠는 정적으로 유지하고 PostgreSQL에는 상태 확인용 SELECT 1만 실행",
    reason: "데이터 관리 기능을 추가하지 않고 홈서버 플랫폼 의존성의 연결 상태만 확인하기 위해서입니다.",
  },
  {
    label: "Runtime",
    title: "standalone·non-root 컨테이너",
    before: "전체 개발 의존성과 소스가 포함된 런타임 이미지",
    current: "Next.js standalone 출력만 담고 전용 nextjs 사용자로 실행",
    reason: "런타임 표면과 이미지 크기를 줄이고 애플리케이션 프로세스의 권한을 제한하기 위해서입니다.",
  },
  {
    label: "Release",
    title: "검증된 HEAD SHA를 이미지 좌표로 사용",
    before: "시점에 따라 내용이 달라지는 가변 이미지 태그",
    current: "lint·typecheck·test·build·container health를 통과한 40자리 commit SHA 이미지",
    reason: "실행 중인 코드와 Git 이력을 정확히 연결하고 같은 이미지를 다시 배포할 수 있게 하기 위해서입니다.",
  },
];

export default function BugiHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Web application"
        title="Bugi Hub Web"
        description="프로젝트 소개와 선별한 작업 기록을 정적으로 제공하고, 홈서버 내부 서비스와 PostgreSQL 상태를 안전하게 집계하는 Next.js 애플리케이션입니다."
        badge={<span className="running-badge"><i />운영 중</span>}
        actions={
          <div className="button-links">
            <a className="primary-button" href="https://bugihub.site" target="_blank" rel="noreferrer">라이브 사이트 ↗</a>
            <a href="https://github.com/YEONJI-P/bugi-hub" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        }
      />

      <section className="content-section" aria-labelledby="bugi-boundary-heading">
        <div className="section-label">
          <span className="eyebrow" id="bugi-boundary-heading">System boundary</span>
          <span className="mono-meta">앱 책임</span>
        </div>
        <div className="scope-grid">
          <article className="scope-card scope-card-primary">
            <span>IN SCOPE</span>
            <h2>공개 화면과 상태 API를 하나의 앱으로 제공합니다</h2>
            <ul>
              <li>프로젝트 소개와 선별한 Work Log</li>
              <li>내부 서비스 health 결과 집계</li>
              <li>PostgreSQL SELECT 1 연결 확인</li>
              <li>앱·DB health endpoint 제공</li>
              <li>검증된 standalone 이미지 발행</li>
            </ul>
          </article>
          <article className="scope-card">
            <span>OUT OF SCOPE</span>
            <h2>운영 인프라와 서비스 내부 구현은 분리합니다</h2>
            <ul>
              <li>콘텐츠 CMS와 관리자 인증</li>
              <li>Compose·nginx·TLS 설정</li>
              <li>내부 URL과 credential의 공개</li>
              <li>Sensor Monitor 비즈니스 로직</li>
              <li>운영 서버의 이미지 pin 변경</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="content-section" aria-labelledby="bugi-architecture-heading">
        <div className="section-label">
          <span className="eyebrow" id="bugi-architecture-heading">Architecture</span>
          <span className="mono-meta">요청 흐름</span>
        </div>
        <div className="architecture-map" aria-label="브라우저 요청이 Next.js App Router를 거쳐 정적 프로젝트 화면 또는 정제된 상태 API 응답으로 전달되는 구조">
          <article className="architecture-stage">
            <span>CLIENT</span>
            <h2>Browser</h2>
            <p>프로젝트와 Work Log를 탐색하고 같은 origin의 상태 API만 호출합니다.</p>
          </article>

          <span className="architecture-arrow" aria-hidden="true">→</span>

          <article className="architecture-stage architecture-core">
            <span>NEXT.JS APP ROUTER</span>
            <h2>화면과 서버 전용 상태 확인을 분리합니다</h2>
            <ol>
              <li><b>01</b><span>정적 페이지와 타입이 있는 Work Log 렌더링</span></li>
              <li><b>02</b><span>서버 환경변수에서 감시 대상 구성</span></li>
              <li><b>03</b><span>제한 시간 안에 HTTP health와 DB 연결 확인</span></li>
              <li><b>04</b><span>내부 정보를 제거한 상태 결과 반환</span></li>
            </ol>
          </article>

          <span className="architecture-arrow" aria-hidden="true">→</span>

          <div className="architecture-outputs">
            <article>
              <span>STATIC CONTENT</span>
              <h2>Projects · Work Log</h2>
              <p>코드 리뷰와 Git 이력을 거친 공개 콘텐츠를 제공합니다.</p>
            </article>
            <article>
              <span>SERVER RESPONSE</span>
              <h2>Status · Health</h2>
              <p>서비스 이름과 UP·DOWN만 전달하고 내부 접속 정보는 숨깁니다.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section" aria-labelledby="bugi-decisions-heading">
        <div className="section-label">
          <span className="eyebrow" id="bugi-decisions-heading">Design decisions</span>
          <Link className="section-link" href="/work-log?repo=bugi-hub">앱 작업 기록 →</Link>
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

      <section className="content-section" aria-labelledby="bugi-delivery-heading">
        <div className="section-label">
          <span className="eyebrow" id="bugi-delivery-heading">Delivery</span>
          <span className="mono-meta">불변 이미지</span>
        </div>
        <div className="integration-card">
          <div><h2>검증 결과와 실행 이미지를<br />같은 Git SHA로 연결합니다</h2></div>
          <ol>
            <li><span>01</span>고정된 lockfile로 의존성을 설치합니다.</li>
            <li><span>02</span>lint·typecheck·test·production build를 통과합니다.</li>
            <li><span>03</span>non-root 컨테이너와 health endpoint를 확인합니다.</li>
            <li><span>04</span>repo HEAD 40자리 SHA로 GHCR 이미지를 발행합니다.</li>
            <li><span>05</span>Home Server는 검증된 SHA만 배포 좌표로 사용합니다.</li>
          </ol>
        </div>
      </section>
    </>
  );
}
