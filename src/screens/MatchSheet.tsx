import { useEffect } from "react";
import { Button } from "../components/Button";
import { FigmaIcon } from "../components/FigmaIcon";
import { initials } from "./RequestPage";
import { useApp } from "../state/store";
import iconClose from "../assets/icons/icon-close-20.svg";
import "./MatchSheet.css";

/**
 * AIHR-613 side sheet. Opening a match marks it viewed; Invite flips it to
 * invited and leaves the sheet open, so the new state is visible before the
 * user closes it.
 */
export function MatchSheet({ id }: { id: string }) {
  const { matches, request, inviteMatch, closeOverlay } = useApp();
  const match = matches.find((m) => m.id === id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeOverlay]);

  if (!match) return null;
  const inPool = match.source === "My Pool";

  return (
    <div className="ms" role="dialog" aria-modal="true" aria-label={match.name}>
      <div className="ms__scrim" onClick={closeOverlay} />
      <aside className="ms__panel">
        <header className="ms__head">
          <span className="ms__avatar">{initials(match.name)}</span>
          <div className="ms__ident">
            <h2 className="t-accent-h5">{match.name}</h2>
            <p className="t-b2-regular u-secondary">
              {match.role} · {match.experience}
            </p>
          </div>
          <button type="button" className="ms__close" onClick={closeOverlay} aria-label="Close">
            <FigmaIcon src={iconClose} size={20} inset={[25, 25, 25, 25]} expand={[7.5, 7.5]} />
          </button>
        </header>

        <div className="ms__chips">
          <span className="ms__score t-b3-regular">{match.score}% match</span>
          <span className="ms__chip t-b3-regular">{match.source}</span>
          {inPool && <span className="ms__in-talents t-caption">In Talents</span>}
          <span className={`ms__status ms__status--${match.status} t-caption`}>
            {match.status === "invited"
              ? "Invited"
              : match.status === "viewed"
                ? "Viewed"
                : "Not invited"}
          </span>
        </div>

        <section className="ms__section">
          <p className="ms__label t-caption">Rate</p>
          <p className="t-b2-regular">{match.rate ?? "Contact for rate"}</p>
        </section>

        <section className="ms__section">
          <p className="ms__label t-caption">Matched against</p>
          <p className="t-b2-regular">{request.title}</p>
        </section>

        <section className="ms__section">
          <p className="ms__label t-caption">Skills and tools</p>
          <div className="ms__skills">
            {request.skills.slice(0, 5).map((s) => (
              <span key={s} className="ms__chip t-b3-regular">
                {s}
              </span>
            ))}
          </div>
        </section>

        <footer className="ms__footer">
          {match.status === "invited" ? (
            <p className="ms__invited t-b2-regular">
              Invited — {match.name.split(" ")[0]} will see your request.
            </p>
          ) : (
            <Button fullWidth onClick={() => inviteMatch(match.id)}>
              Invite
            </Button>
          )}
        </footer>
      </aside>
    </div>
  );
}
