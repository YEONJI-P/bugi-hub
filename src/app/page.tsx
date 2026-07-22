import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { recentWorkLogs } from "@/data/work-log";

const projects = [
  {
    name: "Sensor Monitor",
    summary: "제조 센서 값을 받아 저장하고, 임계값을 넘으면 알림과 함께 원인 설명까지 보여주는 모니터링 서비스",
    stack: ["Spring Boot", "FastAPI", "PostgreSQL"],
    detailHref: "/sensor-monitor",
    repository: "https://github.com/YEONJI-P/sensor-monitor",
    live: "https://sensor.bugihub.site",
  },
  {
    name: "Bugi Hub Web",
    summary: "프로젝트 소개와 작업 기록을 정적으로 제공하고, 내부 서비스와 PostgreSQL 상태를 최소 정보로 집계하는 웹 앱",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    detailHref: "/bugi-hub",
    repository: "https://github.com/YEONJI-P/bugi-hub",
    live: "https://bugihub.site",
  },
  {
    name: "Home Server",
    summary: "여러 서비스를 독립 컨테이너로 실행하고 도메인 라우팅·이미지 버전·데이터 경계를 관리하는 홈서버 플랫폼",
    stack: ["Docker Compose", "nginx", "Cloudflare Tunnel"],
    detailHref: "/home-server",
    repository: "https://github.com/YEONJI-P/home-server-infra",
    repositoryLabel: "저장소 (공개 예정)",
  },
];

export default function Home() {
  return (
    <>
      <PageHeader eyebrow="Bugi Hub" title="홈서버 프로젝트" description="직접 만들고 운영하는 서비스와 작업 기록을 정리합니다." />

      <section className="content-section" aria-labelledby="projects-heading">
        <div className="section-label">
          <span className="eyebrow" id="projects-heading">Projects</span>
          <span className="mono-meta">03</span>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
              <div className="project-card-head">
                <h2>{project.name}</h2>
                <span className="running-badge"><i />운영 중</span>
              </div>
              <p>{project.summary}</p>
              <div className="tag-list" aria-label={`${project.name} 기술 스택`}>
                {project.stack.map((item) => <span key={item}>{item}</span>)}
              </div>
              <div className="text-links">
                <Link className="accent-link" href={project.detailHref}>상세 보기 <span aria-hidden="true">→</span></Link>
                <a href={project.repository} target="_blank" rel="noreferrer">{project.repositoryLabel ?? "저장소"} <span aria-hidden="true">↗</span></a>
                {project.live && <a href={project.live} target="_blank" rel="noreferrer">라이브 <span aria-hidden="true">↗</span></a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="recent-work-heading">
        <div className="section-label">
          <span className="eyebrow" id="recent-work-heading">Recent work</span>
          <Link className="section-link" href="/work-log">전체 기록 →</Link>
        </div>
        <div className="work-preview-grid">
          {recentWorkLogs.map((entry) => (
            <article className="work-preview" key={entry.slug}>
              <div className="work-preview-meta">
                <span className="work-category">{entry.repository}</span>
                <time dateTime={entry.date}>{entry.date.replaceAll("-", ".")}</time>
              </div>
              <h2>{entry.title}</h2>
              <p>{entry.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
