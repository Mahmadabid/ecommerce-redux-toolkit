export interface FloatingLabelInputProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export interface ShippingFormProps {
  email: string;
  handleBack: () => void;
  handleNext: () => void;
}

export interface Step {
  label: string;
  completed: boolean;
}

export interface StepperProps {
  currentStep: number;
  steps: Step[];
}
