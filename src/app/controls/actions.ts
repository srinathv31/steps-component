"use server";

import { revalidatePath } from "next/cache";
import {
  insertTemplate,
  updateTemplate as dbUpdateTemplate,
  deleteTemplate as dbDeleteTemplate,
} from "@/lib/db/query";

export type ActionResult = {
  success: boolean;
  error?: string;
  templateId?: number;
};

export async function createTemplateAction(
  processName: string,
  version: string,
  controlIds: number[]
): Promise<ActionResult> {
  try {
    if (!processName.trim() || !version.trim() || controlIds.length === 0) {
      return {
        success: false,
        error: "Process name, version, and at least one control are required",
      };
    }

    const templateId = await insertTemplate(processName, version, controlIds);

    revalidatePath("/controls");

    return {
      success: true,
      templateId,
    };
  } catch (error) {
    console.error("Error creating template:", error);
    return {
      success: false,
      error: "Failed to create template",
    };
  }
}

export async function updateTemplateAction(
  templateId: number,
  processName: string,
  version: string,
  controlIds: number[]
): Promise<ActionResult> {
  try {
    if (!processName.trim() || !version.trim() || controlIds.length === 0) {
      return {
        success: false,
        error: "Process name, version, and at least one control are required",
      };
    }

    await dbUpdateTemplate(templateId, processName, version, controlIds);

    revalidatePath("/controls");

    return {
      success: true,
      templateId,
    };
  } catch (error) {
    console.error("Error updating template:", error);
    return {
      success: false,
      error: "Failed to update template",
    };
  }
}

export async function deleteTemplateAction(
  templateId: number
): Promise<ActionResult> {
  try {
    await dbDeleteTemplate(templateId);

    revalidatePath("/controls");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting template:", error);
    return {
      success: false,
      error: "Failed to delete template",
    };
  }
}
