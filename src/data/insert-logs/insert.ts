import { COMPILED } from "./compile";
import { PROCESS_DEFAULTS, type StepName } from "./config.customer-signup";
import type { EventLogRow, InsertEventLogFn, LogCtx, Scenario } from "./types";

export async function logStep(args: {
  stepName: StepName; // compile-time guarded
  scenario: Scenario; // "success" | "error"
  ctx: LogCtx;
  insertEventLog: InsertEventLogFn;

  request?: unknown;
  response?: unknown;
  http_status_code?: number | null;

  // optional overrides:
  resultOverride?: string;
  http_method?: string | null;
  endpoint?: string | null;
  metadata?: Record<string, unknown>;
  last_update_id?: string | null;
  execution_time_ms?: number | null;
}) {
  const {
    stepName,
    scenario,
    ctx,
    insertEventLog,
    request,
    response,
    http_status_code = null,
    resultOverride,
    http_method,
    endpoint,
    metadata,
    last_update_id = null,
    execution_time_ms,
  } = args;

  const compiled = COMPILED.byName[stepName];
  const { step, cfg } = compiled;

  const defaultResult =
    scenario === "success" ? cfg.success.result : cfg.error.result;
  const result = resultOverride ?? defaultResult;

  const row: EventLogRow = {
    execution_id: ctx.execution_id,
    batch_id: ctx.batch_id,
    traceability_id: ctx.traceability_id,

    application_id: ctx.application_id,

    target_system: PROCESS_DEFAULTS.target_system,
    originating_system: PROCESS_DEFAULTS.originating_system,
    process_name: PROCESS_DEFAULTS.process_name,

    step,
    step_name: stepName,

    identifiers: JSON.stringify(ctx.identifiers ?? {}),
    business_action_request: JSON.stringify(request ?? {}),
    business_action_response: JSON.stringify(response ?? {}),

    result,
    http_status_code,
    http_method: http_method ?? cfg.http_method ?? null,
    endpoint: endpoint ?? cfg.endpoint ?? null,

    metadata: metadata
      ? JSON.stringify({ ...(ctx.meta ?? {}), ...metadata })
      : ctx.meta
      ? JSON.stringify(ctx.meta)
      : null,

    last_update_id,
    execution_time:
      execution_time_ms ??
      (ctx.requestStartAt
        ? Math.max(0, Date.now() - ctx.requestStartAt)
        : null),
  };

  await insertEventLog(row);
}
