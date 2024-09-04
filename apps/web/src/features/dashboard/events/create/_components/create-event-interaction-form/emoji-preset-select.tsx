import { useEffect, useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@giverve/ui/select";

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";

interface Interaction {
  id: string;
  name: string;
  limit: string;
}

const interactionExists = (interactions: Interaction[], id: string): boolean =>
  interactions.some((interaction) => interaction.id === id);

export function EmojisPresetSelect() {
  const formData = useMultiStepCreateEventFormStore((state) => state.formData);
  const addInteraction = useMultiStepCreateEventFormStore(
    (state) => state.addInteraction,
  );
  const removeInteraction = useMultiStepCreateEventFormStore(
    (state) => state.removeInteraction,
  );

  const [selectedPreset, setSelectedPreset] = useState<string>("default");
  const hasAddedDefaultInteraction = useRef(false);

  useEffect(() => {
    if (!hasAddedDefaultInteraction.current) {
      if (
        !interactionExists(formData.interactionsStep, "1256723755741479022")
      ) {
        addInteraction({
          id: "1256723755741479022",
          name: "Accept",
          limit: "50",
        });
      }
      hasAddedDefaultInteraction.current = true;
    }
  }, [addInteraction, formData.interactionsStep]);

  useEffect(() => {
    const presets: Record<string, Interaction[]> = {
      default: [{ id: "1256723755741479022", name: "Accept", limit: "50" }],
      "accept-decline-tentative": [
        { id: "1256723755741479022", name: "Accept", limit: "50" },
        { id: "1256723758396473434", name: "Decline", limit: "50" },
        { id: "1256723760837562399", name: "Tentative", limit: "50" },
      ],
    };

    const currentInteractions = formData.interactionsStep;

    const isPresetMatched = Object.entries(presets).some(
      ([_, interactions]) => {
        return (
          interactions.length === currentInteractions.length &&
          interactions.every((interaction) =>
            interactionExists(currentInteractions, interaction.id),
          )
        );
      },
    );

    if (!isPresetMatched) {
      setSelectedPreset("custom");
    }
  }, [formData.interactionsStep]);

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);

    const presets: Record<string, Interaction[]> = {
      default: [{ id: "1256723755741479022", name: "Accept", limit: "50" }],
      "accept-decline-tentative": [
        { id: "1256723755741479022", name: "Accept", limit: "50" },
        { id: "1256723758396473434", name: "Decline", limit: "50" },
        { id: "1256723760837562399", name: "Tentative", limit: "50" },
      ],
    };

    const selectedPresetInteractions = presets[preset];

    if (preset !== "custom") {
      formData.interactionsStep.forEach((interaction) => {
        if (
          !selectedPresetInteractions?.some(
            (presetInteraction) => presetInteraction.id === interaction.id,
          )
        ) {
          removeInteraction(interaction.id);
        }
      });

      // Add interactions from the selected preset
      selectedPresetInteractions?.forEach((interaction) => {
        if (!interactionExists(formData.interactionsStep, interaction.id)) {
          addInteraction(interaction);
        }
      });
    }
  };

  return (
    <Select value={selectedPreset} onValueChange={handlePresetChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a preset" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="accept-decline-tentative">Three Option</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
