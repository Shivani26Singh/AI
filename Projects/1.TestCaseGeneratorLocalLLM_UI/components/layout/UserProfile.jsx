"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function UserProfile({ className }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors",
        className
      )}
    >
      <Avatar className="size-7 ring-1 ring-border">
        <AvatarFallback className="bg-sidebar-accent text-[10px] font-semibold tracking-wide text-sidebar-foreground/60">
          GU
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="truncate text-[12px] font-medium leading-tight text-sidebar-foreground/80">
          Guest User
        </span>
        <span className="text-[10px] leading-tight text-sidebar-foreground/40">
          Personal workspace
        </span>
      </div>
    </div>
  );
}
