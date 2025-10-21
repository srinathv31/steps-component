export interface EventLogRow {
  execution_id: string;
  batch_id: string;
  traceability_id: string;

  // dynamic per call:
  application_id: string;

  // shared defaults:
  target_system: string;
  originating_system: string;
  process_name: string;

  // step-level:
  step: number; // auto from config ordering (1-based)
  step_name: string; // e.g., "validate-input"

  // payloads:
  business_action_request: string; // JSON
  business_action_response: string; // JSON
  identifiers: string; // JSON

  // outcome:
  result: string;
  http_status_code?: number | null;
  http_method?: string | null;
  endpoint?: string | null;

  // misc:
  metadata?: string | null;
  last_update_id?: string | null;
  execution_time?: number | null;
}

export type InsertEventLogFn = (row: EventLogRow) => Promise<void>;

export type LogCtx = {
  execution_id: string;
  batch_id: string;
  traceability_id: string;

  // dynamic:
  application_id: string;

  // optional helpers
  requestStartAt?: number;
  identifiers?: Record<string, unknown>;
  meta?: Record<string, unknown>;
};

export type Scenario = "success" | "error";
