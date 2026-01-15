export type Channel = "EMAIL" | "WEBHOOK";

export interface Rule {
  id: string;
  tenant_id: string;
  event_type: string;
  channels: Channel[];
}
