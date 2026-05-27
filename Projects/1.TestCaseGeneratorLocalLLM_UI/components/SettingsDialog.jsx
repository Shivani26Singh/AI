"use client";

import { useState } from "react";
import {
  SettingsIcon,
  KeyIcon,
  ZapIcon,
  ThermometerIcon,
  EyeIcon,
  EyeOffIcon,
  RotateCcwIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, FormInput } from "@/components/form/FormField";
import { useAppStore } from "@/lib/store";
import { validateSettings, getDefaultSettings } from "@/lib/settings-validators";
import {
  MODELS,
  TEMPERATURE_PRESETS,
  MAX_TOKENS_PRESETS,
} from "@/lib/constants";

export function SettingsDialog({ trigger, open: controlledOpen, onOpenChange: controlledOnOpenChange }) {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const resetSettings = useAppStore((s) => s.resetSettings);

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (v) => { if (controlledOnOpenChange) controlledOnOpenChange(v); }
    : setInternalOpen;
  const [local, setLocal] = useState({ ...settings });
  const [errors, setErrors] = useState({});
  const [showKey, setShowKey] = useState(false);

  const hasChanges =
    local.apiKey !== settings.apiKey ||
    local.model !== settings.model ||
    local.temperature !== settings.temperature ||
    local.maxTokens !== settings.maxTokens;

  const handleOpenChange = (isOpen) => {
    if (isOpen) {
      setLocal({ ...settings });
      setErrors({});
      setShowKey(false);
    }
    setOpen(isOpen);
  };

  const handleSave = () => {
    const sanitized = {
      apiKey: local.apiKey.trim(),
      model: local.model,
      temperature: local.temperature,
      maxTokens: local.maxTokens,
    };

    const { valid, errors: validationErrors } = validateSettings(sanitized);

    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    updateSettings(sanitized);
    setOpen(false);
    toast.success("Settings saved", {
      description: "Your generation preferences have been updated.",
    });
  };

  const handleResetDefaults = () => {
    const defaults = getDefaultSettings();
    setLocal(defaults);
    setErrors({});
    toast("Settings reset to defaults", {
      description: "Click Save to apply or Cancel to discard.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            size="sm"
          >
            <SettingsIcon className="size-4" aria-hidden="true" />
            Settings
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby="settings-desc">
        <DialogHeader>
          <DialogTitle>Generation Settings</DialogTitle>
          <DialogDescription id="settings-desc">
            Configure your Groq API connection and model parameters.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <FormField
            label="Groq API Key"
            icon={KeyIcon}
            error={errors.apiKey}
            hint="Leave blank to use the server environment variable."
          >
            <div className="relative">
              <FormInput
                type={showKey ? "text" : "password"}
                value={local.apiKey}
                onChange={(e) => {
                  setLocal({ ...local, apiKey: e.target.value });
                  if (errors.apiKey) setErrors({ ...errors, apiKey: undefined });
                }}
                placeholder="gsk_..."
                error={!!errors.apiKey}
                aria-label="Groq API key"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showKey ? "Hide API key" : "Show API key"}
              >
                {showKey ? (
                  <EyeOffIcon className="size-4" aria-hidden="true" />
                ) : (
                  <EyeIcon className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </FormField>

          <FormField label="Model" icon={ZapIcon} error={errors.model}>
            <Select
              value={local.model}
              onValueChange={(v) => {
                setLocal({ ...local, model: v });
                if (errors.model) setErrors({ ...errors, model: undefined });
              }}
            >
              <SelectTrigger className="w-full" aria-label="Select model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Temperature"
            icon={ThermometerIcon}
            error={errors.temperature}
            hint="Lower values produce more focused responses."
          >
            <Select
              value={String(local.temperature)}
              onValueChange={(v) => {
                setLocal({ ...local, temperature: parseFloat(v) });
                if (errors.temperature) setErrors({ ...errors, temperature: undefined });
              }}
            >
              <SelectTrigger className="w-full" aria-label="Select temperature">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPERATURE_PRESETS.map((t) => (
                  <SelectItem key={t.value} value={String(t.value)}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Max Tokens"
            error={errors.maxTokens}
            hint="Maximum length of the generated response."
          >
            <Select
              value={String(local.maxTokens)}
              onValueChange={(v) => {
                setLocal({ ...local, maxTokens: parseInt(v, 10) });
                if (errors.maxTokens) setErrors({ ...errors, maxTokens: undefined });
              }}
            >
              <SelectTrigger className="w-full" aria-label="Select max tokens">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAX_TOKENS_PRESETS.map((mt) => (
                  <SelectItem key={mt.value} value={String(mt.value)}>
                    {mt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={handleResetDefaults}
          >
            <RotateCcwIcon className="size-3.5" aria-hidden="true" />
            Reset to defaults
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
              Save settings
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
