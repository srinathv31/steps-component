import { Application, ApplicationControl } from "@/types/application";

export const mockApplications: Application[] = [
  {
    application_id: "APP-001",
    applicant_name: "John Doe",
    process_name: "Internal Credit Card",
    application_date: "2024-10-15",
    status: "COMPLETED",
  },
  {
    application_id: "APP-002",
    applicant_name: "Jane Smith",
    process_name: "Add Authorized User",
    application_date: "2024-10-20",
    status: "IN_PROGRESS",
  },
  {
    application_id: "APP-003",
    applicant_name: "Robert Johnson",
    process_name: "Loan Application",
    application_date: "2024-10-25",
    status: "PENDING",
  },
  {
    application_id: "APP-004",
    applicant_name: "Sarah Williams",
    process_name: "Employee Onboarding",
    application_date: "2024-10-28",
    status: "COMPLETED",
  },
  {
    application_id: "APP-005",
    applicant_name: "Michael Brown",
    process_name: "Internal Credit Card",
    application_date: "2024-10-30",
    status: "FAILED",
  },
  {
    application_id: "APP-006",
    applicant_name: "Emily Davis",
    process_name: "Add Authorized User",
    application_date: "2024-10-31",
    status: "IN_PROGRESS",
  },
];

export const mockApplicationControls: ApplicationControl[] = [
  // APP-001 controls (All PASSED)
  {
    control_id: 1,
    application_id: "APP-001",
    control_name: "HR Validation",
    control_status: "PASSED",
    check_timestamp: "2024-10-15T09:30:00Z",
  },
  {
    control_id: 2,
    application_id: "APP-001",
    control_name: "Phone Number Verification",
    control_status: "PASSED",
    check_timestamp: "2024-10-15T09:35:00Z",
  },
  {
    control_id: 3,
    application_id: "APP-001",
    control_name: "Email Validation",
    control_status: "PASSED",
    check_timestamp: "2024-10-15T09:40:00Z",
  },
  {
    control_id: 4,
    application_id: "APP-001",
    control_name: "Credit Check",
    control_status: "PASSED",
    check_timestamp: "2024-10-15T09:45:00Z",
  },

  // APP-002 controls (Mixed PASSED and PENDING)
  {
    control_id: 5,
    application_id: "APP-002",
    control_name: "SSN Verification",
    control_status: "PASSED",
    check_timestamp: "2024-10-20T10:15:00Z",
  },
  {
    control_id: 6,
    application_id: "APP-002",
    control_name: "Address Validation",
    control_status: "PASSED",
    check_timestamp: "2024-10-20T10:20:00Z",
  },
  {
    control_id: 7,
    application_id: "APP-002",
    control_name: "Identity Verification",
    control_status: "PENDING",
    check_timestamp: null,
  },
  {
    control_id: 8,
    application_id: "APP-002",
    control_name: "Phone Number Verification",
    control_status: "PENDING",
    check_timestamp: null,
  },

  // APP-003 controls (All PENDING)
  {
    control_id: 9,
    application_id: "APP-003",
    control_name: "SSN Verification",
    control_status: "PENDING",
    check_timestamp: null,
  },
  {
    control_id: 10,
    application_id: "APP-003",
    control_name: "Credit Check",
    control_status: "PENDING",
    check_timestamp: null,
  },
  {
    control_id: 11,
    application_id: "APP-003",
    control_name: "Income Verification",
    control_status: "PENDING",
    check_timestamp: null,
  },
  {
    control_id: 12,
    application_id: "APP-003",
    control_name: "Employment Verification",
    control_status: "PENDING",
    check_timestamp: null,
  },
  {
    control_id: 13,
    application_id: "APP-003",
    control_name: "Address Validation",
    control_status: "PENDING",
    check_timestamp: null,
  },

  // APP-004 controls (All PASSED)
  {
    control_id: 14,
    application_id: "APP-004",
    control_name: "HR Validation",
    control_status: "PASSED",
    check_timestamp: "2024-10-28T11:00:00Z",
  },
  {
    control_id: 15,
    application_id: "APP-004",
    control_name: "SSN Verification",
    control_status: "PASSED",
    check_timestamp: "2024-10-28T11:05:00Z",
  },
  {
    control_id: 16,
    application_id: "APP-004",
    control_name: "Identity Verification",
    control_status: "PASSED",
    check_timestamp: "2024-10-28T11:10:00Z",
  },
  {
    control_id: 17,
    application_id: "APP-004",
    control_name: "Employment Verification",
    control_status: "PASSED",
    check_timestamp: "2024-10-28T11:15:00Z",
  },
  {
    control_id: 18,
    application_id: "APP-004",
    control_name: "Background Check",
    control_status: "PASSED",
    check_timestamp: "2024-10-28T11:20:00Z",
  },

  // APP-005 controls (Some FAILED)
  {
    control_id: 19,
    application_id: "APP-005",
    control_name: "HR Validation",
    control_status: "PASSED",
    check_timestamp: "2024-10-30T14:00:00Z",
  },
  {
    control_id: 20,
    application_id: "APP-005",
    control_name: "Phone Number Verification",
    control_status: "FAILED",
    check_timestamp: "2024-10-30T14:05:00Z",
  },
  {
    control_id: 21,
    application_id: "APP-005",
    control_name: "Credit Check",
    control_status: "FAILED",
    check_timestamp: "2024-10-30T14:10:00Z",
  },
  {
    control_id: 22,
    application_id: "APP-005",
    control_name: "Email Validation",
    control_status: "PASSED",
    check_timestamp: "2024-10-30T14:15:00Z",
  },

  // APP-006 controls (Mixed)
  {
    control_id: 23,
    application_id: "APP-006",
    control_name: "SSN Verification",
    control_status: "PASSED",
    check_timestamp: "2024-10-31T15:00:00Z",
  },
  {
    control_id: 24,
    application_id: "APP-006",
    control_name: "Address Validation",
    control_status: "FAILED",
    check_timestamp: "2024-10-31T15:05:00Z",
  },
  {
    control_id: 25,
    application_id: "APP-006",
    control_name: "Phone Number Verification",
    control_status: "PENDING",
    check_timestamp: null,
  },
  {
    control_id: 26,
    application_id: "APP-006",
    control_name: "Identity Verification",
    control_status: "PENDING",
    check_timestamp: null,
  },
];

// Helper function to get controls by application ID
export function getApplicationControls(
  applicationId: string
): ApplicationControl[] {
  return mockApplicationControls.filter(
    (control) => control.application_id === applicationId
  );
}

