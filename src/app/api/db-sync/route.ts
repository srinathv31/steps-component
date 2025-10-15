import { NextResponse } from "next/server";
import { syncCustomersFromCsv } from "@/lib/sync-orchestrator";

/**
 * POST /api/db-sync
 * Manually triggers the customer CSV sync process
 */
export async function POST() {
  try {
    console.log("DB sync triggered manually via API");

    // Execute the sync
    const result = await syncCustomersFromCsv();

    // Return success response with detailed results
    return NextResponse.json(
      {
        success: true,
        message: "Customer sync completed",
        data: {
          totalRows: result.totalRows,
          successful: result.successful,
          failed: result.failed,
          invalid: result.invalid,
          duration: `${result.duration}ms`,
          failedBatches: result.failedRecords.map((batch) => ({
            batchIndex: batch.batchIndex,
            retryCount: batch.retryCount,
            recordCount: batch.records.length,
            rowNumbers: batch.records.map((r) => r.rowNumber),
            error: batch.error,
          })),
          invalidRecords: result.invalidRecords.map((invalid) => ({
            rowNumber: invalid.rowNumber,
            validationErrors: invalid.validationErrors,
            data: invalid.data,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DB sync failed:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Customer sync failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/db-sync
 * Returns information about the sync endpoint
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/db-sync",
    method: "POST",
    description: "Triggers manual customer CSV to database sync",
    notes: [
      "Processes CSV file in batches of 1000 records",
      "Performs upsert operations (update existing or insert new)",
      "Retries failed batches once",
      "Returns detailed sync results",
    ],
  });
}
