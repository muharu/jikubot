import type { z } from "zod";
import { create } from "zustand";

import type { createEventRequestValidator } from "@giverve/validators";

interface Interactions {
  emoji: string;
  name: string;
  limit: number;
  participants: string[];
}

interface FormData {
  setupEventStep?: z.infer<typeof createEventRequestValidator>;
  interactionsStep: Interactions[];
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
      interactionsStep: [],
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
