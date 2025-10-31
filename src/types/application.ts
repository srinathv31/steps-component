export interface Application {
  application_id: string;
  applicant_name: string;
  process_name: string;
  application_date: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
}

export interface ApplicationControl {
  control_id: number;
  application_id: string;
  control_name: string;
  control_status: "PASSED" | "FAILED" | "PENDING";
  check_timestamp: string | null;
}

