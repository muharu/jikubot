import type { Control, Path, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import { useWatch } from "react-hook-form";

export function useFormFieldValidation<T extends Record<string, string>>(
  form: UseFormReturn<T>,
  field: Path<T>,
) {
  const value = useWatch({ control: form.control as Control<T>, name: field });

  useEffect(() => {
    void form.trigger(field);
  }, [value, form, field]);
}
