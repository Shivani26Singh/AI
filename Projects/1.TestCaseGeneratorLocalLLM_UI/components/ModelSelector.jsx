"use client";

import { BrainCircuitIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODELS, DEFAULT_MODEL } from "@/lib/constants";

export function ModelSelector({ value, onChange }) {
  return (
    <Select value={value || DEFAULT_MODEL} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] sm:w-[200px] rounded-xl border-border/50 bg-background/50 backdrop-blur-md" aria-label="Select AI model">
        <BrainCircuitIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
