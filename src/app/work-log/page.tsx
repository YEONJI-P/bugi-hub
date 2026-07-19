import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { workLogs, type WorkRepository } from "@/data/work-log";

export const metadata: Metadata = {
  title: "Work Log",
  description: "저장소별로 정리한 Personal Hub 작업 기록",
};

const repositories: {
  id: WorkRepository;
  name: string;
  description: string;
  href: string;
}[] = [
  {
    id: "personal-hub",
    name: "personal-hub",
    description: "홈서버 구성, 공개 라우팅, 상태 확인과 Bugi Hub 작업",
    href: "https://github.com/YEONJI-P/personal-hub",
  },
  {
    id: "sensor-monitor",
    name: "sensor-monitor",
    description: "Sensor Monitor의 배포 이미지와 Personal Hub 연결 작업",
    href: "https://github.com/YEONJI-P/sensor-monitor",
  },
];

export default function WorkLogPage() {
  return (
    <>
      <PageHeader eyebrow="Work log" title="작업 기록" description="공개할 수 있는 작업만 저장소별로 정리합니다." />

      <div className="repository-list">
        {repositories.map((repository) => {
          const entries = workLogs.filter((entry) => entry.repository === repository.id);
          return (
            <section className="repository-section" aria-labelledby={`repository-${repository.id}`} key={repository.id}>
              <header className="repository-heading">
                <div>
                  <span className="repository-label">Repository</span>
                  <h2 id={`repository-${repository.id}`}>{repository.name}</h2>
                  <p>{repository.description}</p>
                </div>
                <div className="repository-actions">
                  <span>{entries.length} records</span>
                  <a href={repository.href} target="_blank" rel="noreferrer">GitHub ↗</a>
                </div>
              </header>

              <div className="log-card-grid">
                {entries.map((entry) => (
                  <article className="log-card" id={entry.slug} key={entry.slug}>
                    <div className="log-card-meta">
                      <span>{entry.category}</span>
                      <time dateTime={entry.date}>{entry.date.replaceAll("-", ".")}</time>
                    </div>
                    <h3>{entry.title}</h3>
                    <p>{entry.summary}</p>
                    <ul>{entry.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
                    <div className="tag-list">{entry.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
