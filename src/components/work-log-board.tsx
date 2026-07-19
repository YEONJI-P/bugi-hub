"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { WorkLogBoardView } from "@/components/work-log-board-view";
import type { WorkLogEntry } from "@/data/work-log";
import {
  getWorkLogSearch,
  getWorkRepositoryFilter,
  isWorkRepository,
  type WorkRepositoryFilter,
} from "@/lib/work-log";

export function WorkLogBoard({ entries }: { entries: WorkLogEntry[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const repositoryValue = searchParams.get("repo");
  const activeRepository = getWorkRepositoryFilter(repositoryValue);

  useEffect(() => {
    if (repositoryValue !== null && !isWorkRepository(repositoryValue)) {
      const nextSearch = getWorkLogSearch(search, "all");
      window.history.replaceState(null, "", `${pathname}${nextSearch}${window.location.hash}`);
    }
  }, [pathname, repositoryValue, search]);

  function changeFilter(repository: WorkRepositoryFilter) {
    const nextSearch = getWorkLogSearch(search, repository);
    window.history.pushState(null, "", `${pathname}${nextSearch}${window.location.hash}`);
  }

  return (
    <WorkLogBoardView
      activeRepository={activeRepository}
      entries={entries}
      onFilterChange={changeFilter}
    />
  );
}
