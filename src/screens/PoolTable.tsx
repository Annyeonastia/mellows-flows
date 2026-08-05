import { useEffect, useMemo, useRef, useState } from "react";
import { FigmaIcon } from "../components/FigmaIcon";
import { Button } from "../components/Button";
import { Tooltip } from "../components/Tooltip";
import { RowActionsMenu, menuItemsFor, type MenuItem } from "../components/RowActionsMenu";
import { Highlight } from "../components/Highlight";
import { STATUS_LABEL, type Contractor } from "../state/types";
import { Checkbox } from "../components/Checkbox";
import { useApp } from "../state/store";
import { downloadCv } from "../lib/cv";
import { FilterPanel } from "./FilterPanel";
import {
  EMPTY_FILTERS,
  applyFilters,
  chipsFor,
  clearChip,
  countriesIn,
  isActive,
  rolesIn,
  summarize,
  type Filters,
} from "../state/filters";
import iconSearch from "../assets/icons/icon-search.svg";
import iconFilter from "../assets/icons/icon-filter.svg";
import chevronDown16 from "../assets/icons/chevron-down-16.svg";
import chevronLeft from "../assets/icons/chevron-left.svg";
import chevronRight from "../assets/icons/chevron-right.svg";
import iconX16 from "../assets/icons/icon-x-16.svg";
import iconXClear from "../assets/icons/icon-x-clear.svg";
import matchesYes from "../assets/icons/matches-yes.png";
import matchesNo from "../assets/icons/matches-no.png";
import rowActionsIcon from "../assets/icons/row-actions.png";
import "./PoolTable.css";

const COLUMNS = [
  { key: "check", label: "", width: 64 },
  { key: "contractor", label: "Contractor", width: 240 },
  { key: "country", label: "Working from", width: 200 },
  { key: "status", label: "Status", width: 160 },
  { key: "role", label: "Role", width: 200 },
  { key: "experience", label: "Experience", width: 120 },
  { key: "rate", label: "Rate", width: 120 },
  { key: "notes", label: "Notes", width: 200 },
  { key: "matches", label: "In matches", width: 120 },
  { key: "added", label: "Added", width: 160 },
  { key: "actions", label: "", width: 64 },
] as const;

const PAGE_SIZES = [10, 20, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 20;
const EMPTY = "–";

const parseDate = (dmy: string) => {
  const [d, m, y] = dmy.split(".").map(Number);
  return new Date(y, m - 1, d).getTime();
};

/**
 * "3 days ago" for the status tooltip. Measured against the newest row in the
 * pool rather than the wall clock, so the seeded dataset reads the way it does
 * in the design instead of "60 days ago".
 */
function relativeAdded(added: string, newest: number): string {
  const days = Math.round((newest - parseDate(added)) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

interface PoolTableProps {
  onCopyEmail: (email: string) => void;
}

export function PoolTable({ onCopyEmail }: PoolTableProps) {
  const { contractors, openDeleteContractor, openMissingInfo, openDeleteMany, openProfile, notify } =
    useApp();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rawSelected, setSelected] = useState<Set<string>>(new Set());
  const [scrolledX, setScrolledX] = useState(false);
  const [menu, setMenu] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [rowsOpen, setRowsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const roleOptions = useMemo(() => rolesIn(contractors), [contractors]);
  const countryOptions = useMemo(() => countriesIn(contractors), [contractors]);
  const chips = chipsFor(filters);
  const filtersActive = isActive(filters);

  const newest = useMemo(
    () => contractors.reduce((max, c) => Math.max(max, parseDate(c.added)), 0),
    [contractors],
  );

  // Rows-per-page popover closes on an outside click or Escape.
  useEffect(() => {
    if (!rowsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".pool__rows-wrap")) setRowsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRowsOpen(false);
    };
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [rowsOpen]);

  // Deleting rows must also drop them from the selection, or the "N Selected"
  // bar would keep counting contractors that no longer exist.
  const selected = useMemo(() => {
    const alive = new Set(contractors.map((c) => c.id));
    return new Set([...rawSelected].filter((id) => alive.has(id)));
  }, [rawSelected, contractors]);

  const handleMenuSelect = (contractorId: string, action: MenuItem["id"]) => {
    setMenu(null);
    if (action === "delete") openDeleteContractor(contractorId);
    else if (action === "add-missing-info") openMissingInfo(contractorId);
    else if (action === "view-profile") openProfile(contractorId);
    else if (action === "download-cv") {
      const target = contractors.find((c) => c.id === contractorId);
      if (target) notify(`${downloadCv(target)} downloaded`);
    }
  };

  // Search covers the four fields the design highlights — name, email, role and
  // notes. Country is filtered on, not searched.
  const filtered = useMemo(() => {
    const byFilters = applyFilters(contractors, filters);
    const q = query.trim().toLowerCase();
    if (!q) return byFilters;
    return byFilters.filter((c) =>
      [c.name, c.email, c.role, c.notes].filter(Boolean).some((v) => v!.toLowerCase().includes(q)),
    );
  }, [contractors, query, filters]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allOnPageSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const someOnPageSelected = !allOnPageSelected && rows.some((r) => selected.has(r.id));

  return (
    <div className="pool">
      <div className="pool__toolbar">
        <div className="pool__search-group">
          {/* A div, not a label: the clear button lives inside the field, and a
              button nested in a label is invalid. Clicking anywhere in the box
              still focuses the input. */}
          <div
            className={`pool__search ${query ? "has-value" : ""}`}
            onClick={() => searchRef.current?.focus()}
          >
            <FigmaIcon src={iconSearch} size={20} />
            <input
              ref={searchRef}
              className="t-b2-regular"
              placeholder="Search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              aria-label="Search contractors"
            />
            {query && (
              <button
                type="button"
                className="pool__search-clear"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
              >
                <img src={iconXClear} alt="" aria-hidden="true" />
              </button>
            )}
          </div>
          <Tooltip content={filtersActive ? summarize(filters) : ""}>
            <button
              type="button"
              className={`pool__filter ${filtersActive ? "is-active" : ""}`}
              aria-label="Filter"
              onClick={() => setFilterOpen(true)}
            >
              <FigmaIcon
                src={iconFilter}
                size={20}
                inset={[12.5, 8.33, 12.5, 8.33]}
                expand={[5, 4.5]}
              />
              {filtersActive && <span className="pool__filter-dot" aria-hidden="true" />}
            </button>
          </Tooltip>
        </div>

        <div className="pool__pagination">
          <p className="pool__count t-b3-regular">
            <span className="u-secondary">Showing</span>{" "}
            <span>
              {filtered.length === 0 ? 0 : start + 1}-{start + rows.length}
            </span>{" "}
            <span className="u-secondary">of</span> <span>{filtered.length}</span>
          </p>

          <div className="pool__rows-wrap">
            <button
              type="button"
              className={`pool__rows t-b3-regular ${rowsOpen ? "is-open" : ""}`}
              aria-haspopup="listbox"
              aria-expanded={rowsOpen}
              onClick={() => setRowsOpen((o) => !o)}
            >
              Rows {pageSize}
              <FigmaIcon
                src={chevronDown16}
                size={16}
                inset={[37.5, 25, 37.5, 25]}
                expand={[18.75, 9.38]}
              />
            </button>

            {rowsOpen && (
              <ul className="pool__rows-menu row-menu" role="listbox" aria-label="Rows per page">
                {PAGE_SIZES.map((n) => (
                  <li key={n} role="option" aria-selected={n === pageSize}>
                    <button
                      type="button"
                      className={`row-menu__item t-b2-regular ${n === pageSize ? "is-current" : ""}`}
                      onClick={() => {
                        setPageSize(n);
                        setPage(1);
                        setRowsOpen(false);
                      }}
                    >
                      {n}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pager">
            <button
              type="button"
              className="pager__item pager__item--arrow"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={current === 1}
              aria-label="Previous page"
            >
              <FigmaIcon
                src={chevronLeft}
                size={16}
                inset={[25, 37.5, 25, 37.5]}
                expand={[9.38, 18.75]}
              />
            </button>

            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={`pager__item ${n === current ? "is-active" : ""}`}
                onClick={() => setPage(n)}
                aria-current={n === current ? "page" : undefined}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              className="pager__item pager__item--arrow"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={current === pageCount}
              aria-label="Next page"
            >
              <FigmaIcon
                src={chevronRight}
                size={16}
                inset={[25, 37.5, 25, 37.5]}
                expand={[9.38, 18.75]}
              />
            </button>
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="filter-chips">
          {chips.map((chip) => (
            <span key={`${chip.key}-${chip.label}`} className="filter-chips__chip t-b3-regular">
              {chip.label}
              <button
                type="button"
                aria-label={`Remove filter ${chip.label}`}
                onClick={() => setFilters((f) => clearChip(f, chip.key))}
              >
                <FigmaIcon src={iconX16} size={16} inset={[25, 25, 25, 25]} expand={[9.38, 9.38]} />
              </button>
            </span>
          ))}
          <button
            type="button"
            className="filter-chips__reset t-b3-regular"
            onClick={() => setFilters(EMPTY_FILTERS)}
          >
            Clear all
          </button>
        </div>
      )}

      {selected.size > 0 && (
        <div className="mass-actions">
          <button
            type="button"
            className="mass-actions__clear"
            onClick={() => setSelected(new Set())}
            aria-label="Clear selection"
          >
            <FigmaIcon src={iconX16} size={16} inset={[25, 25, 25, 25]} expand={[9.38, 9.38]} />
          </button>
          <p className="t-b2-regular">{selected.size} Selected</p>
          <Button
            size="md"
            variant="danger"
            className="mass-actions__delete"
            onClick={() => openDeleteMany([...selected])}
          >
            Delete contractors
          </Button>
        </div>
      )}

      <div
        className={`pool__scroll ${scrolledX ? "is-scrolled-x" : ""} ${
          selected.size > 0 ? "has-mass-actions" : ""
        }`}
        ref={scrollRef}
        onScroll={(e) => setScrolledX(e.currentTarget.scrollLeft > 0)}
      >
        <table className="ptable">
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>

          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.key} className={`ptable__th ptable__col--${c.key}`}>
                  {c.key === "check" ? (
                    <Checkbox
                      checked={allOnPageSelected}
                      indeterminate={someOnPageSelected}
                      onChange={() =>
                        setSelected(
                          allOnPageSelected ? new Set() : new Set(rows.map((r) => r.id)),
                        )
                      }
                      label="Select all on page"
                    />
                  ) : (
                    <span className="t-b3-regular">{c.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((c) => (
              <Row
                key={c.id}
                contractor={c}
                selected={selected.has(c.id)}
                newest={newest}
                query={query}
                menuOpen={menu?.id === c.id}
                onToggle={() => toggle(c.id)}
                onCopyEmail={onCopyEmail}
                onToggleMenu={(rect) =>
                  setMenu((prev) => (prev?.id === c.id ? null : { id: c.id, rect }))
                }
              />
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <p className="pool__no-results t-b2-regular u-secondary">
            No contractors match “{query}”
          </p>
        )}
      </div>

      {menu &&
        (() => {
          const target = contractors.find((c) => c.id === menu.id);
          if (!target) return null;
          return (
            <RowActionsMenu
              anchor={menu.rect}
              items={menuItemsFor(target)}
              onSelect={(action) => handleMenuSelect(menu.id, action)}
              onClose={() => setMenu(null)}
            />
          );
        })()}

      {filterOpen && (
        <FilterPanel
          value={filters}
          roles={roleOptions}
          countries={countryOptions}
          onApply={(next) => {
            setFilters(next);
            setPage(1);
            setFilterOpen(false);
          }}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </div>
  );
}

function Row({
  contractor: c,
  selected,
  newest,
  query,
  menuOpen,
  onToggle,
  onCopyEmail,
  onToggleMenu,
}: {
  contractor: Contractor;
  selected: boolean;
  newest: number;
  /** Current search term — the four searchable cells mark their matches. */
  query: string;
  menuOpen: boolean;
  onToggle: () => void;
  onCopyEmail: (email: string) => void;
  onToggleMenu: (rect: DOMRect) => void;
}) {
  return (
    <tr className={`ptable__row ${selected ? "is-selected" : ""}`}>
      <td className="ptable__td ptable__col--check">
        <Checkbox checked={selected} onChange={onToggle} label={`Select ${c.name || c.email}`} />
      </td>

      <td className="ptable__td ptable__col--contractor">
        <span className="cell-contractor">
          <span className="cell-contractor__name t-b2-regular">
            {c.name ? <Highlight text={c.name} query={query} /> : "Contractor"}
          </span>
          {c.email && (
            <button
              type="button"
              className="cell-contractor__email t-b3-regular"
              onClick={() => onCopyEmail(c.email!)}
              title="Click to copy"
            >
              <Highlight text={c.email} query={query} />
            </button>
          )}
        </span>
      </td>

      <td className="ptable__td">
        {c.location ? (
          <span className="cell-country t-b2-regular">
            <span className="cell-country__flag">{c.flag}</span>
            {c.location}
          </span>
        ) : (
          <span className="u-secondary">{EMPTY}</span>
        )}
      </td>

      <td className="ptable__td">
        <Tooltip content={relativeAdded(c.added, newest)}>
          <span className={`badge badge--${c.status}`}>{STATUS_LABEL[c.status]}</span>
        </Tooltip>
      </td>

      <td className="ptable__td ptable__td--clip t-b2-regular">
        {c.role ? <Highlight text={c.role} query={query} /> : EMPTY}
      </td>
      <td className="ptable__td t-b2-regular">{c.seniority ?? EMPTY}</td>
      <td className="ptable__td t-b2-regular">{c.rate ?? EMPTY}</td>

      <td className="ptable__td ptable__td--clip t-b2-regular">
        {c.notes ? (
          <Tooltip content={c.notes}>
            <span className="cell-notes">
              <Highlight text={c.notes} query={query} />
            </span>
          </Tooltip>
        ) : (
          EMPTY
        )}
      </td>

      <td className="ptable__td">
        <img
          className="matches"
          src={c.inMatches ? matchesYes : matchesNo}
          alt={c.inMatches ? "In matches" : "Not in matches"}
        />
      </td>

      <td className="ptable__td">
        <span className="cell-added">
          <span className="t-b2-regular">{c.added}</span>
          <span className="t-b3-regular u-secondary">{c.source}</span>
        </span>
      </td>

      <td className="ptable__td ptable__col--actions">
        <button
          type="button"
          className={`row-actions ${menuOpen ? "is-open" : ""}`}
          aria-label="Row actions"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={(e) => onToggleMenu(e.currentTarget.getBoundingClientRect())}
        >
          <img src={rowActionsIcon} alt="" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}

