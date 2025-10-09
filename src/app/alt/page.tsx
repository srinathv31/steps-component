// app/page.tsx (or any client component)
import EventLogStepper from "@/app/alt/_components/stepper";
// import { type EventLog } from "@/components/EventLogStepper";

export default function Page() {
  // const logs: EventLog[] = await fetch(...); // server -> pass as prop to a client component if needed
  return (
    <main className="container mx-auto max-w-3xl py-8">
      <EventLogStepper />
      {/* or <EventLogStepper logs={logsFromDb} title="Batch TS2-798e..." /> */}
    </main>
  );
}
