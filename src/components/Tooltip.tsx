import { useState, type ReactNode } from "react";
import "./Tooltip.css";

interface TooltipProps {
  /** Tooltip body. Nothing renders when this is empty. */
  content: ReactNode;
  children: ReactNode;
}

/** Dark tooltip above the trigger, shown on hover and focus, hidden on leave. */
export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = useState(false);

  if (!content) return <>{children}</>;

  return (
    <span
      className="tip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span className="tip__bubble t-b3-regular" role="tooltip">
          {content}
        </span>
      )}
    </span>
  );
}
