import "server-only";

import { Client, type ClientConfig } from "pg";
import { checkHttpTarget, healthUrl, positiveInteger, type HttpTarget } from "./status-core";
import type { StatusResponse, StatusTarget } from "./status-types";

const requestTimeoutMs = positiveInteger(process.env.STATUS_REQUEST_TIMEOUT_MS, 3_000);
const refreshIntervalMs = positiveInteger(process.env.STATUS_REFRESH_INTERVAL_MS, 30_000);

let cached: { expiresAt: number; value: StatusResponse } | undefined;
let pending: Promise<StatusResponse> | undefined;

function configuredHttpTargets(): HttpTarget[] {
  const targets: HttpTarget[] = [];
  const sensorBackend = process.env.STATUS_SENSOR_MONITOR_BACKEND_URL?.trim();
  const sensorExplain = process.env.STATUS_SENSOR_MONITOR_EXPLAIN_URL?.trim();

  if (sensorBackend) targets.push({ name: "Sensor Backend", url: healthUrl(sensorBackend, "/actuator/health") });
  if (sensorExplain) targets.push({ name: "Sensor Explain", url: healthUrl(sensorExplain, "/health") });
  return targets;
}

function databaseConfig(): ClientConfig | null {
  const host = process.env.POSTGRES_HOST?.trim();
  const database = process.env.POSTGRES_DB?.trim();
  const user = process.env.POSTGRES_USER?.trim();
  const password = process.env.POSTGRES_PASSWORD;
  if (!host || !database || !user || !password) return null;

  return {
    host,
    database,
    user,
    password,
    port: positiveInteger(process.env.POSTGRES_PORT, 5432),
    connectionTimeoutMillis: requestTimeoutMs,
    query_timeout: requestTimeoutMs,
  };
}

export async function checkPostgres(): Promise<StatusTarget | null> {
  const config = databaseConfig();
  if (!config) return null;

  const client = new Client(config);
  try {
    await client.connect();
    await client.query("SELECT 1");
    return { name: "PostgreSQL", status: "UP" };
  } catch {
    return { name: "PostgreSQL", status: "DOWN" };
  } finally {
    await client.end().catch(() => undefined);
  }
}

async function collectStatus(): Promise<StatusResponse> {
  const [services, postgres] = await Promise.all([
    Promise.all(configuredHttpTargets().map((target) => checkHttpTarget(target, requestTimeoutMs))),
    checkPostgres(),
  ]);

  return {
    checkedAt: new Date().toISOString(),
    services,
    infra: postgres ? [postgres] : [],
  };
}

export async function getStatus(): Promise<StatusResponse> {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.value;
  if (pending) return pending;

  pending = collectStatus().then((value) => {
    cached = { value, expiresAt: Date.now() + refreshIntervalMs };
    return value;
  }).finally(() => {
    pending = undefined;
  });

  return pending;
}
