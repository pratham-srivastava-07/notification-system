import { z } from "zod";

export const EventInputSchema = z.object({
  event_type: z.string().min(1),
  payload: z.record(z.string(), z.any())
});

export const EventSchema = EventInputSchema.extend({
  event_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  occurred_at: z.string().datetime()
});

export type EventInput = z.infer<typeof EventInputSchema>;
export type EnrichedEvent = z.infer<typeof EventSchema>;