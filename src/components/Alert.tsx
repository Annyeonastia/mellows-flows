import { FigmaIcon } from "./FigmaIcon";
import alertTriangle from "../assets/icons/icon-alert-triangle.svg";
import iconInfo20 from "../assets/icons/icon-info-20.svg";
import iconX16 from "../assets/icons/icon-x-16.svg";
import iconXInfo from "../assets/icons/icon-x-info.svg";
import "./Alert.css";

interface AlertProps {
  tone?: "danger" | "success" | "info";
  /** Pins the alert to the viewport instead of the surrounding surface. */
  toast?: boolean;
  children: React.ReactNode;
  onDismiss?: () => void;
}

/** Floating alert, pinned over the current surface (never a new page). */
export function Alert({ tone = "danger", toast = false, children, onDismiss }: AlertProps) {
  return (
    <div className={`alert alert--${tone} ${toast ? "alert--toast" : ""}`} role="alert">
      <span className="alert__icon-frame">
        {tone === "info" ? (
          <img className="alert__info-icon" src={iconInfo20} alt="" aria-hidden="true" />
        ) : (
          <FigmaIcon
            src={alertTriangle}
            size={20}
            inset={[12.07, 6.47, 12.5, 6.47]}
            expand={[4.97, 4.31]}
          />
        )}
      </span>

      <p className="alert__text t-b2-regular">{children}</p>

      {onDismiss && (
        <button type="button" className="alert__close" onClick={onDismiss} aria-label="Dismiss">
          <FigmaIcon
            src={tone === "info" ? iconXInfo : iconX16}
            size={16}
            inset={[25, 25, 25, 25]}
            expand={[9.38, 9.38]}
          />
        </button>
      )}
    </div>
  );
}
