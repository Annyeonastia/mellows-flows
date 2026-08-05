import { STATUS_LABEL, type Contractor, type ContractorStatus } from "./types";

export type Visibility = "visible" | "hidden" | null;

export interface Filters {
  statuses: ContractorStatus[];
  visibility: Visibility;
  roles: string[];
  expMin: string;
  expMax: string;
  rateMin: string;
  rateMax: string;
  countries: string[];
}

export const EMPTY_FILTERS: Filters = {
  statuses: [],
  visibility: null,
  roles: [],
  expMin: "",
  expMax: "",
  rateMin: "",
  rateMax: "",
  countries: [],
};

export const STATUS_ORDER: ContractorStatus[] = [
  "missing-info",
  "invitation-sent",
  "invitation-viewed",
  "scored",
];

/** "5.5 years" -> 5.5 */
const years = (v: string | null) => (v ? Number.parseFloat(v) : null);
/** "$90" -> 90 */
const usd = (v: string | null) => (v ? Number.parseFloat(v.replace(/[^\d.]/g, "")) : null);

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

/** Distinct roles present in the pool, alphabetical — feeds the Role select. */
export function rolesIn(contractors: Contractor[]): string[] {
  return [...new Set(contractors.map((c) => c.role).filter(Boolean) as string[])].sort();
}

export function countriesIn(contractors: Contractor[]): string[] {
  return [...new Set(contractors.map((c) => c.location).filter(Boolean) as string[])].sort();
}

export function isActive(f: Filters): boolean {
  return (
    f.statuses.length > 0 ||
    f.visibility !== null ||
    f.roles.length > 0 ||
    f.countries.length > 0 ||
    Boolean(f.expMin || f.expMax || f.rateMin || f.rateMax)
  );
}

export function applyFilters(contractors: Contractor[], f: Filters): Contractor[] {
  const expMin = num(f.expMin);
  const expMax = num(f.expMax);
  const rateMin = num(f.rateMin);
  const rateMax = num(f.rateMax);

  return contractors.filter((c) => {
    if (f.statuses.length && !f.statuses.includes(c.status)) return false;
    if (f.visibility === "visible" && !c.inMatches) return false;
    if (f.visibility === "hidden" && c.inMatches) return false;
    if (f.roles.length && !(c.role && f.roles.includes(c.role))) return false;
    if (f.countries.length && !(c.location && f.countries.includes(c.location))) return false;

    // A contractor with no value on a bounded field cannot satisfy the bound.
    if (expMin !== null || expMax !== null) {
      const y = years(c.seniority);
      if (y === null) return false;
      if (expMin !== null && y < expMin) return false;
      if (expMax !== null && y > expMax) return false;
    }
    if (rateMin !== null || rateMax !== null) {
      const r = usd(c.rate);
      if (r === null) return false;
      if (rateMin !== null && r < rateMin) return false;
      if (rateMax !== null && r > rateMax) return false;
    }
    return true;
  });
}

export interface FilterChip {
  key: keyof Filters;
  label: string;
}

/**
 * Chips shown above the table. A single selected role or country is spelled
 * out; several collapse to a count, per the design.
 */
export function chipsFor(f: Filters): FilterChip[] {
  const chips: FilterChip[] = [];

  if (f.statuses.length === 1) {
    chips.push({ key: "statuses", label: STATUS_LABEL[f.statuses[0]] });
  } else if (f.statuses.length > 1) {
    chips.push({ key: "statuses", label: `${f.statuses.length} statuses` });
  }

  if (f.visibility) {
    chips.push({ key: "visibility", label: f.visibility === "visible" ? "Visible" : "Hidden" });
  }

  if (f.roles.length === 1) chips.push({ key: "roles", label: f.roles[0] });
  else if (f.roles.length > 1) chips.push({ key: "roles", label: `${f.roles.length} roles` });

  if (f.expMin || f.expMax) {
    chips.push({ key: "expMin", label: `${f.expMin || "0"}–${f.expMax || "∞"} years` });
  }
  if (f.rateMin || f.rateMax) {
    chips.push({ key: "rateMin", label: `$${f.rateMin || "0"}–${f.rateMax || "∞"}` });
  }

  if (f.countries.length === 1) chips.push({ key: "countries", label: f.countries[0] });
  else if (f.countries.length > 1) {
    chips.push({ key: "countries", label: `${f.countries.length} countries` });
  }

  return chips;
}

/** Clears whichever group a chip stands for. */
export function clearChip(f: Filters, key: keyof Filters): Filters {
  switch (key) {
    case "statuses":
      return { ...f, statuses: [] };
    case "visibility":
      return { ...f, visibility: null };
    case "roles":
      return { ...f, roles: [] };
    case "expMin":
      return { ...f, expMin: "", expMax: "" };
    case "rateMin":
      return { ...f, rateMin: "", rateMax: "" };
    case "countries":
      return { ...f, countries: [] };
    default:
      return f;
  }
}

/** Plain-text summary used by the active-filter tooltip. */
export function summarize(f: Filters): string {
  return chipsFor(f)
    .map((c) => c.label)
    .join(" · ");
}
