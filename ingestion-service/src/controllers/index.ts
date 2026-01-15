import { Request, Response } from "express";
import { EventInputSchema, EventInput, EnrichedEvent } from "@notify/shared";
import { randomUUID } from "crypto";
import { producer } from "../kafka/producer";

export default async function mainController(
  req: Request,
  res: Response
) {
  try {
    if (!req.context?.tenant_id) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    const parsedBody: EventInput = EventInputSchema.parse(req.body);

    const enrichedEvent: EnrichedEvent = {
      event_id: randomUUID(),
      tenant_id: req.context.tenant_id,
      event_type: parsedBody.event_type,
      payload: parsedBody.payload,
      occurred_at: new Date().toISOString()
    };

    await producer.send({
      topic: "events.ingested",
      messages: [
        {
          key: String(enrichedEvent.tenant_id),
          value: JSON.stringify(enrichedEvent)
        }
      ]
    });

    return res.status(202).json({
      status: "accepted",
      event_id: enrichedEvent.event_id
    });

  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Invalid event payload",
        details: error.errors
      });
    }

    return res.status(500).json({
      error: "Internal server error"
    });
  }
}
