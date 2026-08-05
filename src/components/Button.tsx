import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

type Variant = "primary" | "secondary" | "danger" | "ghost-brand";
type Size = "xl" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  /** Rendered before the label at the size the design uses (24px for xl). */
  iconSrc?: string;
  loading?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "xl",
  fullWidth = false,
  iconSrc,
  loading = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : "",
    loading ? "is-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {iconSrc && <img className="btn__icon" src={iconSrc} alt="" aria-hidden="true" />}
      <span className="btn__label">{children}</span>
    </button>
  );
}
