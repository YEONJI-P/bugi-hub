import type { WorkLogEntry } from "@/data/work-log";
import {
  getFilteredWorkLogs,
  getWorkLogCounts,
  type WorkRepositoryFilter,
} from "@/lib/work-log";

const filterLabels: Record<WorkRepositoryFilter, string> = {
  all: "전체",
  "personal-hub": "personal-hub",
  "sensor-monitor": "sensor-monitor",
};

interface WorkLogBoardViewProps {
  activeRepository: WorkRepositoryFilter;
  entries: WorkLogEntry[];
  onFilterChange?: (repository: WorkRepositoryFilter) => void;
}

export function WorkLogBoardView({
  activeRepository,
  entries,
  onFilterChange,
}: WorkLogBoardViewProps) {
  const counts = getWorkLogCounts(entries);
  const filteredEntries = getFilteredWorkLogs(entries, activeRepository);

  return (
    <section className="work-log-board" aria-labelledby="work-log-board-heading">
      <div className="work-log-toolbar">
        <div>
          <span className="eyebrow" id="work-log-board-heading">Repository</span>
          <p aria-live="polite">{filteredEntries.length}개의 기록</p>
        </div>

        <nav className="work-log-filters" aria-label="저장소별 작업 기록 필터">
          {Object.entries(filterLabels).map(([repository, label]) => {
            const filter = repository as WorkRepositoryFilter;
            const isActive = filter === activeRepository;
            const content = (
              <>
                <span>{label}</span>
                <strong>{counts[filter]}</strong>
              </>
            );

            return onFilterChange ? (
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onFilterChange(filter)}
                key={filter}
              >
                {content}
              </button>
            ) : (
              <a
                href={filter === "all" ? "/work-log" : `/work-log?repo=${filter}`}
                aria-current={isActive ? "page" : undefined}
                key={filter}
              >
                {content}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="work-log-list">
        {filteredEntries.map((entry) => (
          <details className="work-log-row" id={entry.slug} key={entry.slug}>
            <summary>
              <time dateTime={entry.date}>{entry.date.replaceAll("-", ".")}</time>
              <span className="repository-prefix" data-repository={entry.repository}>
                {entry.repository}
              </span>
              <span className="work-log-row-main">
                <span className="work-log-title">{entry.title}</span>
                <span className="work-log-tags" aria-label="기술 태그">
                  {entry.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </span>
              </span>
              <span className="details-indicator" aria-hidden="true" />
            </summary>

            <div className="work-log-detail">
              <div className="work-log-detail-meta">
                <span>Category</span>
                <strong>{entry.category}</strong>
              </div>
              <div>
                <p>{entry.summary}</p>
                <ul>{entry.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
