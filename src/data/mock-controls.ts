import { Control, ControlTemplate } from "@/types/control-template";

// Hardcoded list of control primitives
export const mockControls: Control[] = [
  {
    control_id: 1,
    control_type: "HR",
    description: "Human Resources verification and compliance check",
  },
  {
    control_id: 2,
    control_type: "Phone Number",
    description: "Phone number validation and verification",
  },
  {
    control_id: 3,
    control_type: "Address Validation",
    description: "Physical address verification and standardization",
  },
  {
    control_id: 4,
    control_type: "SSN",
    description: "Social Security Number verification",
  },
  {
    control_id: 5,
    control_type: "Credit Check",
    description: "Credit history and score verification",
  },
  {
    control_id: 6,
    control_type: "Identity Verification",
    description: "Identity document verification (Driver's License, Passport)",
  },
  {
    control_id: 7,
    control_type: "Employment Verification",
    description: "Current and past employment verification",
  },
  {
    control_id: 8,
    control_type: "Income Verification",
    description: "Income and financial statement verification",
  },
  {
    control_id: 9,
    control_type: "Background Check",
    description: "Criminal and civil background check",
  },
  {
    control_id: 10,
    control_type: "Email Validation",
    description: "Email address validation and verification",
  },
];

// Sample templates with versioning
export const mockTemplates: ControlTemplate[] = [
  {
    template_id: 1,
    process_name: "Internal Credit Card",
    version: "v1.0",
    controls: [
      mockControls[0], // HR
      mockControls[1], // Phone Number
    ],
    created_date: "2024-01-15",
  },
  {
    template_id: 2,
    process_name: "Internal Credit Card",
    version: "v1.1",
    controls: [
      mockControls[0], // HR
      mockControls[1], // Phone Number
      mockControls[9], // Email Validation
    ],
    created_date: "2024-03-20",
  },
  {
    template_id: 3,
    process_name: "Internal Credit Card",
    version: "v2.0",
    controls: [
      mockControls[0], // HR
      mockControls[1], // Phone Number
      mockControls[9], // Email Validation
      mockControls[4], // Credit Check
    ],
    created_date: "2024-06-10",
  },
  {
    template_id: 4,
    process_name: "Add Authorized User",
    version: "v1.0",
    controls: [
      mockControls[3], // SSN
      mockControls[2], // Address Validation
      mockControls[1], // Phone Number
    ],
    created_date: "2024-02-01",
  },
  {
    template_id: 5,
    process_name: "Add Authorized User",
    version: "v1.2",
    controls: [
      mockControls[3], // SSN
      mockControls[2], // Address Validation
      mockControls[1], // Phone Number
      mockControls[5], // Identity Verification
    ],
    created_date: "2024-05-15",
  },
  {
    template_id: 6,
    process_name: "Employee Onboarding",
    version: "v1.0",
    controls: [
      mockControls[0], // HR
      mockControls[3], // SSN
      mockControls[5], // Identity Verification
      mockControls[6], // Employment Verification
      mockControls[8], // Background Check
    ],
    created_date: "2024-04-01",
  },
  {
    template_id: 7,
    process_name: "Loan Application",
    version: "v1.0",
    controls: [
      mockControls[3], // SSN
      mockControls[4], // Credit Check
      mockControls[7], // Income Verification
      mockControls[6], // Employment Verification
      mockControls[2], // Address Validation
    ],
    created_date: "2024-03-10",
  },
];
