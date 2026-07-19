import type { Metadata } from "next";
import { workLogs, type WorkCategory } from "@/data/work-log";

export const metadata: Metadata = {
  title: "Work Log",
  description: "Personal Hub를 만들고 운영하며 남긴 선별 작업 기록",
};

const sections: { category: WorkCategory; description: string }[] = [
  { category: "Home Server", description: "배포 기반, 네트워크, 상태 감시처럼 서비스를 계속 동작하게 만드는 작업" },
  { category: "Service Integration", description: "독립 프로젝트를 홈서버에 연결하며 정리한 라우팅·health·데이터 경계" },
];

export default function WorkLogPage() {
  return (
    <>
      <header className="page-intro work-log-intro">
        <span className="eyebrow">Selected operations notes</span>
        <h1>Work Log</h1>
        <p>홈서버를 만들고 서비스를 연결하며 결정한 내용을 공개 가능한 범위로 정리합니다. 개인 메모 전체를 자동으로 옮기지 않고, 맥락이 남는 기록만 직접 선별합니다.</p>
      </header>

      {sections.map((section) => {
        const entries = workLogs.filter((entry) => entry.category === section.category);
        return (
          <section className="log-section" aria-labelledby={`heading-${section.category}`} key={section.category}>
            <div className="log-section-heading">
              <div><span className="eyebrow">{section.category}</span><h2 id={`heading-${section.category}`}>{section.description}</h2></div>
              <span className="mono-meta">0{entries.length}</span>
            </div>
            <div className="log-list">
              {entries.map((entry) => (
                <article className="log-entry" id={entry.slug} key={entry.slug}>
                  <div className="log-date"><time dateTime={entry.date}>{entry.date.replaceAll("-", ".")}</time><span>{entry.category}</span></div>
                  <div className="log-body">
                    <h3>{entry.title}</h3>
                    <p>{entry.summary}</p>
                    <ul>{entry.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
                    <div className="tag-list">{entry.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
