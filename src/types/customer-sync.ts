// CSV row structure matching the input CSV file
export interface CustomerRecord {
  CustomerFirstName: string;
  CustomerLastName: string;
  CustomerId: string;
  State: string;
  Country: string;
  ZipCode: string;
  Status: string; // "A" or "P"
  ServiceDate: string; // yyyy-mm-dd format
}

// Database row structure (mapped to snake_case)
export interface CustomerDBRecord {
  rowNumber: number; // Original row number from CSV (for tracking/auditing)
  customer_id: string;
  customer_first_name: string;
  customer_last_name: string;
  state: string;
  country: string;
  zip: string;
  customer_status: string;
  service: string;
}

// Failed batch tracking
export interface FailedBatch {
  batchIndex: number;
  retryCount: number;
  error: string;
  records: CustomerDBRecord[];
}

// Invalid record tracking (validation failures)
export interface InvalidRecord {
  rowNumber: number;
  data: Partial<CustomerRecord>;
  validationErrors: string[];
}

// Sync operation results
export interface SyncResult {
  totalRows: number;
  successful: number;
  failed: number;
  invalid: number;
  failedRecords: FailedBatch[];
  invalidRecords: InvalidRecord[];
  duration: number; // in milliseconds
}
