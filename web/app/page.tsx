import { db } from "@/lib/db";
import { getEventTypes } from "@/lib/data";
import { EventItem } from "@/components/notifications/event-item";
import { FilterBar } from "@/components/notifications/filter-bar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

type Status = "all" | "pending" | "processed" | "failed" | "processing";

export default async function DashboardPage(props: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const filterType = searchParams.type || "all";
  const filterStatus = (searchParams.status || "all") as Status;

  // Parallel data fetching
  const [eventTypes, events] = await Promise.all([
    getEventTypes(),
    db.event.findMany({
      where: filterType !== "all" ? { eventType: filterType } : {},
      orderBy: {
        receivedAt: "desc",
      },
      take: 100,
      include: {
        deliveries: true,
      },
    }),
  ]);

  // Client-side filtering for status (derived field)
  const filteredEvents = events.filter((event) => {
    if (filterStatus === "all") return true;

    const hasSuccess = event.deliveries.some((d) => d.status === "SUCCESS");
    const hasdeliveries = event.deliveries.length > 0;
    const allFailed =
      hasdeliveries &&
      event.deliveries.every((d) => d.status === "FAILED");

    if (filterStatus === "processed") return hasSuccess;
    if (filterStatus === "pending") return !hasdeliveries;
    if (filterStatus === "failed") return allFailed;
    if (filterStatus === "processing")
      return hasdeliveries && !hasSuccess && !allFailed;

    return true;
  });

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Notification System
          </h1>
          <p className="text-muted-foreground">
            Live feed of ingested events and processing status.
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <FilterBar eventTypes={eventTypes} />
          </CardContent>
        </Card>

        {/* Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Event Feed</h2>
            <div className="text-sm text-muted-foreground">
              Showing {filteredEvents.length} of {events.length} fetched
            </div>
          </div>

          <ScrollArea className="h-[600px] pr-4 rounded-md">
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3 text-muted-foreground border-2 border-dashed rounded-lg">
                <Inbox className="h-10 w-10 opacity-50" />
                <p>No events found matching your criteria.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
