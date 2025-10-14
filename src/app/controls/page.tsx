"use client";

import { useState } from "react";
import { ControlTemplate } from "@/types/control-template";
import { mockTemplates } from "@/data/mock-controls";
import { TemplateCard } from "@/components/template-card";
import { ControlTemplateDialog } from "@/components/control-template-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";

export default function ControlsPage() {
  const [templates, setTemplates] = useState<ControlTemplate[]>(mockTemplates);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<ControlTemplate | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "version">(
    "create"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique process names for tabs
  const processNames = Array.from(
    new Set(templates.map((t) => t.process_name))
  ).sort();

  // Filter templates based on search
  const filteredTemplates = templates.filter(
    (template) =>
      template.process_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.controls.some((control) =>
        control.control_type.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleEdit = (template: ControlTemplate) => {
    setEditingTemplate(template);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleCreateVersion = (template: ControlTemplate) => {
    setEditingTemplate(template);
    setDialogMode("version");
    setDialogOpen(true);
  };

  const handleDelete = (templateId: number) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates((prev) => prev.filter((t) => t.template_id !== templateId));
    }
  };

  const handleSave = (
    templateData: Omit<ControlTemplate, "template_id" | "created_date">
  ) => {
    if (dialogMode === "edit" && editingTemplate) {
      // Edit existing template
      setTemplates((prev) =>
        prev.map((t) =>
          t.template_id === editingTemplate.template_id
            ? {
                ...t,
                process_name: templateData.process_name,
                version: templateData.version,
                controls: templateData.controls,
              }
            : t
        )
      );
    } else {
      // Create new template or version
      const newTemplate: ControlTemplate = {
        template_id: Math.max(...templates.map((t) => t.template_id), 0) + 1,
        process_name: templateData.process_name,
        version: templateData.version,
        controls: templateData.controls,
        created_date: new Date().toISOString().split("T")[0],
      };
      setTemplates((prev) => [...prev, newTemplate]);
    }

    setDialogOpen(false);
    setEditingTemplate(null);
  };

  // Group templates by process name
  const groupedTemplates = (processName: string) => {
    return filteredTemplates
      .filter((t) => t.process_name === processName)
      .sort((a, b) => {
        // Sort by version (descending)
        return b.version.localeCompare(a.version, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="container mx-auto max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Control Templates</h1>
              <p className="text-muted-foreground">
                Manage control templates and versions for different processes
              </p>
            </div>
            <Button onClick={handleCreateNew} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates, versions, or controls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Total Templates
              </p>
              <p className="text-2xl font-bold">{templates.length}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Processes</p>
              <p className="text-2xl font-bold">{processNames.length}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Latest Version
              </p>
              <p className="text-2xl font-bold">
                {templates.length > 0
                  ? templates.reduce(
                      (latest, t) => (t.version > latest ? t.version : latest),
                      "v1.0"
                    )
                  : "-"}
              </p>
            </div>
          </div>

          {/* Templates organized by process */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full sm:w-auto overflow-x-auto flex-wrap h-auto">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              {processNames.map((processName) => (
                <TabsTrigger key={processName} value={processName}>
                  {processName}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "No templates found matching your search."
                      : "No templates yet. Create your first template to get started."}
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleCreateNew}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Template
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates
                    .sort((a, b) => {
                      const processCompare = a.process_name.localeCompare(
                        b.process_name
                      );
                      if (processCompare !== 0) return processCompare;
                      return b.version.localeCompare(a.version, undefined, {
                        numeric: true,
                        sensitivity: "base",
                      });
                    })
                    .map((template) => (
                      <TemplateCard
                        key={template.template_id}
                        template={template}
                        onEdit={handleEdit}
                        onCreateVersion={handleCreateVersion}
                        onDelete={handleDelete}
                      />
                    ))}
                </div>
              )}
            </TabsContent>

            {processNames.map((processName) => (
              <TabsContent
                key={processName}
                value={processName}
                className="mt-6"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-1">{processName}</h2>
                  <p className="text-sm text-muted-foreground">
                    {groupedTemplates(processName).length} version
                    {groupedTemplates(processName).length !== 1 ? "s" : ""}{" "}
                    available
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedTemplates(processName).map((template) => (
                    <TemplateCard
                      key={template.template_id}
                      template={template}
                      onEdit={handleEdit}
                      onCreateVersion={handleCreateVersion}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      {/* Dialog for Create/Edit */}
      <ControlTemplateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editingTemplate={editingTemplate}
        mode={dialogMode}
      />
    </div>
  );
}
