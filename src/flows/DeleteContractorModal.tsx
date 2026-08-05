import { Button } from "../components/Button";
import { DeleteIllustration } from "../components/SendIllustration";
import { Modal } from "../components/Modal";
import { useApp } from "../state/store";

/**
 * Confirmation before removing a row. Only "Yes, delete" changes data — the
 * cross and "No, keep them" close the modal and leave the table untouched.
 */
export function DeleteContractorModal({ id }: { id: string }) {
  const { contractors, removeContractor, closeOverlay } = useApp();
  const contractor = contractors.find((c) => c.id === id);

  if (!contractor) return null;

  const displayName = contractor.name || "Contractor";

  return (
    <Modal label="Delete contractor" onClose={closeOverlay}>
      <DeleteIllustration />

      <div className="modal__copy">
        <p className="modal__title t-accent-h5">Delete Contractor?</p>
        <p className="modal__text t-b2-regular">
          {displayName} will be removed from your pool. This can't be undone.
        </p>
      </div>

      <div className="modal__buttons">
        <Button
          variant="danger"
          fullWidth
          onClick={() => {
            removeContractor(id);
            closeOverlay();
          }}
        >
          Yes, delete
        </Button>
        <Button fullWidth onClick={closeOverlay}>
          No, keep them
        </Button>
      </div>
    </Modal>
  );
}
