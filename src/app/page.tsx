import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { recentWorkLogs, workRepositoryLabels } from "@/data/work-log";

const projects = [
  {
    name: "Sensor Monitor",
    summary: "제조 센서 데이터 수집 · 채널별 임계값 기반 이상 감지 · 알림 및 원인 설명",
    stack: ["Spring Boot", "FastAPI", "PostgreSQL"],
    detailHref: "/sensor-monitor",
    repository: "https://github.com/YEONJI-P/sensor-monitor",
    live: "https://sensor.bugihub.site",
  },
  {
    name: "Infrastructure",
    summary: "GCP 단일 VM · 서비스별 Docker 컨테이너 · nginx 라우팅 · PostgreSQL Persistent Disk",
    stack: ["GCP Compute Engine", "Docker Compose", "nginx"],
    detailHref: "/home-server",
  },
];

export default function Home() {
  return (
    <>
      <PageHeader eyebrow="Bugi Hub" title="개인 프로젝트" description="제조 센서 모니터링 · GCP 인프라 운영 · 설계 및 작업 기록" />

      <section className="content-section" aria-labelledby="overview-heading">
        <div className="section-label">
          <span className="eyebrow" id="overview-heading">Overview</span>
          <span className="mono-meta">GCP Compute Engine</span>
        </div>
        <div className="portfolio-map">
          <div className="portfolio-map-services">
            <article>
              <span>PORTFOLIO SITE</span>
              <h2>Bugi Hub</h2>
              <p>프로젝트 소개 · 작업 기록 · 서비스 상태</p>
            </article>
            <article>
              <span>SERVICE</span>
              <h2>Sensor Monitor</h2>
              <p>센서 수집 · 임계값 기반 이상 감지 · 원인 설명</p>
            </article>
          </div>
          <div className="portfolio-map-runtime">
            <strong>Infrastructure</strong>
            <span>GCP Compute Engine · Docker Compose · nginx · PostgreSQL</span>
          </div>
        </div>
      </section>

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
                {project.repository && <a href={project.repository} target="_blank" rel="noreferrer">저장소 <span aria-hidden="true">↗</span></a>}
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
            <Link className="work-preview" href={`/work-log#${entry.slug}`} key={entry.slug}>
              <div className="work-preview-meta">
                <span className="work-category">{workRepositoryLabels[entry.repository]}</span>
                <time dateTime={entry.date}>{entry.date.replaceAll("-", ".")}</time>
              </div>
              <h2>{entry.title}</h2>
              <p>{entry.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
