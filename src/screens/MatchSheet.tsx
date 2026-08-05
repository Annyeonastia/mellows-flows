import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { FigmaIcon } from "../components/FigmaIcon";
import { initials } from "./RequestPage";
import { useApp } from "../state/store";
import type { MatchChip } from "../state/types";
import iconClose from "../assets/icons/icon-close-20.svg";
import iconPlay from "../assets/icons/icon-play-16.svg";
import iconArrowUpRight from "../assets/icons/icon-arrow-up-right-16.svg";
import iconMore from "../assets/icons/icon-more-20.svg";
import iconStar from "../assets/icons/icon-star-14.png";
import flagGe from "../assets/icons/flag-ge.png";
import cvPage1 from "../assets/illustrations/cv-page-1.png";
import "./MatchSheet.css";

/** Ring in the AI Breakdown card. The arc follows the score, so it is drawn
    from the value rather than exported — everything else in the card is copy. */
function MatchScore({ value }: { value: number }) {
  const r = 34;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="ms__score" aria-hidden="true">
      <svg viewBox="0 0 80 80" className="ms__score-ring">
        <circle className="ms__score-track" cx="40" cy="40" r={r} />
        <circle
          className="ms__score-arc"
          cx="40"
          cy="40"
          r={r}
          strokeDasharray={`${(circumference * value) / 100} ${circumference}`}
        />
      </svg>
      <span className="ms__score-value">{value}%</span>
    </div>
  );
}

function Chips({ items }: { items: MatchChip[] }) {
  return (
    <div className="ms__chips">
      {items.map((c) => (
        <span key={c.label} className="ms__chip t-b3-regular">
          {c.label}
          {c.meta && <span className="ms__chip-meta">{c.meta}</span>}
        </span>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="ms__section">
      <p className="ms__label t-b3-medium">{title}</p>
      {children}
    </section>
  );
}

/**
 * AIHR-613 side sheet (`28432:196047`). Opening a match marks it viewed; the
 * CTA invites and then turns into "Send email", as the Invited frame draws it.
 */
export function MatchSheet({ id }: { id: string }) {
  const { matches, inviteMatch, closeOverlay, notify } = useApp();
  const match = matches.find((m) => m.id === id);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeOverlay]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".ms__more-wrap")) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, [menuOpen]);

  if (!match) return null;
  const invited = match.status === "invited";

  const pick = (label: string) => {
    setMenuOpen(false);
    notify(`${label} — not wired up in the prototype`);
  };

  return (
    <div className="ms" role="dialog" aria-modal="true" aria-label={match.name}>
      <div className="ms__scrim" onClick={closeOverlay} />
      <aside className="ms__panel">
        <header className="ms__head">
          <span className="ms__avatar">
            {match.photo ? (
              <img className="ms__photo" src={match.photo} alt="" />
            ) : (
              <span className="ms__initials">{initials(match.name)}</span>
            )}
            {match.hasVideo && (
              <span className="ms__video">
                <img src={iconPlay} alt="" aria-hidden="true" />
              </span>
            )}
          </span>

          <div className="ms__ident">
            <h2 className="ms__name">
              {match.name}
              {match.inTalents && (
                <img className="ms__star" src={iconStar} alt="In Talents" width={14} height={14} />
              )}
            </h2>

            <p className="ms__meta t-b3-regular">
              <span>{match.role}</span>
              <span className="ms__sep">•</span>
              <span>{match.experience}</span>
              {match.rate && (
                <>
                  <span className="ms__sep">•</span>
                  <span>{match.rate}</span>
                </>
              )}
            </p>

            <p className="ms__statuses">
              {/* Same wording as the list: own-pool matches read "Contractors". */}
              <span className="ms__badge t-caption">
                {match.source === "My Pool" ? "Contractors" : match.source}
              </span>
              {match.status !== "not-invited" && (
                <>
                  <span className="ms__sep">•</span>
                  <span className={`ms__status ms__status--${match.status} t-caption`}>
                    {invited ? "Invited" : "Viewed"}
                  </span>
                </>
              )}
            </p>
          </div>

          <button type="button" className="ms__close" onClick={closeOverlay} aria-label="Close">
            <FigmaIcon src={iconClose} size={24} inset={[25, 25, 25, 25]} expand={[7.5, 7.5]} />
          </button>
        </header>

        <div className="ms__body">
          <section className="ms__ai">
            <MatchScore value={match.score} />
            <div className="ms__ai-text">
              <p className="t-b3-regular">
                <span className="ms__verdict">{match.verdict}:</span> {match.breakdown}
              </p>
              <button type="button" className="ms__details t-b3-medium">
                Show details
              </button>
            </div>
          </section>

          <Section title="Links">
            <div className="ms__chips">
              {match.links.map((link) => (
                <a
                  key={link}
                  className="ms__chip ms__chip--link t-b3-regular"
                  href={`https://${link}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link}
                  <img src={iconArrowUpRight} alt="" aria-hidden="true" width={16} height={16} />
                </a>
              ))}
            </div>
          </Section>

          <Section title="Working from">
            <p className="ms__country t-b3-regular">
              <img src={flagGe} alt="" aria-hidden="true" width={22} height={16} />
              {match.country}
            </p>
          </Section>

          <Section title="Education">
            <Chips items={match.education.map((label) => ({ label }))} />
          </Section>

          <Section title="Skills">
            <Chips items={match.skills.map((label) => ({ label }))} />
          </Section>

          <Section title="Work experience">
            <Chips items={match.workExperience} />
          </Section>

          <section className="ms__section">
            <div className="ms__cv-head">
              <p className="ms__label t-b3-medium">CV</p>
              <button
                type="button"
                className="ms__cv-download t-b3-medium"
                onClick={() => pick("Download CV")}
              >
                Download CV
              </button>
            </div>
            <div className="ms__cv">
              <img className="ms__cv-page" src={cvPage1} alt="CV, page 1" />
              {/* Only page 1 is exported from the design, so the pager is drawn
                  as it appears in the frame and does not turn the page. */}
              <div className="ms__pager" aria-hidden="true">
                <span className="ms__pager-item is-current t-b3-regular">1</span>
                <span className="ms__pager-item t-b3-regular">2</span>
              </div>
            </div>
          </section>
        </div>

        <footer className="ms__footer">
          <Button
            fullWidth
            onClick={() => (invited ? pick("Send email") : inviteMatch(match.id))}
          >
            {invited ? "Send email" : "Invite to apply"}
          </Button>

          <div className="ms__more-wrap">
            <button
              type="button"
              className="ms__more"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="More actions"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <FigmaIcon src={iconMore} size={20} inset={[45.83, 16.67, 45.83, 16.67]} expand={[5, 5]} />
            </button>

            {menuOpen && (
              <div className="ms__menu row-menu" role="menu">
                {["Send email", "Download CV", "Add to Contractors"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    className="row-menu__item t-b2-regular"
                    onClick={() => pick(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </footer>
      </aside>
    </div>
  );
}
