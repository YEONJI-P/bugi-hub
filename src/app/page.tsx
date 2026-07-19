import Link from "next/link";
import { recentWorkLogs } from "@/data/work-log";

const projects = [
  {
    name: "Sensor Monitor",
    summary: "센서 데이터를 수집하고 시각화하며, 측정 결과를 설명하는 제조 데이터 모니터링 서비스",
    stack: ["Spring Boot", "FastAPI", "PostgreSQL"],
    detailHref: "/sensor-monitor",
    repository: "https://github.com/YEONJI-P/sensor-monitor",
    live: "https://sensor.bugihub.site",
  },
  {
    name: "Personal Hub",
    summary: "독립 서비스를 배포하고 라우팅하며 상태를 통합 관리하는 홈서버 플랫폼",
    stack: ["Docker Compose", "nginx", "Cloudflare Tunnel"],
    detailHref: "/work-log",
    repository: "https://github.com/YEONJI-P/personal-hub",
  },
];

export default function Home() {
  return (
    <>
      <header className="page-intro">
        <span className="eyebrow">Home server workspace</span>
        <h1>작은 서비스를 만들고,<br />직접 운영합니다.</h1>
        <p>프로젝트의 결과물과 그 결과물이 계속 동작하도록 만든 운영 기록을 한곳에 모읍니다.</p>
      </header>

      <section className="content-section" aria-labelledby="projects-heading">
        <div className="section-label">
          <span className="eyebrow" id="projects-heading">Projects</span>
          <span className="mono-meta">02</span>
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
                <a href={project.repository} target="_blank" rel="noreferrer">저장소 <span aria-hidden="true">↗</span></a>
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
        <div className="work-preview-list">
          {recentWorkLogs.map((entry) => (
            <article className="work-preview" key={entry.slug}>
              <time dateTime={entry.date}>{entry.date.replaceAll("-", ".")}</time>
              <div>
                <span className="work-category">{entry.category}</span>
                <h2>{entry.title}</h2>
                <p>{entry.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
