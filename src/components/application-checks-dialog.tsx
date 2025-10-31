"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  applicationControlsKeys,
  fetchApplicationControls,
} from "@/lib/queries/application-controls";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { ApplicationControl } from "@/types/application";

interface ApplicationChecksDialogProps {
  applicationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicationChecksDialog({
  applicationId,
  open,
  onOpenChange,
}: ApplicationChecksDialogProps) {
  const { data: controls, isLoading } = useQuery({
    queryKey: applicationId
      ? applicationControlsKeys.byApplication(applicationId)
      : ["empty"],
    queryFn: () =>
      applicationId ? fetchApplicationControls(applicationId) : [],
    enabled: !!applicationId && open,
  });

  const getStatusIcon = (status: ApplicationControl["control_status"]) => {
    switch (status) {
      case "PASSED":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "FAILED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadgeVariant = (
    status: ApplicationControl["control_status"]
  ): "default" | "destructive" | "outline" => {
    switch (status) {
      case "PASSED":
        return "default";
      case "FAILED":
        return "destructive";
      case "PENDING":
        return "outline";
    }
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "Not yet completed";
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusCounts = () => {
    if (!controls) return { passed: 0, failed: 0, pending: 0 };
    return controls.reduce(
      (acc, control) => {
        if (control.control_status === "PASSED") acc.passed++;
        if (control.control_status === "FAILED") acc.failed++;
        if (control.control_status === "PENDING") acc.pending++;
        return acc;
      },
      { passed: 0, failed: 0, pending: 0 }
    );
  };

  const statusCounts = getStatusCounts();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Application Checks</DialogTitle>
          <DialogDescription>
            {applicationId ? (
              <>
                Control checks for application{" "}
                <span className="font-mono font-semibold">{applicationId}</span>
              </>
            ) : (
              "No application selected"
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Separator />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        ) : controls && controls.length > 0 ? (
          <div className="space-y-4">
            {/* Status Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-4 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-2xl font-light text-green-600 dark:text-green-500">
                  {statusCounts.passed}
                </div>
                <div className="text-sm text-green-600 dark:text-green-500 font-medium">
                  Passed
                </div>
              </div>
              <div className="bg-background rounded-lg p-4 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-2xl font-light text-red-600 dark:text-red-500">
                  {statusCounts.failed}
                </div>
                <div className="text-sm text-red-600 dark:text-red-500 font-medium">
                  Failed
                </div>
              </div>
              <div className="bg-background rounded-lg p-4 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-2xl font-light text-yellow-600 dark:text-yellow-500">
                  {statusCounts.pending}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-500 font-medium">
                  Pending
                </div>
              </div>
            </div>

            <Separator />

            {/* Checks List */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {controls.map((control) => (
                  <div
                    key={control.control_id}
                    className="bg-background rounded-lg p-4 shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)] hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)] dark:hover:shadow-[inset_0_2px_8px_rgba(0,0,0,0.35)] transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getStatusIcon(control.control_status)}
                        <div className="flex-1 space-y-1">
                          <div className="font-semibold">
                            {control.control_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatTimestamp(control.check_timestamp)}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={getStatusBadgeVariant(control.control_status)}
                        className="shrink-0"
                      >
                        {control.control_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No checks found for this application.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
