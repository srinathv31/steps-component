import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TemplateCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <div className="flex flex-wrap gap-1.5">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ControlsPageSkeleton() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="container mx-auto max-w-7xl">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <Skeleton className="h-11 w-48" />
          </div>

          {/* Search Skeleton */}
          <Skeleton className="h-10 max-w-md" />

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted/50 p-4 rounded-lg">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-md" />

            {/* Template Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <TemplateCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
