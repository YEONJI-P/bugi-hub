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

const storyTypeLabels: Record<WorkLogEntry["story"]["type"], string> = {
  solution: "해결",
  implementation: "구현",
  decision: "결정",
};

function getStorySections(story: WorkLogEntry["story"]) {
  switch (story.type) {
    case "solution":
      return [
        ["문제", story.problem],
        ["원인", story.cause],
        ["선택 및 이유", story.decision],
        ["결과", story.outcome],
      ];
    case "implementation":
      return [
        ["목표", story.goal],
        ["구현", story.implementation],
        ["선택 및 이유", story.decision],
        ["결과", story.outcome],
      ];
    case "decision":
      return [
        ["배경", story.background],
        ["검토", story.options],
        ["선택 및 이유", story.decision],
        ["결과", story.outcome],
      ];
  }
}

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
                <div>
                  <span>Type</span>
                  <strong>{storyTypeLabels[entry.story.type]}</strong>
                </div>
                <div>
                  <span>Category</span>
                  <strong>{entry.category}</strong>
                </div>
              </div>
              <div className="work-log-story">
                {getStorySections(entry.story).map(([label, content]) => (
                  <section key={label}>
                    <h3>{label}</h3>
                    <p>{content}</p>
                  </section>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
