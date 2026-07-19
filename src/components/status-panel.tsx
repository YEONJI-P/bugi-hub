"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { StatusResponse, StatusTarget } from "@/lib/status-types";

const REFRESH_INTERVAL_MS = 30_000;

function StatusGroup({ label, targets }: { label: string; targets: StatusTarget[] }) {
  return (
    <div className="status-group">
      <span className="status-group-label">{label}</span>
      <div className="status-list">
        {targets.length === 0 ? <p className="status-empty">등록된 대상 없음</p> : targets.map((target) => (
          <div className="status-tile" key={target.name}>
            <span>{target.name}</span>
            <strong data-state={target.status.toLowerCase()}><i />{target.status}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusPanel() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/status", { cache: "no-store" });
      if (!response.ok) throw new Error(`status ${response.status}`);
      setData(await response.json() as StatusResponse);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [refresh]);

  const targets = useMemo(() => [...(data?.services ?? []), ...(data?.infra ?? [])], [data]);
  const upCount = targets.filter((target) => target.status === "UP").length;
  const overall = failed ? { state: "down", label: "연결 실패" }
    : !data ? { state: "loading", label: "확인 중" }
    : targets.length === 0 ? { state: "loading", label: "대상 없음" }
    : upCount === targets.length ? { state: "up", label: "정상 가동" }
    : upCount === 0 ? { state: "down", label: "전체 중단" }
    : { state: "partial", label: `${upCount}/${targets.length} 가동` };

  return (
    <section className="status-panel" aria-labelledby="system-status-title">
      <div className="status-head">
        <span className="eyebrow" id="system-status-title">System status</span>
        <span className="overall" data-state={overall.state}>{overall.label}</span>
      </div>
      {failed ? <p className="status-error">상태 정보를 불러오지 못했습니다.</p> : (
        <>
          <StatusGroup label="서비스" targets={data?.services ?? []} />
          <StatusGroup label="인프라" targets={data?.infra ?? []} />
        </>
      )}
      {data && <time className="checked-at" dateTime={data.checkedAt}>업데이트 {new Date(data.checkedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</time>}
    </section>
  );
}
