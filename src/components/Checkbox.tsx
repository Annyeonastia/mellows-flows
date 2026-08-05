import "./Checkbox.css";

/** The design system's Checkbox Atom. Used by the pool table and by the match
    cards on the request page, so it lives here rather than in either screen. */
export function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  label,
  className = "",
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
  className?: string;
}) {
  // `indeterminate` is a DOM property, not an attribute — it has to be set here.
  const setRef = (el: HTMLInputElement | null) => {
    if (el) el.indeterminate = indeterminate && !checked;
  };

  return (
    <label className={`checkbox ${className}`.trim()}>
      <input ref={setRef} type="checkbox" checked={checked} onChange={onChange} aria-label={label} />
      <span className="checkbox__box" />
    </label>
  );
}
