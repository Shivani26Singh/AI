"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export function SectionNav({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!content) {
      setHeadings([]);
      return;
    }
    const matches = content.matchAll(/^## (.+)$/gm);
    const extracted = Array.from(matches).map((m) => {
      const text = m[1];
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return { text, id };
    });
    setHeadings(extracted);
  }, [content]);

  const handleScroll = useCallback(() => {
    if (!headings.length) return;

    const articleHeadings = document.querySelectorAll("h2[id], h2");
    for (let i = articleHeadings.length - 1; i >= 0; i--) {
      const el = articleHeadings[i];
      const rect = el.getBoundingClientRect();
      if (rect.top <= 120) {
        const id =
          el.id ||
          el.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        setActiveId(id);
        return;
      }
    }
    setActiveId(null);
  }, [headings]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (headings.length < 2) return null;

  return (
    <nav className="flex flex-col gap-0" aria-label="Page sections">
      <span className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
        On this page
      </span>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(h.id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              setActiveId(h.id);
            }
          }}
          className={cn(
            "rounded-md px-2 py-1 text-[12px] leading-snug transition-all duration-150 ease-enterprise",
            activeId === h.id
              ? "text-foreground/80 bg-accent/20 font-medium"
              : "text-muted-foreground/40 hover:text-muted-foreground/70 hover:bg-accent/10"
          )}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
