import "./FigmaIcon.css";

/**
 * Renders an exported Figma SVG at the exact position Figma gives it.
 *
 * Figma nests an icon as: [box] > [vector frame at `inset`] > [img at negative
 * `expand`]. Flattening that by hand is error-prone, so the two percentage
 * pairs from the design context are passed through and composed here.
 *
 * `inset`  — [top, right, bottom, left] of the vector frame, in % of the box.
 * `expand` — [vertical, horizontal] stroke bleed, in % of the vector frame.
 */
interface FigmaIconProps {
  src: string;
  /** Square box size in px. */
  size: number;
  inset?: [number, number, number, number];
  expand?: [number, number];
  className?: string;
  alt?: string;
}

export function FigmaIcon({
  src,
  size,
  inset = [12.5, 12.5, 12.5, 12.5],
  expand = [5, 5],
  className = "",
  alt = "",
}: FigmaIconProps) {
  const [t, r, b, l] = inset;
  const [ey, ex] = expand;

  // Vector-frame size as a share of the outer box.
  const vw = 100 - r - l;
  const vh = 100 - t - b;

  // Bleed the image out by `expand` % of the vector frame, then re-express
  // everything relative to the outer box so one absolute img is enough.
  const width = vw * (1 + (2 * ex) / 100);
  const height = vh * (1 + (2 * ey) / 100);
  const left = l - (vw * ex) / 100;
  const top = t - (vh * ey) / 100;

  return (
    <span
      className={`fig-icon ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden={alt === "" || undefined}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: `${width}%`,
          height: `${height}%`,
          left: `${left}%`,
          top: `${top}%`,
        }}
      />
    </span>
  );
}
