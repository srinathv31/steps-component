import { ApplicationsTableClient } from "./_components/applications-table-client";
import { mockApplications } from "@/data/mock-applications";

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="container mx-auto max-w-7xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Applications</h1>
            <p className="text-muted-foreground">
              View and manage all application submissions and their control checks
            </p>
          </div>
          <ApplicationsTableClient applications={mockApplications} />
        </div>
      </main>
    </div>
  );
}

