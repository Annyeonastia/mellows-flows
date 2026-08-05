import { useEffect, useState } from "react";
import { useApp } from "../state/store";
import { NEW_REQUEST_MATCHES, type AiMatch } from "../state/types";
import { Checkbox } from "../components/Checkbox";
import { FigmaIcon } from "../components/FigmaIcon";
import iconLock from "../assets/icons/icon-lock-20.svg";
import iconSort from "../assets/icons/icon-sort-20.svg";
import chevronLeft from "../assets/icons/chevron-left.svg";
import "./RequestPage.css";

const TABS = ["AI matches", "Applied", "Shortlisted", "Offer received"] as const;

export function initials(name: string): string {
  return name
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * "New Request" / "Live Request" (28285:104450, 28300:193588 and the ON
 * variants): the created request and its AI matches. Private matching hides
 * everything that did not come from the user's own pool.
 */
export function RequestPage() {
  const { request, matches, requestDraft, requestPhase, openMatch, openEditRequest, goToContractors } =
    useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]>("AI matches");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelected = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  const isPrivate = requestDraft.privatePool;

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".rq__more-wrap")) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, [menuOpen]);

  // Private matching keeps only the people already in the user's Contractors,
  // so deleting someone from Contractors drops them out of a private request.
  const sourced = isPrivate ? matches.filter((m) => m.inTalents) : matches;
  // A freshly published request has only found its first matches; the rest are
  // there once it has been running.
  const ordered = sortAsc ? [...sourced].sort((a, b) => a.score - b.score) : sourced;
  const visible = requestPhase === "new" ? ordered.slice(0, NEW_REQUEST_MATCHES) : ordered;
  const hidden = matches.length - sourced.length;

  return (
    <div className="rq">
      <header className="rq__header">
        <button type="button" className="rq__back t-b2-regular" onClick={goToContractors}>
          <img src={chevronLeft} alt="" aria-hidden="true" />
          Back
        </button>
        <div className="rq__title-row">
          <h1 className="t-accent-h3">{request.title}</h1>
          <span className="rq__badge rq__badge--active t-b3-regular">Active</span>
          {isPrivate && <span className="rq__badge rq__badge--private t-b3-regular">Private</span>}
        </div>
      </header>

      <div className="rq__toolbar">
        {/* Drawn in every 613 frame, but the frames never show what it opens.
            Score is the only thing the list is ordered by, so it flips that. */}
        <button
          type="button"
          className={`rq__sort${sortAsc ? " is-active" : ""}`}
          aria-label="Sort by match"
          aria-pressed={sortAsc}
          onClick={() => setSortAsc((s) => !s)}
        >
          <FigmaIcon src={iconSort} size={20} inset={[20.83, 8.33, 20.83, 8.33]} expand={[6.43, 4.5]} />
        </button>

        <div className="rq__tabs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={`rq__tab t-b2-regular${t === tab ? " is-active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
              {t === "AI matches" && <span className="rq__count t-caption">{visible.length}</span>}
            </button>
          ))}
        </div>

        <div className="rq__more-wrap">
          <button
            type="button"
            className="rq__more"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Request actions"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>

          {menuOpen && (
            <div className="rq__menu row-menu" role="menu">
              <button
                type="button"
                role="menuitem"
                className="row-menu__item t-b2-regular"
                onClick={() => {
                  setMenuOpen(false);
                  openEditRequest();
                }}
              >
                Edit request
              </button>
            </div>
          )}
        </div>
      </div>

      {isPrivate && (
        <p className="rq__banner">
          <img src={iconLock} alt="" aria-hidden="true" />
          <span>
            <span className="t-b2-regular rq__banner-title">Private Matching Mode</span>
            <span className="t-b3-regular">
              Public link is deactivated. {hidden} matches external sources are hidden while private
              matching is on. They are not deleted and will reappear when you switch back.
            </span>
          </span>
        </p>
      )}

      {tab === "AI matches" ? (
        <>
          <div className="rq__list">
            {visible.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                onOpen={() => openMatch(m.id)}
                selected={selected.has(m.id)}
                onToggle={() => toggleSelected(m.id)}
              />
            ))}
          </div>
          <p className="rq__total t-b3-regular u-secondary">Total: {visible.length} matches</p>
        </>
      ) : (
        <p className="rq__empty t-b2-regular u-secondary">
          Nothing in {tab} yet — this prototype covers AI matches.
        </p>
      )}
    </div>
  );
}

function MatchCard({
  match,
  onOpen,
  selected,
  onToggle,
}: {
  match: AiMatch;
  onOpen: () => void;
  selected: boolean;
  onToggle: () => void;
}) {
  // "Не пишем From, рекомендации из Contractors подсвечиваем" — the canvas note
  // next to the 613 frames: people already in Contractors read "Contractors" in
  // the brand colour, everyone else names the platform they came from. The same
  // person shows "Contractors" on the Public frame and "Mellow" once they are
  // not in the pool, so this follows the flag rather than the source.
  const inPool = Boolean(match.inTalents);
  return (
    <div className="rq__card">
      {/* The row opens the sheet, but the checkbox has to stay outside that
          button — a control inside a button is not clickable. */}
      <button type="button" className="rq__card-hit" onClick={onOpen}>
      <span className={`rq__avatar${match.isNew ? " is-new" : ""}`}>
        {match.photo ? (
          <img className="rq__photo" src={match.photo} alt="" />
        ) : (
          initials(match.name)
        )}
      </span>
      <span className="rq__card-body">
        <span className="rq__card-top">
          <span className="t-b1-medium">{match.name}</span>
          <span className="rq__dot" />
          <span className={`t-b3-regular ${inPool ? "rq__source--pool" : "u-secondary"}`}>
            {inPool ? "Contractors" : match.source}
          </span>
        </span>
        <span className="rq__card-meta">
          <span className="rq__score t-b3-regular">{match.score}% match</span>
          <span className="t-b2-regular">{match.role}</span>
          <span className="rq__dot" />
          <span className="t-b2-regular">{match.experience}</span>
          <span className="rq__dot" />
          <span className={`t-b2-regular${match.rate ? "" : " u-secondary"}`}>
            {match.rate ?? "Contact for rate"}
          </span>
        </span>
      </span>
      {match.status !== "not-invited" && (
        <span className={`rq__status rq__status--${match.status} t-caption`}>
          {match.status === "invited" ? "Invited" : "Viewed"}
        </span>
      )}
      </button>

      {/* Checkbox Atom, drawn at the right edge of every row on the Public
          frame. What selecting a match does is not designed yet, so it only
          ticks. */}
      <Checkbox
        checked={selected}
        onChange={onToggle}
        label={`Select ${match.name}`}
        className="rq__check"
      />
    </div>
  );
}
