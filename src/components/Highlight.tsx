import type { ReactNode } from "react";

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Marks the searched substring inside a cell value, the way the search state
 * in Figma shows matches.
 */
export function Highlight({ text, query }: { text: string; query: string }): ReactNode {
  const q = query.trim();
  if (!q) return text;

  const parts = text.split(new RegExp(`(${escapeRe(q)})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="hl">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
