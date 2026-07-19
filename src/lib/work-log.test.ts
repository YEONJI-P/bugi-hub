import { describe, expect, it } from "vitest";
import { recentWorkLogs, workLogs } from "../data/work-log";
import {
  getFilteredWorkLogs,
  getWorkLogCounts,
  getWorkLogSearch,
  getWorkRepositoryFilter,
} from "./work-log";

describe("work log board", () => {
  it("shows all entries in descending date order", () => {
    const entries = getFilteredWorkLogs(workLogs, "all");

    expect(entries).toHaveLength(11);
    expect(entries.map((entry) => entry.date)).toEqual(
      [...entries.map((entry) => entry.date)].sort((left, right) => right.localeCompare(left)),
    );
  });

  it("filters entries and reports repository counts", () => {
    expect(getWorkLogCounts(workLogs)).toEqual({
      all: 11,
      "personal-hub": 4,
      "sensor-monitor": 7,
    });
    expect(getFilteredWorkLogs(workLogs, "personal-hub")).toHaveLength(4);
    expect(getFilteredWorkLogs(workLogs, "sensor-monitor")).toHaveLength(7);
  });

  it("keeps only structured, architecture-scale stories", () => {
    expect(workLogs.map((entry) => entry.slug)).not.toEqual(
      expect.arrayContaining(["work-log-board", "sensor-image-update-flow", "sensor-channel-operations-ui"]),
    );
    expect(workLogs.every((entry) => Object.values(entry.story).every(Boolean))).toBe(true);
    expect(new Set(workLogs.map((entry) => entry.story.type))).toEqual(
      new Set(["solution", "implementation", "decision"]),
    );
  });

  it("describes the sensor-monitor architecture evolution", () => {
    expect(getFilteredWorkLogs(workLogs, "sensor-monitor").map((entry) => entry.slug)).toEqual([
      "physical-device-channel-model",
      "sensor-ingest-boundary",
      "synchronous-ingest-pipeline",
      "factory-zone-access-model",
      "realtime-explain-boundary",
      "manufacturing-monitoring-scope",
      "external-simulator-boundary",
    ]);
  });

  it("keeps unique entry slugs and the curated home previews", () => {
    expect(new Set(workLogs.map((entry) => entry.slug)).size).toBe(workLogs.length);
    expect(recentWorkLogs.map((entry) => entry.slug)).toEqual([
      "nextjs-hub-migration",
      "public-routing",
      "physical-device-channel-model",
    ]);
  });

  it("falls back to all for missing or invalid repository values", () => {
    expect(getWorkRepositoryFilter(null)).toBe("all");
    expect(getWorkRepositoryFilter("unknown")).toBe("all");
    expect(getWorkRepositoryFilter("sensor-monitor")).toBe("sensor-monitor");
  });

  it("updates the repository query while preserving other parameters", () => {
    expect(getWorkLogSearch("view=compact", "sensor-monitor")).toBe("?view=compact&repo=sensor-monitor");
    expect(getWorkLogSearch("repo=sensor-monitor", "all")).toBe("");
  });
});
