import { useEffect, useRef, useState } from "react";
import { FigmaIcon } from "./FigmaIcon";
import iconSearch from "../assets/icons/icon-search.svg";
import iconX16 from "../assets/icons/icon-x-16.svg";
import chevronDown16 from "../assets/icons/chevron-down-16.svg";
import "./MultiSelect.css";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  /** How many chips fit before the rest collapse into "+N". */
  visibleChips?: number;
}

/**
 * Select field that keeps its picks as chips and opens a searchable checkbox
 * list — the Role / Country controls in the filter panel.
 */
export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  visibleChips = 2,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shown = options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()));
  const allShownSelected = shown.length > 0 && shown.every((o) => value.includes(o));
  const someShownSelected = !allShownSelected && shown.some((o) => value.includes(o));

  const toggle = (option: string) =>
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);

  const chips = value.slice(0, visibleChips);
  const overflow = value.length - chips.length;

  return (
    <div className={`msel ${open ? "is-open" : ""}`} ref={ref}>
      <button
        type="button"
        className="msel__field"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value.length === 0 ? (
          <span className="msel__placeholder t-b2-regular">{placeholder}</span>
        ) : (
          <span className="msel__chips">
            {chips.map((chip) => (
              <span key={chip} className="msel__chip t-b3-regular">
                <span className="msel__chip-label">{chip}</span>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${chip}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(chip);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      toggle(chip);
                    }
                  }}
                >
                  <FigmaIcon src={iconX16} size={16} inset={[25, 25, 25, 25]} expand={[9.38, 9.38]} />
                </span>
              </span>
            ))}
            {overflow > 0 && <span className="msel__chip msel__chip--more t-b3-regular">+{overflow}</span>}
          </span>
        )}

        <span className="msel__chevron">
          <FigmaIcon src={chevronDown16} size={16} inset={[37.5, 25, 37.5, 25]} expand={[18.75, 9.38]} />
        </span>
      </button>

      {open && (
        <div className="msel__menu" role="listbox">
          <label className="msel__search">
            <FigmaIcon src={iconSearch} size={20} />
            <input
              className="t-b2-regular"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </label>

          <div className="msel__list">
            <Option
              label="Select All"
              checked={allShownSelected}
              indeterminate={someShownSelected}
              onToggle={() => {
                if (allShownSelected) onChange(value.filter((v) => !shown.includes(v)));
                else onChange([...new Set([...value, ...shown])]);
              }}
            />
            {shown.map((option) => (
              <Option
                key={option}
                label={option}
                checked={value.includes(option)}
                onToggle={() => toggle(option)}
              />
            ))}
            {shown.length === 0 && <p className="msel__empty t-b3-regular u-secondary">Nothing found</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function Option({
  label,
  checked,
  indeterminate = false,
  onToggle,
}: {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onToggle: () => void;
}) {
  const setRef = (el: HTMLInputElement | null) => {
    if (el) el.indeterminate = indeterminate && !checked;
  };

  return (
    <label className="msel__option">
      <span className="checkbox">
        <input ref={setRef} type="checkbox" checked={checked} onChange={onToggle} />
        <span className="checkbox__box" />
      </span>
      <span className="t-b2-regular">{label}</span>
    </label>
  );
}
