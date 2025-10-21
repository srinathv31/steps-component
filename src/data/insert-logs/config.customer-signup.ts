import { defineProcess, StepConfig } from "./define-process";

export const processSignup = defineProcess([
  "validate-input",
  "create-customer",
  "link-application",
  "provision-benefits",
  "send-welcome-email",
] as const)({
  "validate-input": {
    success: { result: "Input validated" },
    error: { result: "Input validation failed" },
  },
  "create-customer": {
    http_method: "POST",
    endpoint: "/customers",
    success: { result: "Customer created" },
    error: { result: "Failed to create customer" },
  },
  "link-application": {
    http_method: "PATCH",
    endpoint: "/applications/link",
    success: { result: "Application linked to customer" },
    error: { result: "Failed to link application" },
  },
  "provision-benefits": {
    http_method: "POST",
    endpoint: "/benefits/provision",
    success: { result: "Benefits provisioned" },
    error: { result: "Failed to provision benefits" },
  },
  "send-welcome-email": {
    http_method: "POST",
    endpoint: "/notifications/welcome",
    success: { result: "Welcome email sent" },
    error: { result: "Failed to send welcome email" },
  },
});

export type StepName = (typeof processSignup.stepsInOrder)[number];

// Hardcoded process defaults live with the process config
export const PROCESS_DEFAULTS = {
  target_system: "VendorX",
  originating_system: "MiddlewareAPI",
  process_name: "customer-signup",
} as const;

export type ProcessDefaults = typeof PROCESS_DEFAULTS;
export type { StepConfig };
