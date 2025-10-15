import { Control, ControlTemplate } from "@/types/control-template";

// mock mssql query function
export async function query(_sql: string, _params: unknown[]) {
  const result = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ rows: [] });
    }, 100);
  });

  // @ts-expect-error - mock mssql query function
  return result.rows;
}

// Get all controls from the controls table
export async function getAllControls(): Promise<Control[]> {
  const sql = `
    SELECT control_id, control_type, description
    FROM controls
    ORDER BY control_type
  `;

  const rows = await query(sql, []);
  return rows as Control[];
}

// Get all templates with their associated controls
export async function getAllTemplates(): Promise<ControlTemplate[]> {
  const sql = `
    SELECT 
      ct.template_id,
      ct.process_name,
      ct.version,
      ct.created_at as created_date,
      c.control_id,
      c.control_type,
      c.description
    FROM controls_template ct
    INNER JOIN controls c ON ct.control_id = c.control_id
    ORDER BY ct.template_id, c.control_type
  `;

  const rows = (await query(sql, [])) as Array<{
    template_id: number;
    process_name: string;
    version: string;
    created_date: string;
    control_id: number;
    control_type: string;
    description: string;
  }>;

  // Group rows by template_id
  const templatesMap = new Map<number, ControlTemplate>();

  for (const row of rows) {
    if (!templatesMap.has(row.template_id)) {
      templatesMap.set(row.template_id, {
        template_id: row.template_id,
        process_name: row.process_name,
        version: row.version,
        created_date: row.created_date,
        controls: [],
      });
    }

    const template = templatesMap.get(row.template_id)!;
    template.controls.push({
      control_id: row.control_id,
      control_type: row.control_type,
      description: row.description,
    });
  }

  return Array.from(templatesMap.values());
}

// Get templates filtered by process name
export async function getTemplatesByProcessName(
  processName: string
): Promise<ControlTemplate[]> {
  const sql = `
    SELECT 
      ct.template_id,
      ct.process_name,
      ct.version,
      ct.created_at as created_date,
      c.control_id,
      c.control_type,
      c.description
    FROM controls_template ct
    INNER JOIN controls c ON ct.control_id = c.control_id
    WHERE ct.process_name = @p1
    ORDER BY ct.template_id, c.control_type
  `;

  const rows = (await query(sql, [processName])) as Array<{
    template_id: number;
    process_name: string;
    version: string;
    created_date: string;
    control_id: number;
    control_type: string;
    description: string;
  }>;

  // Group rows by template_id
  const templatesMap = new Map<number, ControlTemplate>();

  for (const row of rows) {
    if (!templatesMap.has(row.template_id)) {
      templatesMap.set(row.template_id, {
        template_id: row.template_id,
        process_name: row.process_name,
        version: row.version,
        created_date: row.created_date,
        controls: [],
      });
    }

    const template = templatesMap.get(row.template_id)!;
    template.controls.push({
      control_id: row.control_id,
      control_type: row.control_type,
      description: row.description,
    });
  }

  return Array.from(templatesMap.values());
}

// Get the next available template_id
export async function getNextTemplateId(): Promise<number> {
  const sql = `
    SELECT ISNULL(MAX(template_id), 0) + 1 as next_id
    FROM controls_template
  `;

  const rows = (await query(sql, [])) as Array<{ next_id: number }>;
  return rows[0]?.next_id || 1;
}

// Insert a new template with multiple controls
export async function insertTemplate(
  processName: string,
  version: string,
  controlIds: number[]
): Promise<number> {
  const templateId = await getNextTemplateId();

  // Build dynamic INSERT statement for multiple rows
  // @p1 = templateId, @p2 = processName, @p3 = version
  // @p4, @p5, @p6... = controlIds
  const values = controlIds
    .map((_, index) => {
      const controlIdParam = index + 4;
      return `(@p1, @p2, @p${controlIdParam}, @p3, GETDATE())`;
    })
    .join(", ");

  const sql = `
    INSERT INTO controls_template (template_id, process_name, control_id, version, created_at)
    VALUES ${values}
  `;

  const params = [templateId, processName, version, ...controlIds];

  await query(sql, params);
  return templateId;
}

// Update an existing template (delete old controls, insert new ones)
// Wrapped in transaction to prevent data loss if INSERT fails
export async function updateTemplate(
  templateId: number,
  processName: string,
  version: string,
  controlIds: number[]
): Promise<void> {
  // Build INSERT values clause
  // @p1 = templateId, @p2 = processName, @p3 = version
  // @p4, @p5, @p6... = controlIds
  const values = controlIds
    .map((_, index) => {
      const controlIdParam = index + 4;
      return `(@p1, @p2, @p${controlIdParam}, @p3, GETDATE())`;
    })
    .join(", ");

  // Execute DELETE and INSERT within a transaction
  const transactionSql = `
    BEGIN TRANSACTION;
    BEGIN TRY
      -- Delete existing controls for this template
      DELETE FROM controls_template
      WHERE template_id = @p1;
      
      -- Insert new controls
      INSERT INTO controls_template (template_id, process_name, control_id, version, created_at)
      VALUES ${values};
      
      COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
      -- Rollback on any error to preserve existing data
      IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
      
      -- Re-throw the error
      THROW;
    END CATCH
  `;

  const params = [templateId, processName, version, ...controlIds];

  await query(transactionSql, params);
}

// Delete a template and all its associated controls
export async function deleteTemplate(templateId: number): Promise<void> {
  const sql = `
    DELETE FROM controls_template
    WHERE template_id = @p1
  `;

  await query(sql, [templateId]);
}
