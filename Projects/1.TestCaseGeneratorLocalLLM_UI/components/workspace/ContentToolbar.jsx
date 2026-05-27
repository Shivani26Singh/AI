"use client";

import { motion } from "framer-motion";
import { FileTextIcon, CodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportDropdown } from "@/components/workspace/ExportDropdown";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ContentToolbar() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-12 z-40 border-b border-border bg-background/90 px-4 py-1.5 backdrop-blur-xl sm:px-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant={activeTab === "preview" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "gap-2 rounded-lg text-[12px] font-medium",
              activeTab === "preview"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileTextIcon className="size-3.5" />
            Preview
          </Button>
          <Button
            variant={activeTab === "raw" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("raw")}
            className={cn(
              "gap-2 rounded-lg text-[12px] font-medium",
              activeTab === "raw"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <CodeIcon className="size-3.5" />
            Raw
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <ExportDropdown />
        </div>
      </div>
    </motion.div>
  );
}
