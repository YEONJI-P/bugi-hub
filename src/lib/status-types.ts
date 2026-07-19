export type ServiceStatus = "UP" | "DOWN";

export interface StatusTarget {
  name: string;
  status: ServiceStatus;
}

export interface StatusResponse {
  checkedAt: string;
  services: StatusTarget[];
  infra: StatusTarget[];
}
