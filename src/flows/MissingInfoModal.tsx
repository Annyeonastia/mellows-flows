import { useState } from "react";
import { Button } from "../components/Button";
import { FigmaIcon } from "../components/FigmaIcon";
import { Modal } from "../components/Modal";
import { nameFromEmail } from "../lib/emails";
import { useApp } from "../state/store";
import iconX16 from "../assets/icons/icon-x-16.svg";
import "./MissingInfoModal.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * "Add Missing Info" — fills in the address for a contractor that only has a
 * partial record. Delete here cancels the edit; it does not remove the row.
 */
export function MissingInfoModal({ id }: { id: string }) {
  const { contractors, updateContractor, closeOverlay } = useApp();
  const contractor = contractors.find((c) => c.id === id);

  const [value, setValue] = useState(contractor?.email ?? "");
  const [touched, setTouched] = useState(false);

  if (!contractor) return null;

  const invalid = touched && !EMAIL_RE.test(value.trim());

  const save = () => {
    setTouched(true);
    const email = value.trim();
    if (!EMAIL_RE.test(email)) return;

    updateContractor(id, {
      email,
      // A contractor with a usable address is no longer missing info; the
      // invite goes out, so the row moves to "Invitation sent".
      name: contractor.name || nameFromEmail(email),
      status: "invitation-sent",
    });
    closeOverlay();
  };

  return (
    <Modal label="Add missing info" onClose={closeOverlay} align="start">
      <div className="modal__copy">
        <p className="modal__title t-accent-h5">Add Missing Info</p>
        <p className="modal__text t-b2-regular">
          Add their email to send the invite, or delete this contractor if you don't need them.
        </p>
      </div>

      <div className="mi-field">
        <label className={`mi-field__label t-b3-regular ${invalid ? "is-invalid" : ""}`} htmlFor="mi-email">
          Email
        </label>

        <div className={`mi-field__input ${invalid ? "is-invalid" : ""}`}>
          <input
            id="mi-email"
            className="t-b2-regular"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => setTouched(true)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            placeholder="name@company.com"
            autoFocus
          />
          {value && (
            <button
              type="button"
              className="mi-field__clear"
              onClick={() => setValue("")}
              aria-label="Clear email"
            >
              <FigmaIcon src={iconX16} size={16} inset={[25, 25, 25, 25]} expand={[9.38, 9.38]} />
            </button>
          )}
        </div>

        {invalid && <p className="mi-field__error t-b3-regular">Enter correct email</p>}
      </div>

      <div className="modal__buttons">
        <Button fullWidth onClick={save}>
          Save &amp; Invite
        </Button>
        <Button variant="danger" fullWidth onClick={closeOverlay}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
