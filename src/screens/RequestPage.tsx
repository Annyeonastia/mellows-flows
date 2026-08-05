import { useState } from "react";
import { useApp } from "../state/store";
import type { AiMatch } from "../state/types";
import iconLock from "../assets/icons/icon-lock-20.svg";
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
  const { request, matches, requestDraft, openMatch, goToContractors } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]>("AI matches");
  const isPrivate = requestDraft.privatePool;

  const visible = isPrivate ? matches.filter((m) => m.source === "My Pool") : matches;
  const hidden = matches.length - visible.length;

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
              <MatchCard key={m.id} match={m} onOpen={() => openMatch(m.id)} />
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

function MatchCard({ match, onOpen }: { match: AiMatch; onOpen: () => void }) {
  const inPool = match.source === "My Pool";
  return (
    <button type="button" className="rq__card" onClick={onOpen}>
      <span className={`rq__avatar${match.isNew ? " is-new" : ""}`}>{initials(match.name)}</span>
      <span className="rq__card-body">
        <span className="rq__card-top">
          <span className="t-b1-medium">{match.name}</span>
          <span className="rq__dot" />
          <span className="t-b3-regular u-secondary">{match.source}</span>
          {inPool && <span className="rq__in-talents t-caption">In Talents</span>}
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
  );
}
