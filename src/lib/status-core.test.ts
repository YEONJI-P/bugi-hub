import { describe, expect, it, vi } from "vitest";
import { checkHttpTarget, healthUrl, positiveInteger } from "./status-core";

describe("healthUrl", () => {
  it("joins a health path to a service base URL", () => {
    expect(healthUrl("http://sensor-monitor:8080", "/actuator/health"))
      .toBe("http://sensor-monitor:8080/actuator/health");
  });
});

describe("checkHttpTarget", () => {
  it("marks only a successful UP payload as UP", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "UP" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }));

    await expect(checkHttpTarget({ name: "Sensor", url: "http://service/health" }, 1000, fetcher))
      .resolves.toEqual({ name: "Sensor", status: "UP" });
  });

  it.each([
    new Response(JSON.stringify({ status: "DOWN" }), { status: 200 }),
    new Response(JSON.stringify({ status: "UP" }), { status: 503 }),
  ])("marks an invalid health response as DOWN", async (response) => {
    const fetcher = vi.fn().mockResolvedValue(response);
    await expect(checkHttpTarget({ name: "Sensor", url: "http://service/health" }, 1000, fetcher))
      .resolves.toEqual({ name: "Sensor", status: "DOWN" });
  });

  it("marks a network error as DOWN", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("unreachable"));
    await expect(checkHttpTarget({ name: "Sensor", url: "http://service/health" }, 1000, fetcher))
      .resolves.toEqual({ name: "Sensor", status: "DOWN" });
  });
});

describe("positiveInteger", () => {
  it("uses a fallback for missing or invalid input", () => {
    expect(positiveInteger(undefined, 3000)).toBe(3000);
    expect(positiveInteger("0", 3000)).toBe(3000);
    expect(positiveInteger("nope", 3000)).toBe(3000);
    expect(positiveInteger("1500", 3000)).toBe(1500);
  });
});
