import React from "react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface AIGenerateButtonProps {
  isGenerating: boolean;
  onGenerate: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
}

export const AIGenerateButton: React.FC<AIGenerateButtonProps> = ({
  isGenerating,
  onGenerate,
  size = "md",
  variant = "solid"
}) => {
  return (
    <Tooltip content="Generate content using AI" placement="top">
      <Button
        color="primary"
        variant={variant}
        size={size}
        onPress={onGenerate}
        isLoading={isGenerating}
        className="p-2 min-w-0 w-10 h-10 rounded-full"
      >
        {!isGenerating && (
          <Icon
            icon="lucide:sparkles"
            className="text-lg"
          />
        )}
      </Button>
    </Tooltip>
  );
};
