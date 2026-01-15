import { db } from "@/lib/db";

export async function getEventTypes() {
    const events = await db.event.findMany({
        select: {
            eventType: true,
        },
        distinct: ["eventType"],
    });
    return events.map((e) => e.eventType);
}
