import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { WorkLogBoard } from "@/components/work-log-board";
import { WorkLogBoardView } from "@/components/work-log-board-view";
import { workLogs } from "@/data/work-log";

export const metadata: Metadata = {
  title: "Work Log",
  description: "설계 변화와 기술적 판단을 정리한 Personal Hub 작업 기록",
};

export default function WorkLogPage() {
  return (
    <>
      <PageHeader eyebrow="Work log" title="작업 기록" description="구조를 바꾼 설계 변화와 기술적 판단을 선별해 정리했습니다." />

      <Suspense fallback={<WorkLogBoardView activeRepository="all" entries={workLogs} />}>
        <WorkLogBoard entries={workLogs} />
      </Suspense>
    </>
  );
}
