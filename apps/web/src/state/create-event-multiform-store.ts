import type { z } from "zod";
import { create } from "zustand";

import type { createEventRequestValidator } from "@giverve/validators";

interface FormData {
  setupEventStep?: z.infer<typeof createEventRequestValidator>;
}

interface MultiStepFormStore {
  currentStep: number;
  formData: FormData;
  nextStep: () => void;
  previousStep: () => void;
  updateFormData: (newData: Partial<FormData>) => void;
}

export const useMultiStepCreateEventFormStore = create<MultiStepFormStore>()(
  (set) => ({
    currentStep: 1,
    formData: {
      setupEventStep: {
        guildId: "",
        title: "",
        description: "",
      },
    },
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    previousStep: () =>
      set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1),
      })),
    updateFormData: (newData) =>
      set((state) => ({
        formData: { ...state.formData, ...newData },
      })),
  }),
);
