import { EventLogSteps } from "@/components/event-log-steps";
import { mockEventLogs } from "@/data/mock-event-logs";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="container mx-auto">
        <EventLogSteps eventLogs={mockEventLogs} />
      </main>
    </div>
  );
}
