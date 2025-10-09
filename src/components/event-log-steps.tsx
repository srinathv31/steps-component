"use client";

import { useState } from "react";
import { EventLog } from "@/types/event-log";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";

interface EventLogStepsProps {
  eventLogs: EventLog[];
}

export function EventLogSteps({ eventLogs }: EventLogStepsProps) {
  const [selectedLog, setSelectedLog] = useState<EventLog | null>(null);

  const getStatusColor = (statusCode?: number | null) => {
    if (!statusCode) return "default";
    if (statusCode >= 200 && statusCode < 300) return "default";
    if (statusCode >= 400) return "destructive";
    return "secondary";
  };

  const formatJson = (jsonString: string) => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch {
      return jsonString;
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Event Log Timeline</h2>
          <p className="text-muted-foreground">
            Click on any step to view request and response details
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          {/* Steps */}
          {eventLogs.map((log, index) => {
            const isLastStep = index === eventLogs.length - 1;
            const isSuccess =
              log.http_status_code === 200 || log.http_status_code === 201;

            return (
              <div key={log.execution_id} className="relative pb-8 last:pb-0">
                {/* Step indicator */}
                <div className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-border">
                  {isSuccess ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>

                {/* Content */}
                <div className="ml-12">
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-primary"
                    onClick={() => setSelectedLog(log)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {log.step && (
                              <Badge
                                variant="outline"
                                className="font-mono text-xs"
                              >
                                Step {log.step}
                              </Badge>
                            )}
                            <Badge
                              variant={getStatusColor(log.http_status_code)}
                            >
                              {log.http_method}
                            </Badge>
                            {log.http_status_code && (
                              <Badge
                                variant={getStatusColor(log.http_status_code)}
                              >
                                {log.http_status_code}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-base mb-1 break-words">
                            {log.step_name || "Unnamed Step"}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {log.result}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {log.endpoint && (
                              <span className="font-mono">{log.endpoint}</span>
                            )}
                            {log.execution_time && (
                              <span>• {log.execution_time}ms</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dialog for viewing request/response */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLog?.step && (
                <Badge variant="outline" className="font-mono">
                  Step {selectedLog.step}
                </Badge>
              )}
              {selectedLog?.step_name || "Event Details"}
            </DialogTitle>
            <DialogDescription>{selectedLog?.result}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4 min-w-0">
            {/* Metadata section */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">Execution ID</p>
                <p className="font-mono text-xs text-muted-foreground break-all">
                  {selectedLog?.execution_id}
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Batch ID</p>
                <p className="font-mono text-xs text-muted-foreground break-all">
                  {selectedLog?.batch_id}
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Target System</p>
                <p className="text-muted-foreground">
                  {selectedLog?.target_system}
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Originating System</p>
                <p className="text-muted-foreground">
                  {selectedLog?.originating_system}
                </p>
              </div>
              {selectedLog?.endpoint && (
                <div className="col-span-2">
                  <p className="font-semibold mb-1">Endpoint</p>
                  <p className="font-mono text-sm text-muted-foreground">
                    {selectedLog.http_method} {selectedLog.endpoint}
                  </p>
                </div>
              )}
              {selectedLog?.execution_time && (
                <div>
                  <p className="font-semibold mb-1">Execution Time</p>
                  <p className="text-muted-foreground">
                    {selectedLog.execution_time}ms
                  </p>
                </div>
              )}
              {selectedLog?.http_status_code && (
                <div>
                  <p className="font-semibold mb-1">Status Code</p>
                  <Badge variant={getStatusColor(selectedLog.http_status_code)}>
                    {selectedLog.http_status_code}
                  </Badge>
                </div>
              )}
            </div>

            {/* Identifiers */}
            {selectedLog?.identifiers && selectedLog.identifiers !== "{}" && (
              <div className="min-w-0">
                <h3 className="font-semibold mb-2 text-sm">Identifiers</h3>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96 w-full min-w-0">
                  <code>{formatJson(selectedLog.identifiers)}</code>
                </pre>
              </div>
            )}

            {/* Request */}
            <div className="min-w-0">
              <h3 className="font-semibold mb-2 text-sm">
                Business Action Request
              </h3>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96 w-full min-w-0">
                <code>
                  {formatJson(selectedLog?.business_action_request || "{}")}
                </code>
              </pre>
            </div>

            {/* Response */}
            <div className="min-w-0">
              <h3 className="font-semibold mb-2 text-sm">
                Business Action Response
              </h3>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96 w-full min-w-0">
                <code>
                  {formatJson(selectedLog?.business_action_response || "{}")}
                </code>
              </pre>
            </div>

            {/* Metadata */}
            {selectedLog?.metadata && (
              <div className="min-w-0">
                <h3 className="font-semibold mb-2 text-sm">Metadata</h3>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96 w-full min-w-0">
                  <code>{formatJson(selectedLog.metadata)}</code>
                </pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
