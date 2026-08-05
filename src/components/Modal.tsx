import { useEffect, type ReactNode } from "react";
import { FigmaIcon } from "./FigmaIcon";
import iconClose20 from "../assets/icons/icon-close-20.svg";
import "./Modal.css";

interface ModalProps {
  onClose: () => void;
  label: string;
  width?: number;
  /** Form modals align their content left; confirmation modals centre it. */
  align?: "center" | "start";
  children: ReactNode;
}

/** Centred card over a dimmed page — the page underneath stays mounted. */
export function Modal({
  onClose,
  label,
  width = 392,
  align = "center",
  children,
}: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal modal--${align}`} style={{ width }}>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
          <FigmaIcon src={iconClose20} size={20} inset={[25, 25, 25, 25]} expand={[10.61, 10.61]} />
        </button>
        {children}
      </div>
    </div>
  );
}
