"use client";

import { useState } from "react";
import {
  ClockIcon,
  LayoutTemplateIcon,
  SettingsIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { SettingsDialog } from "@/components/SettingsDialog";
import { cn } from "@/lib/utils";

function NavItem({ icon: Icon, label, active, onClick, badge, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium transition-all duration-150 ease-enterprise",
        active
          ? "bg-sidebar-accent text-sidebar-foreground"
          : "text-sidebar-foreground/55 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground/85",
        disabled && "cursor-default opacity-40 hover:bg-transparent hover:text-sidebar-foreground/55"
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-sidebar-accent px-1 text-[9px] font-semibold tabular-nums text-sidebar-foreground/60">
          {badge}
        </span>
      )}
      {!disabled && !active && (
        <ChevronRightIcon className="size-3 text-sidebar-foreground/20" />
      )}
    </button>
  );
}

export function SidebarNav() {
  const [activeSection, setActiveSection] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const recentGenerations = useAppStore((s) => s.recentGenerations);
  const files = useAppStore((s) => s.files);

  const historyItems = recentGenerations.slice(0, 8);

  return (
    <div className="flex flex-col gap-0.5">
      {files.length > 0 && (
        <div className="mb-1">
          <NavItem
            icon={ClockIcon}
            label="Documents"
            active={activeSection === "documents"}
            onClick={() => setActiveSection(activeSection === "documents" ? null : "documents")}
            badge={files.length}
          />
        </div>
      )}

      <div className="mb-1">
        <NavItem
          icon={ClockIcon}
          label="History"
          active={activeSection === "history"}
          onClick={() => setActiveSection(activeSection === "history" ? null : "history")}
          badge={historyItems.length > 0 ? historyItems.length : undefined}
        />
        {activeSection === "history" && (
          <div className="ml-5 mt-0.5 space-y-0.5 animate-fade-slide-down">
            {historyItems.length === 0 ? (
              <p className="px-2.5 py-2 text-[11px] text-sidebar-foreground/40">
                No recent generations yet
              </p>
            ) : (
              historyItems.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-lg px-2.5 py-1.5 transition-colors hover:bg-sidebar-accent/50"
                >
                  <span className="truncate text-[11px] font-medium text-sidebar-foreground/80">
                    {item.snippet || "Test Plan"}
                  </span>
                  <span className="mt-0.5 text-[10px] text-sidebar-foreground/45">
                    {new Date(item.timestamp).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    · {item.wordCount?.toLocaleString() || "?"} words
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="mb-1">
        <NavItem
          icon={LayoutTemplateIcon}
          label="Templates"
          active={activeSection === "templates"}
          onClick={() => setActiveSection(activeSection === "templates" ? null : "templates")}
          disabled
        />
        {activeSection === "templates" && (
          <p className="ml-5 px-2.5 py-2 text-[11px] text-sidebar-foreground/40">
            Coming soon
          </p>
        )}
      </div>

      <div className="mb-1">
        <NavItem
          icon={SettingsIcon}
          label="Settings"
          active={false}
          onClick={() => setSettingsOpen(true)}
        />
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </div>
  );
}
