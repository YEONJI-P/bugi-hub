import type { WorkLogEntry, WorkRepository } from "@/data/work-log";

export const workRepositoryFilters = ["all", "bugi-hub", "home-server", "sensor-monitor"] as const;

export type WorkRepositoryFilter = (typeof workRepositoryFilters)[number];

export function getWorkRepositoryFilter(value: string | null): WorkRepositoryFilter {
  return workRepositoryFilters.includes(value as WorkRepositoryFilter)
    ? (value as WorkRepositoryFilter)
    : "all";
}

export function getFilteredWorkLogs(
  entries: WorkLogEntry[],
  repository: WorkRepositoryFilter,
): WorkLogEntry[] {
  return entries
    .filter((entry) => repository === "all" || entry.repository === repository)
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getWorkLogCounts(entries: WorkLogEntry[]): Record<WorkRepositoryFilter, number> {
  return {
    all: entries.length,
    "bugi-hub": entries.filter((entry) => entry.repository === "bugi-hub").length,
    "home-server": entries.filter((entry) => entry.repository === "home-server").length,
    "sensor-monitor": entries.filter((entry) => entry.repository === "sensor-monitor").length,
  };
}

export function getWorkLogSearch(
  currentSearch: string,
  repository: WorkRepositoryFilter,
): string {
  const searchParams = new URLSearchParams(currentSearch);

  if (repository === "all") {
    searchParams.delete("repo");
  } else {
    searchParams.set("repo", repository);
  }

  const nextSearch = searchParams.toString();
  return nextSearch ? `?${nextSearch}` : "";
}

export function isWorkRepository(value: string | null): value is WorkRepository {
  return value === "bugi-hub" || value === "home-server" || value === "sensor-monitor";
}
