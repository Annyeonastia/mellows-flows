import { useEffect, type ReactNode } from "react";
import { FigmaIcon } from "./FigmaIcon";
import { Intercom } from "./Intercom";
import iconClose from "../assets/icons/icon-close.svg";
import "./FullScreenModal.css";

interface FullScreenModalProps {
  title: string;
  onClose: () => void;
  /** Rendered top-right over the whole surface, e.g. the validation alert. */
  alert?: ReactNode;
  children: ReactNode;
}

/**
 * "Full Screen Modal Header" from Figma: a takeover surface that replaces the
 * page rather than floating over it. Closing returns to the entry point.
 */
export function FullScreenModal({ title, onClose, alert, children }: FullScreenModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fsm" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fsm__header">
        <p className="fsm__title t-accent-h5">{title}</p>
        <button type="button" className="fsm__close" onClick={onClose} aria-label="Close">
          <FigmaIcon src={iconClose} size={24} inset={[25, 25, 25, 25]} expand={[7.5, 7.5]} />
        </button>
      </div>

      <div className="fsm__body">{children}</div>

      {alert}
      <Intercom />
    </div>
  );
}
