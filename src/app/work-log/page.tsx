import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { WorkLogBoard } from "@/components/work-log-board";
import { WorkLogBoardView } from "@/components/work-log-board-view";
import { workLogs } from "@/data/work-log";

export const metadata: Metadata = {
  title: "Work Log",
  description: "최신순으로 모아 보는 Personal Hub 작업 기록",
};

export default function WorkLogPage() {
  return (
    <>
      <PageHeader eyebrow="Work log" title="작업 기록" description="공개할 수 있는 작업을 최신순으로 모았습니다." />

      <Suspense fallback={<WorkLogBoardView activeRepository="all" entries={workLogs} />}>
        <WorkLogBoard entries={workLogs} />
      </Suspense>
    </>
  );
}
