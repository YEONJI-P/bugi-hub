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

  it("keeps only structured, portfolio-scale stories", () => {
    expect(workLogs.map((entry) => entry.slug)).not.toContain("work-log-board");
    expect(workLogs.every((entry) => Object.values(entry.story).every(Boolean))).toBe(true);
    expect(new Set(workLogs.map((entry) => entry.story.type))).toEqual(
      new Set(["solution", "implementation", "decision"]),
    );
  });

  it("keeps unique entry slugs and the existing home previews", () => {
    expect(new Set(workLogs.map((entry) => entry.slug)).size).toBe(workLogs.length);
    expect(recentWorkLogs.map((entry) => entry.slug)).toEqual([
      "nextjs-hub-migration",
      "sensor-image-update-flow",
      "public-routing",
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
