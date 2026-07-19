import { describe, expect, it } from "vitest";
import { workLogs } from "../data/work-log";
import {
  getFilteredWorkLogs,
  getWorkLogCounts,
  getWorkLogSearch,
  getWorkRepositoryFilter,
} from "./work-log";

describe("work log board", () => {
  it("shows all six entries in descending date order", () => {
    const entries = getFilteredWorkLogs(workLogs, "all");

    expect(entries).toHaveLength(6);
    expect(entries.map((entry) => entry.date)).toEqual(
      [...entries.map((entry) => entry.date)].sort((left, right) => right.localeCompare(left)),
    );
  });

  it("filters entries and reports repository counts", () => {
    expect(getWorkLogCounts(workLogs)).toEqual({
      all: 6,
      "personal-hub": 5,
      "sensor-monitor": 1,
    });
    expect(getFilteredWorkLogs(workLogs, "personal-hub")).toHaveLength(5);
    expect(getFilteredWorkLogs(workLogs, "sensor-monitor").map((entry) => entry.slug)).toEqual([
      "sensor-image-update-flow",
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
