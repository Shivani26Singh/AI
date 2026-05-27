"use client";

import { motion } from "framer-motion";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorWorkspace({ message, onRetry }) {
  const isAuthError = message?.toLowerCase().includes("api key");
  const isModelError = message?.toLowerCase().includes("model");
  const isRateLimit = message?.toLowerCase().includes("rate limit");
  const isDecommissioned = message?.toLowerCase().includes("decommissioned");

  const getTitle = () => {
    if (isAuthError) return "Authentication failed";
    if (isModelError) return "Model unavailable";
    if (isRateLimit) return "Rate limit reached";
    if (isDecommissioned) return "Model decommissioned";
    return "Generation failed";
  };

  const getHint = () => {
    if (isAuthError) return "Check your API key in Settings.";
    if (isDecommissioned) return "Try selecting a different model from the dropdown.";
    if (isRateLimit) return "Wait a moment and try again.";
    return "Try again or check your API configuration.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col items-center justify-center px-6 py-24 text-center"
    >
      <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
        <AlertTriangleIcon className="size-6 text-destructive/70" />
      </div>

      <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
        {getTitle()}
      </h2>

      <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
        {message || "An unexpected error occurred during generation."}
      </p>

      <p className="mt-1 text-[12px] text-muted-foreground/60">{getHint()}</p>

      <Button
        onClick={onRetry}
        variant="ghost"
        size="sm"
        className="mt-5 gap-2 rounded-lg text-muted-foreground hover:text-foreground"
        disabled={isRateLimit}
      >
        <RefreshCwIcon className="size-3.5" />
        Try again
      </Button>
    </motion.div>
  );
}
