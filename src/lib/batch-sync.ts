import { CustomerDBRecord } from "@/types/customer-sync";
import { query } from "@/lib/db/query";

/**
 * Performs batch upsert using SQL Server MERGE statement
 * Updates existing records (by customer_id) or inserts new ones
 */
export async function batchUpsertCustomers(
  records: CustomerDBRecord[]
): Promise<void> {
  if (records.length === 0) {
    return;
  }

  // Build VALUES clause for MERGE statement
  // Each record needs 8 parameters (customer_id, first_name, last_name, state, country, zip, status, service)
  // Note: rowNumber is excluded as it's only for tracking, not a database column
  const valuesClause: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  for (const record of records) {
    valuesClause.push(
      `(@p${paramIndex}, @p${paramIndex + 1}, @p${paramIndex + 2}, @p${
        paramIndex + 3
      }, @p${paramIndex + 4}, @p${paramIndex + 5}, @p${paramIndex + 6}, @p${
        paramIndex + 7
      })`
    );

    params.push(
      record.customer_id,
      record.customer_first_name,
      record.customer_last_name,
      record.state,
      record.country,
      record.zip,
      record.customer_status,
      record.service
    );

    paramIndex += 8;
  }

  // MSSQL MERGE statement for upsert operation
  const sql = `
    MERGE INTO customers AS target
    USING (
      VALUES ${valuesClause.join(", ")}
    ) AS source (
      customer_id, 
      customer_first_name, 
      customer_last_name, 
      state, 
      country, 
      zip, 
      customer_status, 
      service
    )
    ON target.customer_id = source.customer_id
    WHEN MATCHED THEN
      UPDATE SET
        target.customer_first_name = source.customer_first_name,
        target.customer_last_name = source.customer_last_name,
        target.state = source.state,
        target.country = source.country,
        target.zip = source.zip,
        target.customer_status = source.customer_status,
        target.service = source.service
    WHEN NOT MATCHED THEN
      INSERT (
        customer_id,
        customer_first_name,
        customer_last_name,
        state,
        country,
        zip,
        customer_status,
        service
      )
      VALUES (
        source.customer_id,
        source.customer_first_name,
        source.customer_last_name,
        source.state,
        source.country,
        source.zip,
        source.customer_status,
        source.service
      );
  `;

  await query(sql, params);
}
