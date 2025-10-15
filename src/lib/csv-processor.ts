import fs from "fs";
import csv from "csv-parser";
import {
  CustomerRecord,
  CustomerDBRecord,
  InvalidRecord,
} from "@/types/customer-sync";

/**
 * Maps CSV row to database record structure
 */
function mapToDBRecord(
  row: CustomerRecord,
  rowNumber: number
): CustomerDBRecord {
  return {
    rowNumber,
    customer_id: row.CustomerId,
    customer_first_name: row.CustomerFirstName,
    customer_last_name: row.CustomerLastName,
    state: row.State,
    country: row.Country,
    zip: row.ZipCode,
    customer_status: row.Status,
    service: row.ServiceDate,
  };
}

/**
 * Validates a CSV row has all required fields
 * Returns an array of validation errors (empty if valid)
 */
function validateRecord(row: CustomerRecord): string[] {
  const errors: string[] = [];
  const requiredFields = [
    "CustomerFirstName",
    "CustomerLastName",
    "CustomerId",
    "State",
    "Country",
    "ZipCode",
    "Status",
    "ServiceDate",
  ];

  for (const field of requiredFields) {
    if (!row[field as keyof CustomerRecord]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate Status is either A or P
  if (row.Status && row.Status !== "A" && row.Status !== "P") {
    errors.push(`Invalid Status: must be "A" or "P", got "${row.Status}"`);
  }

  // Validate ServiceDate format (yyyy-mm-dd)
  if (row.ServiceDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(row.ServiceDate)) {
      errors.push(
        `Invalid ServiceDate format: must be yyyy-mm-dd, got "${row.ServiceDate}"`
      );
    }
  }

  return errors;
}

/**
 * Process CSV file in batches using streaming
 * Returns an async generator that yields batches of records
 * Invalid records are collected in the invalidRecords array
 */
export async function* processCsvInBatches(
  filePath: string,
  batchSize: number = 1000,
  invalidRecords: InvalidRecord[] = []
): AsyncGenerator<CustomerDBRecord[], void, unknown> {
  let batch: CustomerDBRecord[] = [];
  let rowNumber = 0;

  const stream = fs.createReadStream(filePath).pipe(csv());

  for await (const row of stream) {
    rowNumber++;

    // Validate and map the record
    const validationErrors = validateRecord(row as CustomerRecord);

    if (validationErrors.length === 0) {
      const dbRecord = mapToDBRecord(row as CustomerRecord, rowNumber);
      batch.push(dbRecord);

      // Yield batch when it reaches the desired size
      if (batch.length >= batchSize) {
        yield batch;
        batch = [];
      }
    } else {
      // Collect invalid record with validation errors
      invalidRecords.push({
        rowNumber,
        data: row as Partial<CustomerRecord>,
        validationErrors,
      });
      console.warn(
        `Row ${rowNumber} validation failed:`,
        validationErrors.join(", ")
      );
    }
  }

  // Yield any remaining records in the final batch
  if (batch.length > 0) {
    yield batch;
  }

  if (invalidRecords.length > 0) {
    console.log(`Total invalid records skipped: ${invalidRecords.length}`);
  }
}

/**
 * Count total rows in CSV file (for progress tracking)
 */
export async function countCsvRows(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let count = 0;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", () => count++)
      .on("end", () => resolve(count))
      .on("error", reject);
  });
}
