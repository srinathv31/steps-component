import { Suspense } from "react";
import {
  getAllTemplates,
  getTemplatesByProcessName,
  getAllControls,
} from "@/lib/db/query";
import { ControlsPageClient } from "./_components/controls-page-client";
import { ControlsPageSkeleton } from "./_components/skeleton-loader";

interface ControlsPageProps {
  searchParams: Promise<{ process?: string }>;
}

export default async function ControlsPage({
  searchParams,
}: ControlsPageProps) {
  const params = await searchParams;
  const processFilter = params.process;

  // Fetch data based on process filter
  const templatesPromise = processFilter
    ? getTemplatesByProcessName(processFilter)
    : getAllTemplates();

  const controlsPromise = getAllControls();

  return (
    <Suspense fallback={<ControlsPageSkeleton />}>
      <ControlsPageClient
        templatesPromise={templatesPromise}
        controlsPromise={controlsPromise}
        currentProcess={processFilter || null}
      />
    </Suspense>
  );
}
