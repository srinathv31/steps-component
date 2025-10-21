import { logStep } from "./index";

await logStep({
  stepName: "create-customer",
  scenario: "success",
  ctx: { execution_id, batch_id, traceability_id, application_id },
  request: reqBody,
  response: resBody,
  http_status_code: 201,
  insertEventLog,
});

// await logStep({ stepName: "createCustomer", ... }); // ❌ compile-time error
