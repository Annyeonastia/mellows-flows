import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { FigmaIcon } from "../components/FigmaIcon";
import { Header } from "../components/Header";
import { PoolTable } from "./PoolTable";
import { useApp } from "../state/store";
import iconUpload20 from "../assets/icons/icon-upload-20.svg";
import iconBell from "../assets/icons/icon-bell.svg";
import "./ContractorPool.css";

/** The "Default" screen: page chrome, action row and the interactive table. */
export function ContractorPool() {
  const { openUploadCvs, openAddEmails, toast, notify, dismissToast } = useApp();

  const copyEmail = (email: string) => {
    // Confirm first: the clipboard call can hang or be blocked by permissions,
    // and the user should never be left without feedback because of it.
    notify("Email copied!");

    navigator.clipboard?.writeText(email).catch(() => {
      /* clipboard unavailable — nothing further to do */
    });
  };

  return (
    <>
      <Header
        title="Contractor Pool"
        showGenerate
        actions={
          <div className="pool__actions">
            <Button size="md" iconSrc={iconUpload20} onClick={() => openUploadCvs("pool")}>
              Upload CVs
            </Button>
            <Button size="md" variant="secondary" onClick={() => openAddEmails("pool")}>
              Add emails
            </Button>
            <button
              type="button"
              className="pool__csv t-b2-regular"
              onClick={() => notify("CSV import requested — we'll email you")}
            >
              <FigmaIcon
                src={iconBell}
                size={20}
                inset={[8.33, 12.5, 8.35, 12.5]}
                expand={[4.5, 5]}
              />
              Request CSV import
            </button>
          </div>
        }
      />

      <div className="pool__body">
        <PoolTable onCopyEmail={copyEmail} />
      </div>

      {/* Top-right over the header, as the "Email copied!" frame shows — not a
          centred toast. */}
      {toast && (
        <Alert tone="info" onDismiss={dismissToast}>
          {toast}
        </Alert>
      )}
    </>
  );
}
