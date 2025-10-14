export interface Control {
  control_id: number;
  control_type: string;
  description: string;
}

export interface ControlTemplate {
  template_id: number;
  process_name: string;
  version: string;
  controls: Control[];
  created_date: string;
}
