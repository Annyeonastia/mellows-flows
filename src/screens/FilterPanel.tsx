import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { FigmaIcon } from "../components/FigmaIcon";
import { MultiSelect } from "../components/MultiSelect";
import {
  EMPTY_FILTERS,
  STATUS_ORDER,
  type Filters,
  type Visibility,
} from "../state/filters";
import { STATUS_LABEL } from "../state/types";
import iconFilter from "../assets/icons/icon-filter.svg";
import iconClose from "../assets/icons/icon-close.svg";
import "./FilterPanel.css";

interface FilterPanelProps {
  value: Filters;
  roles: string[];
  countries: string[];
  onApply: (next: Filters) => void;
  onClose: () => void;
}

/** Right-hand panel over the table. Edits are local until Apply is pressed. */
export function FilterPanel({ value, roles, countries, onApply, onClose }: FilterPanelProps) {
  const [draft, setDraft] = useState<Filters>(value);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const patch = (p: Partial<Filters>) => setDraft((d) => ({ ...d, ...p }));

  const toggleStatus = (s: (typeof STATUS_ORDER)[number]) =>
    patch({
      statuses: draft.statuses.includes(s)
        ? draft.statuses.filter((x) => x !== s)
        : [...draft.statuses, s],
    });

  const setVisibility = (v: Visibility) =>
    patch({ visibility: draft.visibility === v ? null : v });

  return (
    <div
      className="filter-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Filter your contractors"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside className="filter">
        <header className="filter__head">
          <span className="filter__badge">
            <FigmaIcon
              src={iconFilter}
              size={20}
              inset={[12.5, 8.33, 12.5, 8.33]}
              expand={[5, 4.5]}
            />
          </span>
          <h2 className="t-accent-h5">Filter Your Contractors</h2>
          <button type="button" className="filter__close" onClick={onClose} aria-label="Close">
            <FigmaIcon src={iconClose} size={24} inset={[25, 25, 25, 25]} expand={[7.5, 7.5]} />
          </button>
        </header>

        <div className="filter__body">
          <Group label="Status">
            <div className="filter__pills">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`pill ${draft.statuses.includes(s) ? "is-on" : ""}`}
                  onClick={() => toggleStatus(s)}
                  aria-pressed={draft.statuses.includes(s)}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </Group>

          <Group label="AI match visibility">
            <div className="filter__pills">
              {(["visible", "hidden"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`pill ${draft.visibility === v ? "is-on" : ""}`}
                  onClick={() => setVisibility(v)}
                  aria-pressed={draft.visibility === v}
                >
                  {v === "visible" ? "Visible" : "Hidden"}
                </button>
              ))}
            </div>
          </Group>

          <Group
            label="Role"
            onClear={draft.roles.length ? () => patch({ roles: [] }) : undefined}
          >
            <MultiSelect
              options={roles}
              value={draft.roles}
              onChange={(next) => patch({ roles: next })}
              placeholder="Select roles"
            />
          </Group>

          <Group
            label="Years of experience"
            onClear={
              draft.expMin || draft.expMax ? () => patch({ expMin: "", expMax: "" }) : undefined
            }
          >
            <Range
              from={draft.expMin}
              to={draft.expMax}
              onFrom={(v) => patch({ expMin: v })}
              onTo={(v) => patch({ expMax: v })}
            />
          </Group>

          <Group
            label="Rate in USD"
            onClear={
              draft.rateMin || draft.rateMax
                ? () => patch({ rateMin: "", rateMax: "" })
                : undefined
            }
          >
            <Range
              from={draft.rateMin}
              to={draft.rateMax}
              onFrom={(v) => patch({ rateMin: v })}
              onTo={(v) => patch({ rateMax: v })}
            />
          </Group>

          <Group
            label="Country"
            onClear={draft.countries.length ? () => patch({ countries: [] }) : undefined}
          >
            <MultiSelect
              options={countries}
              value={draft.countries}
              onChange={(next) => patch({ countries: next })}
              placeholder="Select countries"
            />
          </Group>
        </div>

        <footer className="filter__foot">
          <Button variant="secondary" fullWidth onClick={() => setDraft(EMPTY_FILTERS)}>
            Reset
          </Button>
          <Button fullWidth onClick={() => onApply(draft)}>
            Apply
          </Button>
        </footer>
      </aside>
    </div>
  );
}

function Group({
  label,
  onClear,
  children,
}: {
  label: string;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="filter__group">
      <div className="filter__group-head">
        <p className="t-b3-regular u-secondary">{label}</p>
        {onClear && (
          <button type="button" className="filter__clear t-b3-regular" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function Range({
  from,
  to,
  onFrom,
  onTo,
}: {
  from: string;
  to: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
}) {
  return (
    <div className="filter__range">
      <input
        className="filter__input t-b2-regular"
        inputMode="decimal"
        value={from}
        onChange={(e) => onFrom(e.target.value.replace(/[^\d.]/g, ""))}
        aria-label="From"
      />
      <span className="filter__dash" aria-hidden="true">
        —
      </span>
      <input
        className="filter__input t-b2-regular"
        inputMode="decimal"
        value={to}
        onChange={(e) => onTo(e.target.value.replace(/[^\d.]/g, ""))}
        aria-label="To"
      />
    </div>
  );
}
