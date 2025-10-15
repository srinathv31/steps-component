"use client";

import { useState, useEffect } from "react";
import { Control, ControlTemplate } from "@/types/control-template";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ControlTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    template: Omit<ControlTemplate, "template_id" | "created_date">
  ) => void;
  editingTemplate?: ControlTemplate | null;
  mode: "create" | "edit" | "version";
  controls: Control[];
  isPending?: boolean;
}

export function ControlTemplateDialog({
  open,
  onOpenChange,
  onSave,
  editingTemplate,
  mode,
  controls,
  isPending = false,
}: ControlTemplateDialogProps) {
  const [processName, setProcessName] = useState("");
  const [version, setVersion] = useState("");
  const [selectedControls, setSelectedControls] = useState<Control[]>([]);

  useEffect(() => {
    if (editingTemplate) {
      setProcessName(editingTemplate.process_name);
      setVersion(mode === "version" ? "" : editingTemplate.version);
      setSelectedControls(editingTemplate.controls);
    } else {
      setProcessName("");
      setVersion("");
      setSelectedControls([]);
    }
  }, [editingTemplate, mode, open]);

  const handleToggleControl = (control: Control) => {
    setSelectedControls((prev) => {
      const exists = prev.find((c) => c.control_id === control.control_id);
      if (exists) {
        return prev.filter((c) => c.control_id !== control.control_id);
      } else {
        return [...prev, control];
      }
    });
  };

  const handleSave = () => {
    if (
      !processName.trim() ||
      !version.trim() ||
      selectedControls.length === 0
    ) {
      return;
    }

    onSave({
      process_name: processName.trim(),
      version: version.trim(),
      controls: selectedControls,
    });

    // Reset form
    setProcessName("");
    setVersion("");
    setSelectedControls([]);
  };

  const isControlSelected = (controlId: number) => {
    return selectedControls.some((c) => c.control_id === controlId);
  };

  const getDialogTitle = () => {
    switch (mode) {
      case "edit":
        return "Edit Template";
      case "version":
        return "Create New Version";
      default:
        return "Create New Template";
    }
  };

  const getDialogDescription = () => {
    switch (mode) {
      case "edit":
        return "Update the template details and control selection.";
      case "version":
        return "Create a new version of this template with updated controls.";
      default:
        return "Create a new control template by selecting the required controls.";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="process-name">Process Name</Label>
            <Input
              id="process-name"
              placeholder="e.g., Internal Credit Card"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              disabled={mode === "version"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              placeholder="e.g., v1.0, v2.1"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
            {mode === "version" && editingTemplate && (
              <p className="text-xs text-muted-foreground">
                Current version: {editingTemplate.version}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <Label>Select Controls</Label>
              <div className="flex flex-wrap gap-1.5 justify-end max-w-md">
                {selectedControls.length === 0 ? (
                  <Badge variant="secondary">None selected</Badge>
                ) : selectedControls.length <= 5 ? (
                  selectedControls.map((control) => (
                    <Badge key={control.control_id} variant="secondary">
                      {control.control_type}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary">
                    {selectedControls.length} selected
                  </Badge>
                )}
              </div>
            </div>
            <ScrollArea className="h-64 rounded-md border p-4">
              <div className="space-y-3">
                {controls.map((control) => (
                  <div
                    key={control.control_id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleToggleControl(control)}
                  >
                    <Checkbox
                      id={`control-${control.control_id}`}
                      checked={isControlSelected(control.control_id)}
                      onCheckedChange={() => handleToggleControl(control)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 space-y-1">
                      <label
                        htmlFor={`control-${control.control_id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {control.control_type}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {control.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !processName.trim() ||
              !version.trim() ||
              selectedControls.length === 0 ||
              isPending
            }
          >
            {isPending
              ? "Saving..."
              : mode === "edit"
              ? "Save Changes"
              : "Create Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
