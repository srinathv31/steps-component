"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Application } from "@/types/application";
import { ApplicationChecksDialog } from "@/components/application-checks-dialog";
import {
  applicationControlsKeys,
  fetchApplicationControls,
} from "@/lib/queries/application-controls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Clock, FileCheck } from "lucide-react";

interface ApplicationsTableClientProps {
  applications: Application[];
}

export function ApplicationsTableClient({
  applications,
}: ApplicationsTableClientProps) {
  const queryClient = useQueryClient();
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setDialogOpen(true);
  };

  const handlePrefetch = (applicationId: string) => {
    queryClient.prefetchQuery({
      queryKey: applicationControlsKeys.byApplication(applicationId),
      queryFn: () => fetchApplicationControls(applicationId),
    });
  };

  const getStatusIcon = (status: Application["status"]) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "FAILED":
        return <AlertCircle className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (
    status: Application["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "FAILED":
        return "destructive";
      case "IN_PROGRESS":
        return "secondary";
      case "PENDING":
        return "outline";
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application ID</TableHead>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Process</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Checks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.application_id}>
                <TableCell className="font-mono text-sm">
                  {application.application_id}
                </TableCell>
                <TableCell className="font-medium">
                  {application.applicant_name}
                </TableCell>
                <TableCell>{application.process_name}</TableCell>
                <TableCell>
                  {new Date(application.application_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(application.status)}
                    className="flex items-center gap-1 w-fit"
                  >
                    {getStatusIcon(application.status)}
                    {application.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onMouseEnter={() =>
                      handlePrefetch(application.application_id)
                    }
                    onClick={() => handleOpenDialog(application.application_id)}
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    View Checks
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ApplicationChecksDialog
        applicationId={selectedApplicationId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}

