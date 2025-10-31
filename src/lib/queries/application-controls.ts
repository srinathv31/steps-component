import { ApplicationControl } from "@/types/application";
import { getApplicationControls } from "@/data/mock-applications";

// Simulate async fetch with delay
export async function fetchApplicationControls(
  applicationId: string
): Promise<ApplicationControl[]> {
  // Simulate network delay (300-800ms)
  const delay = Math.random() * 500 + 300;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return getApplicationControls(applicationId);
}

// Query key factory
export const applicationControlsKeys = {
  all: ["application-controls"] as const,
  byApplication: (applicationId: string) =>
    [...applicationControlsKeys.all, applicationId] as const,
};

