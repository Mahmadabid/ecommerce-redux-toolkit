export interface FloatingLabelInputProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  classname?: string;
  isDisabled?: boolean;
}

export interface Step {
  label: string;
  completed: boolean;
}

export interface StepperProps {
  currentStep: number;
  steps: Step[];
}

export interface ShippingFormProps {
  email: string;
  handleBack: (e: React.FormEvent) => void;
  handleNext: () => void;
  fullName: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
  shippingEmail: string;
  setShippingEmail: React.Dispatch<React.SetStateAction<string>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  zipCode: string;
  setZipCode: React.Dispatch<React.SetStateAction<string>>;
}
