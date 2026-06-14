import { useEffect } from "react";
import { useJobStore } from "../store/useJobStore";

export function useKeyboardShortcuts({ onOpenAdd }) {
  const setQuery = useJobStore((s) => s.setQuery);
  const setActiveTab = useJobStore((s) => s.setActiveTab);
  const activeTab = useJobStore((s) => s.activeTab);
  const undoDelete = useJobStore((s) => s.undoDelete);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;

      if (e.key === "n" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onOpenAdd();
      }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.querySelector('[placeholder*="Search"]')?.focus();
      }
      if ((e.key === "d" || e.key === "D") && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveTab(activeTab === "dashboard" ? "kanban" : "dashboard");
      }
      if ((e.key === "t" || e.key === "T") && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.querySelector('[aria-label*="mode"]')?.click();
      }
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        undoDelete();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenAdd, setQuery, setActiveTab, activeTab, undoDelete]);
}
