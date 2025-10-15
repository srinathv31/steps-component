import {
  SyncResult,
  FailedBatch,
  CustomerDBRecord,
  InvalidRecord,
} from "@/types/customer-sync";
import { processCsvInBatches, countCsvRows } from "@/lib/csv-processor";
import { batchUpsertCustomers } from "@/lib/batch-sync";

// Hardcoded CSV path (mock path for now)
const CSV_FILE_PATH = "/tmp/customers_sync.csv";

/**
 * Main sync orchestrator that processes CSV file and syncs to database
 * Can be called from API route or cron job
 */
export async function syncCustomersFromCsv(
  csvPath: string = CSV_FILE_PATH
): Promise<SyncResult> {
  const startTime = Date.now();
  let totalRows = 0;
  let successfulRows = 0;
  const failedBatches: FailedBatch[] = [];
  const invalidRecords: InvalidRecord[] = [];

  console.log(`Starting CSV sync from: ${csvPath}`);

  // Count total rows for progress tracking (optional, can be removed for performance)
  try {
    totalRows = await countCsvRows(csvPath);
    console.log(`Total rows to process: ${totalRows}`);
  } catch (error) {
    console.warn("Could not count rows, proceeding with sync:", error);
  }

  let batchIndex = 0;
  const batchesToRetry: Array<{
    index: number;
    records: CustomerDBRecord[];
  }> = [];

  // First pass: Process all batches
  try {
    for await (const batch of processCsvInBatches(
      csvPath,
      1000,
      invalidRecords
    )) {
      try {
        await batchUpsertCustomers(batch);
        successfulRows += batch.length;
        console.log(
          `Batch ${batchIndex} processed successfully (${batch.length} records)`
        );
      } catch (error) {
        console.error(`Batch ${batchIndex} failed:`, error);
        // Track failed batch for retry
        batchesToRetry.push({
          index: batchIndex,
          records: batch,
        });
      }
      batchIndex++;
    }
  } catch (error) {
    console.error("Error processing CSV file:", error);
    throw error;
  }

  // Second pass: Retry failed batches once
  if (batchesToRetry.length > 0) {
    console.log(`Retrying ${batchesToRetry.length} failed batches...`);

    for (const failedBatch of batchesToRetry) {
      try {
        await batchUpsertCustomers(failedBatch.records);
        successfulRows += failedBatch.records.length;
        console.log(
          `Batch ${failedBatch.index} retry succeeded (${failedBatch.records.length} records)`
        );
      } catch (error) {
        console.error(`Batch ${failedBatch.index} retry failed:`, error);
        // Track final failure
        failedBatches.push({
          batchIndex: failedBatch.index,
          retryCount: 1,
          error: error instanceof Error ? error.message : String(error),
          records: failedBatch.records,
        });
      }
    }
  }

  const duration = Date.now() - startTime;
  const failedRows = failedBatches.reduce(
    (sum, batch) => sum + batch.records.length,
    0
  );

  const result: SyncResult = {
    totalRows: totalRows || successfulRows + failedRows + invalidRecords.length,
    successful: successfulRows,
    failed: failedRows,
    invalid: invalidRecords.length,
    failedRecords: failedBatches,
    invalidRecords,
    duration,
  };

  console.log(`Sync completed in ${duration}ms`);
  console.log(
    `Successful: ${successfulRows}, Failed: ${failedRows}, Invalid: ${invalidRecords.length}`
  );

  return result;
}
