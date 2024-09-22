export type ValidationRules = {
  required?: boolean;
  min?: string;
  max?: string;
  minLength?: string;
  maxLength?: string;
};

export type FormData = {
  name: string;
  type: "text" | "number" | "date" | "select" | "email" | "url";
  validation: ValidationRules;
  options?: string[];
};

export type Question = FormData;
