import { Button } from "../components/Button";
import { useApp } from "../state/store";
import iconUpload from "../assets/icons/icon-upload.svg";
import artAddContractors from "../assets/illustrations/add-contractors.png";
import artUpdatedInfo from "../assets/illustrations/updated-info.png";
import artTheyMatch from "../assets/illustrations/they-match.png";
import "./EmptyState.css";

const CARDS = [
  {
    title: "Add your contractors",
    caption: "Upload CVs — or add emails to invite contractors you already trust",
    art: artAddContractors,
  },
  {
    title: "Get the updated info",
    caption: "Each contractor gets an invitation and completes an AI-powered screening",
    art: artUpdatedInfo,
  },
  {
    title: "They match first",
    caption: "Your pool matches first — you decide who fits your request best",
    art: artTheyMatch,
  },
];

export function EmptyState() {
  const { openUploadCvs, openAddEmails, menuExpanded } = useApp();
  const origin = menuExpanded ? "empty-expanded" : "empty-collapsed";

  return (
    <div className="empty">
      <div className="empty__intro">
        <h2 className="t-accent-h3">Build your Contractor Pool</h2>
        <p className="t-b1-regular u-secondary">A curated bench of contractors you already know</p>
      </div>

      <div className="empty__cards">
        {CARDS.map((card) => (
          <article key={card.title} className="onboarding-card">
            <div className="onboarding-card__art">
              <img src={card.art} alt="" aria-hidden="true" />
            </div>
            <div className="onboarding-card__copy">
              <p className="t-b1-medium">{card.title}</p>
              <p className="t-b2-regular">{card.caption}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="empty__actions">
        <Button iconSrc={iconUpload} onClick={() => openUploadCvs(origin)}>
          Upload CVs
        </Button>
        <Button variant="secondary" onClick={() => openAddEmails(origin)}>
          Add emails
        </Button>
      </div>
    </div>
  );
}
