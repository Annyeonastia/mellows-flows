import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Contractor } from "../state/types";
import "./RowActionsMenu.css";

export interface MenuItem {
  id: "add-missing-info" | "view-profile" | "download-cv" | "delete";
  label: string;
  danger?: boolean;
}

/**
 * Menu contents follow the contractor's status and whether a CV is on file,
 * matching the five "Actions by Status" frames.
 */
export function menuItemsFor(c: Contractor): MenuItem[] {
  const items: MenuItem[] = [
    c.status === "missing-info"
      ? { id: "add-missing-info", label: "Add missing info" }
      : { id: "view-profile", label: "View profile" },
  ];
  if (c.hasCv) items.push({ id: "download-cv", label: "Download CV" });
  items.push({ id: "delete", label: "Delete contractor", danger: true });
  return items;
}

interface RowActionsMenuProps {
  /** Bounding box of the ⋮ button the menu belongs to. */
  anchor: DOMRect;
  items: MenuItem[];
  onSelect: (id: MenuItem["id"]) => void;
  onClose: () => void;
}

const GAP = 4;

/**
 * Rendered in a portal with fixed positioning: the table is a scroll container,
 * so a menu positioned inside it would be clipped at the edges.
 */
export function RowActionsMenu({ anchor, items, onSelect, onClose }: RowActionsMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: anchor.bottom + GAP, left: anchor.left });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();

    // Opens down-left from the button, flipping up near the viewport bottom.
    let top = anchor.bottom + GAP;
    if (top + height > window.innerHeight - 8) top = anchor.top - height - GAP;

    let left = anchor.left - width + anchor.width;
    if (left < 8) left = 8;

    setPos({ top, left });
  }, [anchor]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    // Any scroll would detach the menu from its row, so close instead.
    const onScroll = () => onClose();

    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [onClose]);

  return createPortal(
    <div className="row-menu" ref={ref} role="menu" style={{ top: pos.top, left: pos.left }}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          className={`row-menu__item t-b2-regular ${item.danger ? "is-danger" : ""}`}
          onClick={() => onSelect(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>,
    document.body,
  );
}
