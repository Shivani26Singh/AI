import { SparklesIcon } from "lucide-react";

export function EmptyState({ icon: Icon = SparklesIcon, title, description }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="relative">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-b from-muted/60 to-muted/20 ring-1 ring-border/30 shadow-sm">
          <Icon className="size-7 text-muted-foreground/50" />
        </div>
        <div className="absolute -right-1.5 -top-1.5 flex size-7 items-center justify-center rounded-full border-2 border-background bg-card shadow-sm">
          <SparklesIcon className="size-3.5 text-primary/40" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold tracking-tight">
          {title || "Nothing here yet"}
        </p>
        {description && (
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground/80">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
