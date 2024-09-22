// useForm.ts

import { useState, useCallback } from "react";
import { FormData } from "../types";

export const useForm = (
  initialState: FormData,
  validationRules: { required?: boolean } = {}
) => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    },
    []
  );

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (validationRules.required && !formData.name) {
      newErrors.name = "Name is required";
    }

    if (formData.type === "number") {
      if (
        formData.validation.min &&
        formData.validation.max &&
        Number(formData.validation.min) > Number(formData.validation.max)
      ) {
        newErrors.minMax = "Minimum value cannot be greater than maximum value";
      }
    }

    if (
      formData.type === "select" &&
      (!formData.options || formData.options.length === 0)
    ) {
      newErrors.options = "At least one option is required for select type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validationRules]);

  const setFormDataWithValidation = useCallback((data: FormData) => {
    setFormData(data);
    setErrors({});
  }, []);

  return {
    formData,
    handleChange,
    validate,
    errors,
    setFormData: setFormDataWithValidation,
  };
};
