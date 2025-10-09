// app/components/EventLogStepper.tsx
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; // optional; remove cn() and use template strings if you don't have this

export interface EventLog {
  execution_id: string;
  batch_id: string;
  traceability_id: string;
  application_id: string;
  target_system: string;
  originating_system: string;
  process_name: string;
  step?: string | null;
  step_name?: string | null;

  identifiers: string; // JSON string of identifiers
  business_action_request: string; // JSON string of request body
  business_action_response: string; // JSON string of response body

  result: string; // high-level message
  metadata?: string | null;

  endpoint?: string | null;
  http_status_code?: number | null;
  http_method?: string | null;

  last_update_id?: string | null;
  execution_time?: number | null;
}

type Props = {
  logs?: EventLog[];
  title?: string;
};

const mock: EventLog[] = Array.from({ length: 7 }).map((_, i) => ({
  execution_id: crypto.randomUUID(),
  batch_id: `BATCH-${i + 1}`,
  traceability_id: crypto.randomUUID(),
  application_id: "12345",
  target_system: "TS2",
  originating_system: "TS2",
  process_name: "employee-card",
  step: `${i + 1}`,
  step_name: [
    "Receive Application",
    "Validate Identity",
    "FCRM & KYC Checks",
    "Fetch Account Profile",
    "Update Customer Name",
    "Issue Card Token",
    "Finalize & Notify",
  ][i],
  identifiers: JSON.stringify({
    employeeId: `E-${1000 + i}`,
    cardLast4: `${1234 + i}`,
  }),
  business_action_request: JSON.stringify({
    firstName: "Peggy",
    lastName: "String",
    seq: i + 1,
  }),
  business_action_response: JSON.stringify({
    status: "OK",
    seq: i + 1,
    watchlist: [{ seqNum: "01", firstName: "Peggy" }],
  }),
  result:
    i === 2
      ? "Successfully called Regulatory Check"
      : i === 4
      ? "Name updated"
      : "Step completed",
  metadata: null,
  endpoint: [
    "/ingest",
    "/id/validate",
    "/regulatory/fcrm",
    "/profiles/get",
    "/customer/update",
    "/card/tokenize",
    "/notify",
  ][i],
  http_status_code: i === 5 ? 201 : 200,
  http_method: i === 0 ? "POST" : "GET",
  last_update_id: "DEMO123",
  execution_time: 300 + i * 120,
}));

/** Safely pretty-print a JSON string, falling back to raw text */
function prettyJSON(input?: string | null) {
  if (!input) return "";
  try {
    return JSON.stringify(JSON.parse(input), null, 2);
  } catch {
    return input; // not valid JSON (already masked or truncated)
  }
}

/** status badge color heuristic */
function statusToBadgeVariant(code?: number | null) {
  if (!code) return "outline" as const;
  if (code >= 200 && code < 300) return "default" as const;
  if (code >= 300 && code < 400) return "secondary" as const;
  if (code >= 400 && code < 500) return "destructive" as const;
  return "destructive" as const;
}

/** little dot used in the vertical rail */
const StepDot: React.FC<{
  active?: boolean;
  success?: boolean;
  error?: boolean;
}> = ({ active, success, error }) => (
  <span
    className={cn(
      "block h-3 w-3 rounded-full ring-2",
      success && "bg-green-500 ring-green-200",
      error && "bg-red-500 ring-red-200",
      !success && !error && "bg-muted-foreground/60 ring-muted",
      active && "scale-110"
    )}
  />
);

export default function EventLogStepper({
  logs = mock,
  title = "Event Log Steps",
}: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Badge variant="outline">{logs.length} steps</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ol className="space-y-4">
            {logs.map((log, idx) => {
              const code = log.http_status_code ?? undefined;
              const isError = typeof code === "number" && code >= 400;
              const isSuccess =
                typeof code === "number" && code >= 200 && code < 300;

              return (
                <li key={log.execution_id} className="relative pl-12">
                  {/* connecting line to previous dot */}
                  {idx > 0 && (
                    <div
                      className="absolute left-4 -top-4 h-6 w-px bg-border"
                      aria-hidden
                    />
                  )}

                  {/* dot anchor */}
                  <div className="absolute left-2.5 top-2">
                    <StepDot
                      active={idx === 0}
                      success={isSuccess}
                      error={isError}
                    />
                  </div>

                  <Dialog>
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Step {log.step ?? idx + 1}
                          </span>
                          <Separator orientation="vertical" className="h-4" />
                          <h3 className="font-medium leading-none">
                            {log.step_name ?? log.process_name}
                          </h3>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          {log.http_method && (
                            <Badge variant="outline">{log.http_method}</Badge>
                          )}
                          {log.endpoint && (
                            <code className="rounded bg-muted px-2 py-0.5">
                              {log.endpoint}
                            </code>
                          )}
                          {typeof log.execution_time === "number" && (
                            <span className="ml-1">
                              • {log.execution_time} ms
                            </span>
                          )}
                          {typeof code !== "undefined" && (
                            <Badge variant={statusToBadgeVariant(code)}>
                              {code}
                            </Badge>
                          )}
                        </div>

                        <p className="mt-2 text-sm">{log.result}</p>
                      </div>

                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="shrink-0"
                        >
                          View payloads
                        </Button>
                      </DialogTrigger>
                    </div>

                    <DialogContent className="max-w-2xl p-0">
                      <DialogHeader className="px-6 pt-6">
                        <DialogTitle>
                          Step {log.step ?? idx + 1}:{" "}
                          {log.step_name ?? log.process_name}
                        </DialogTitle>
                        <div className="mt-1 text-xs text-muted-foreground px-0">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                              HTTP {log.http_status_code ?? "—"}
                            </Badge>
                            {log.http_method && (
                              <Badge variant="outline">{log.http_method}</Badge>
                            )}
                            {log.endpoint && (
                              <Badge variant="outline">{log.endpoint}</Badge>
                            )}
                            <Badge variant="outline">
                              exec: {log.execution_id.slice(0, 8)}
                            </Badge>
                          </div>
                        </div>
                      </DialogHeader>

                      <Tabs defaultValue="request" className="px-6 pb-6">
                        <TabsList className="mb-2">
                          <TabsTrigger value="request">Request</TabsTrigger>
                          <TabsTrigger value="response">Response</TabsTrigger>
                          <TabsTrigger value="identifiers">
                            Identifiers
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="request">
                          <ScrollArea className="h-80 rounded-md border">
                            <pre className="whitespace-pre-wrap p-4 text-xs leading-relaxed">
                              {prettyJSON(log.business_action_request)}
                            </pre>
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent value="response">
                          <ScrollArea className="h-80 rounded-md border">
                            <pre className="whitespace-pre-wrap p-4 text-xs leading-relaxed">
                              {prettyJSON(log.business_action_response)}
                            </pre>
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent value="identifiers">
                          <ScrollArea className="h-80 rounded-md border">
                            <pre className="whitespace-pre-wrap p-4 text-xs leading-relaxed">
                              {prettyJSON(log.identifiers)}
                            </pre>
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </li>
              );
            })}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
