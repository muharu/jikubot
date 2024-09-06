import { create } from "zustand";

import type {
  EventInteraction,
  EventInteractionsRequest,
  EventSetupRequest,
} from "@giverve/validators";

interface FormData {
  setupEventStep: EventSetupRequest;
  interactionsStep: EventInteractionsRequest;
}

interface MultiStepFormStore {
  currentStep: number;
  formData: FormData;
  nextStep: () => void;
  previousStep: () => void;
  updateFormData: (newData: Partial<FormData>) => void;
  addInteraction: (interaction: EventInteraction) => void;
  removeInteraction: (interactionId: string) => void;
  editInteraction: (updatedInteraction: EventInteraction) => void;
}

export const useMultiStepCreateEventFormStore = create<MultiStepFormStore>()(
  (set) => ({
    currentStep: 1,
    formData: {
      setupEventStep: {
        channelId: "",
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
    addInteraction: (interaction) =>
      set((state) => ({
        formData: {
          ...state.formData,
          interactionsStep: [...state.formData.interactionsStep, interaction],
        },
      })),
    removeInteraction: (interactionId) =>
      set((state) => ({
        formData: {
          ...state.formData,
          interactionsStep: state.formData.interactionsStep.filter(
            (interaction) => interaction.id !== interactionId,
          ),
        },
      })),
    editInteraction: (updatedInteraction) =>
      set((state) => ({
        formData: {
          ...state.formData,
          interactionsStep: state.formData.interactionsStep.map(
            (interaction) =>
              interaction.id === updatedInteraction.id
                ? updatedInteraction
                : interaction,
          ),
        },
      })),
  }),
);
