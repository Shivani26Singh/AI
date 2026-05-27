"use client";

import { FileTextIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandLogo({ className, iconOnly = false, size = "default" }) {
  const sizes = {
    sm: { icon: "size-3", wrapper: "size-6 rounded-md", text: "text-[11px]" },
    default: { icon: "size-3.5", wrapper: "size-7 rounded-lg", text: "text-[13px]" },
    lg: { icon: "size-4", wrapper: "size-8 rounded-lg", text: "text-sm" },
  };

  const s = sizes[size] || sizes.default;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-[#5B5BFF] to-[#7B5BFF] text-white ring-1 ring-inset ring-white/10 shadow-sm shrink-0",
          s.wrapper
        )}
      >
        <FileTextIcon className={s.icon} aria-hidden="true" />
      </div>
      {!iconOnly && (
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground/90",
            s.text
          )}
        >
          TestPlan AI
        </span>
      )}
    </div>
  );
}
