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

  result: string; // high-level message e.g. "Successfully called Regulatory Check"
  metadata?: string | null;

  endpoint?: string | null;
  http_status_code?: number | null;
  http_method?: string | null;

  last_update_id?: string | null;
  execution_time?: number | null;
}
