import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { SendIllustration } from "../components/SendIllustration";
import { useApp } from "../state/store";

/**
 * Success state shared by both flows. Closing it — via the cross or "Great!" —
 * lands on the pool table with the new contractors already in it.
 */
export function InvitedModal({ count }: { count: number }) {
  const { finishInvite } = useApp();

  return (
    <Modal label={`All ${count} invited`} onClose={finishInvite}>
      <SendIllustration />

      <div className="modal__copy">
        <p className="modal__title t-accent-h5">All {count} Invited</p>
        <div className="modal__text t-b2-regular">
          <p>
            {count} contractor{count === 1 ? " is" : "s are"} now in your pool.
          </p>
          <p>
            Each one gets an invite to update their info. Once done, their status changes to Scored.
          </p>
        </div>
      </div>

      <div className="modal__buttons">
        <Button variant="secondary" fullWidth onClick={finishInvite}>
          Great!
        </Button>
      </div>
    </Modal>
  );
}
