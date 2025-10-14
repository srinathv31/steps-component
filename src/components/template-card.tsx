import { ControlTemplate } from "@/types/control-template";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Copy, Trash2 } from "lucide-react";

interface TemplateCardProps {
  template: ControlTemplate;
  onEdit: (template: ControlTemplate) => void;
  onCreateVersion: (template: ControlTemplate) => void;
  onDelete: (templateId: number) => void;
}

export function TemplateCard({
  template,
  onEdit,
  onCreateVersion,
  onDelete,
}: TemplateCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 hover:border-primary">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2 break-words">
              {template.process_name}
            </CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="secondary" className="font-mono">
                {template.version}
              </Badge>
              <Badge variant="outline">
                {template.controls.length} control
                {template.controls.length !== 1 ? "s" : ""}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Created: {new Date(template.created_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
              Controls:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {template.controls.map((control) => (
                <Badge
                  key={control.control_id}
                  variant="outline"
                  className="text-xs"
                >
                  {control.control_type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(template)}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateVersion(template)}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-1" />
              New Version
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(template.template_id)}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
