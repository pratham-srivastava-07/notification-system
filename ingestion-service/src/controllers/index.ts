import { Request, Response } from "express";
import { EventInputSchema, EventInput, EnrichedEvent } from "@notify/shared";
import { randomUUID } from "crypto";

export default async function mainController(
  req: Request,
  res: Response
) {
  try {
    const parsedBody: EventInput = EventInputSchema.parse(req.body);

    
    const enrichedEvent: EnrichedEvent = {
      event_id: randomUUID(),
      tenant_id: "00000000-0000",
      event_type: parsedBody.event_type,
      payload: parsedBody.payload,
      occurred_at: new Date().toISOString()
    };

    //kafka-impl here

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
