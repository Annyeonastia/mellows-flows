import { Button } from "../components/Button";
import { DeleteIllustration } from "../components/SendIllustration";
import { Modal } from "../components/Modal";
import { useApp } from "../state/store";

/** Bulk confirmation raised from the "N Selected" bar. */
export function DeleteManyModal({ ids }: { ids: string[] }) {
  const { removeContractors, closeOverlay } = useApp();
  const count = ids.length;

  return (
    <Modal label={`Delete ${count} contractors`} onClose={closeOverlay}>
      <DeleteIllustration />

      <div className="modal__copy">
        <p className="modal__title t-accent-h5">
          Delete {count} Contractor{count === 1 ? "" : "s"}?
        </p>
        <p className="modal__text t-b2-regular">
          Selected contractors will be removed from your pool. This can't be undone.
        </p>
      </div>

      <div className="modal__buttons">
        <Button
          variant="danger"
          fullWidth
          onClick={() => {
            removeContractors(ids);
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
