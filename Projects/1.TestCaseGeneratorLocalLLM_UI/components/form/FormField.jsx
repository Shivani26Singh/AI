"use client";

import { cn } from "@/lib/utils";

export function FormField({ label, icon: Icon, error, hint, children, className }) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-1">
        {label && (
          <label className="flex items-center gap-1.5 text-xs font-medium">
            {Icon && <Icon className="size-3.5 text-muted-foreground" />}
            {label}
          </label>
        )}
        {children}
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      {!error && hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

export function FormInput({ error, className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        error
          ? "border-destructive ring-3 ring-destructive/20"
          : "border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  );
}

export function FormTextarea({ error, className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] resize-y",
        error
          ? "border-destructive ring-3 ring-destructive/20"
          : "border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  );
}
