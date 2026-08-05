import { useEffect, useMemo, useState } from "react";
import { FigmaIcon } from "../components/FigmaIcon";
import { RowActionsMenu, type MenuItem } from "../components/RowActionsMenu";
import { STATUS_LABEL, type Contractor } from "../state/types";
import { useApp } from "../state/store";
import { downloadCv } from "../lib/cv";
import {
  activityOf,
  firstNameOf,
  initialsOf,
  linksOf,
  monthLabel,
  skillsOf,
  type ActivityEntry,
} from "../data/profile";
import iconClose20 from "../assets/icons/icon-close-20.svg";
import iconMail16 from "../assets/icons/icon-mail-16.svg";
import iconArrowUpRight from "../assets/icons/icon-arrow-up-right-12.svg";
import "./ContractorProfile.css";

/* Contractor profile — a right-hand drawer over the dimmed pool.
 *
 * Built from the draft frames 28868-140728 (Overview) and 28933-248988
 * (Activity), which the designer flagged as provisional. Everything the drawer
 * needs lives in this module and `data/profile.ts`, so swapping in the clean
 * mockups means rewriting these two files and nothing else. */

const NOTE_LIMIT = 256;

type Tab = "overview" | "activity";

export function ContractorProfile({ id }: { id: string }) {
  const { contractors, closeOverlay, updateContractor, openDeleteContractor, openMissingInfo, notify } =
    useApp();
  const [tab, setTab] = useState<Tab>("overview");
  const [menu, setMenu] = useState<DOMRect | null>(null);

  const contractor = contractors.find((c) => c.id === id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeOverlay]);

  // Deleting the contractor from inside the drawer leaves nothing to show.
  useEffect(() => {
    if (!contractor) closeOverlay();
  }, [contractor, closeOverlay]);

  if (!contractor) return null;
  const c = contractor;

  const links = linksOf(c);
  const skills = skillsOf(c);

  const moreItems: MenuItem[] = [
    ...(c.status === "missing-info"
      ? [{ id: "add-missing-info" as const, label: "Add missing info" }]
      : []),
    ...(c.hasCv ? [{ id: "download-cv" as const, label: "Download CV" }] : []),
    { id: "delete" as const, label: "Delete contractor", danger: true },
  ];

  const onMoreSelect = (action: MenuItem["id"]) => {
    setMenu(null);
    if (action === "delete") openDeleteContractor(c.id);
    else if (action === "add-missing-info") openMissingInfo(c.id);
    else if (action === "download-cv") notify(`${downloadCv(c)} downloaded`);
  };

  return (
    <div
      className="profile-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${c.name || "Contractor"} profile`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeOverlay();
      }}
    >
      <div className="profile">
        <button type="button" className="profile__close" onClick={closeOverlay} aria-label="Close">
          <FigmaIcon src={iconClose20} size={20} inset={[25, 25, 25, 25]} expand={[10.61, 10.61]} />
        </button>

        <header className="profile__header">
          <span className="profile__avatar" aria-hidden="true">
            {initialsOf(c)}
          </span>

          <div className="profile__ident">
            <h2 className="profile__name">{c.name || "Contractor"}</h2>
            <p className="profile__meta t-b2-regular">
              {c.role ?? "Role not set"}
              <span className="profile__dot" aria-hidden="true" />
              {c.seniority ?? "Experience not set"}
            </p>
            <span className={`badge badge--${c.status}`}>{STATUS_LABEL[c.status]}</span>
          </div>
        </header>

        <div className="profile__tabs" role="tablist" aria-label="Profile sections">
          {(["overview", "activity"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className={`profile__tab t-b2-regular ${tab === t ? "is-active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "overview" ? "Overview" : "Activity"}
            </button>
          ))}
        </div>

        <div className="profile__body">
          {tab === "overview" ? (
            <Overview
              contractor={c}
              links={links}
              skills={skills}
              onNoteChange={(notes) => updateContractor(c.id, { notes: notes || null })}
            />
          ) : (
            <Activity entries={activityOf(c)} />
          )}
        </div>

        <footer className="profile__footer">
          <button
            type="button"
            className="profile__invite t-b2-regular"
            onClick={() => {
              updateContractor(c.id, { status: "invitation-sent" });
              notify(`Invite sent to ${firstNameOf(c)}`);
            }}
          >
            Invite to update info
          </button>
          <button
            type="button"
            className={`profile__more ${menu ? "is-open" : ""}`}
            aria-label="More actions"
            aria-haspopup="menu"
            aria-expanded={menu !== null}
            onClick={(e) => setMenu((m) => (m ? null : e.currentTarget.getBoundingClientRect()))}
          >
            <span className="profile__more-dots" aria-hidden="true" />
          </button>
        </footer>
      </div>

      {menu && (
        <RowActionsMenu
          anchor={menu}
          items={moreItems}
          onSelect={onMoreSelect}
          onClose={() => setMenu(null)}
        />
      )}
    </div>
  );
}

function Overview({
  contractor: c,
  links,
  skills,
  onNoteChange,
}: {
  contractor: Contractor;
  links: ReturnType<typeof linksOf>;
  skills: string[];
  onNoteChange: (notes: string) => void;
}) {
  const note = c.notes ?? "";

  return (
    <>
      <section className="profile__section">
        <h3 className="profile__label t-b3-regular">Contacts</h3>
        {c.email ? (
          <a className="profile__email t-b2-regular" href={`mailto:${c.email}`}>
            <img src={iconMail16} alt="" aria-hidden="true" width={16} height={16} />
            {c.email}
          </a>
        ) : (
          <p className="t-b2-regular u-secondary">No email on file</p>
        )}
      </section>

      {links.length > 0 && (
        <section className="profile__section">
          <h3 className="profile__label t-b3-regular">Links</h3>
          <div className="profile__chips">
            {links.map((l) => (
              <a
                key={l.label}
                className="profile__link-chip t-b3-regular"
                href={l.href}
                target="_blank"
                rel="noreferrer"
              >
                {l.label}
                <img src={iconArrowUpRight} alt="" aria-hidden="true" width={12} height={12} />
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="profile__section">
        <h3 className="profile__label t-b3-regular">Working from</h3>
        {c.location ? (
          <p className="profile__country t-b2-regular">
            <span className="profile__flag">{c.flag}</span>
            {c.location}
          </p>
        ) : (
          <p className="t-b2-regular u-secondary">Not set</p>
        )}
      </section>

      <section className="profile__section">
        <h3 className="profile__label t-b3-regular">Note</h3>
        <textarea
          className="profile__note t-b2-regular"
          placeholder="Add any project details, team info, tags, or context"
          maxLength={NOTE_LIMIT}
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
        />
        <p className="profile__counter t-b3-regular u-secondary">
          {note.length} / {NOTE_LIMIT}
        </p>
      </section>

      {skills.length > 0 && (
        <section className="profile__section">
          <h3 className="profile__label t-b3-regular">Skills</h3>
          <div className="profile__chips">
            {skills.map((s) => (
              <span key={s} className="profile__skill t-b3-regular">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Activity({ entries }: { entries: ActivityEntry[] }) {
  // Consecutive entries under one heading, newest month first.
  const groups = useMemo(() => {
    const out: { month: string; items: ActivityEntry[] }[] = [];
    for (const e of entries) {
      const month = monthLabel(e.date);
      const last = out[out.length - 1];
      if (last && last.month === month) last.items.push(e);
      else out.push({ month, items: [e] });
    }
    return out;
  }, [entries]);

  if (groups.length === 0) {
    return <p className="t-b2-regular u-secondary">Nothing has happened yet.</p>;
  }

  return (
    <>
      {groups.map((g) => (
        <section key={g.month} className="profile__month">
          <h3 className="profile__month-title t-b1-medium">{g.month}</h3>
          <ul className="profile__feed">
            {g.items.map((e) => (
              <li key={e.id} className="profile__event">
                <span
                  className={`profile__event-avatar ${e.actor === "you" ? "is-you" : ""} t-b3-regular`}
                  aria-hidden="true"
                >
                  {e.initials}
                </span>
                <p className="profile__event-text t-b2-regular">
                  {e.text}
                  {e.link && <span className="profile__event-link">{e.link}</span>}
                </p>
                <span className="profile__event-date t-b2-regular u-secondary">{e.date}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
