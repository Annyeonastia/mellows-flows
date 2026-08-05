import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { FileDropzone } from "../components/FileDropzone";
import { FullScreenModal } from "../components/FullScreenModal";
import { demoCvFiles, fromRealFiles, nameFromFilename } from "../lib/files";
import { useApp } from "../state/store";
import type { UploadFile } from "../state/types";
import { DonutLoader } from "../components/DonutLoader";
import "./UploadCvsFlow.css";

/** How long files sit in the "Uploading..." state before resolving. */
const UPLOAD_MS = 1200;
/** How long the "Reading N CVs..." screen shows — long enough to read the
    animation, short enough that it never feels like a stall. */
const IMPORT_MS = 2800;

type Phase = "pick" | "importing";

export function UploadCvsFlow() {
  const { addContractors, cancelFlow } = useApp();
  const [phase, setPhase] = useState<Phase>("pick");
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const track = (id: number) => {
    timers.current.push(id);
  };

  /** Marks every queued file as finished uploading. */
  const settleUploads = useCallback(() => {
    setFiles((prev) => prev.map((f) => ({ ...f, phase: "done" as const })));
  }, []);

  const addFiles = useCallback(
    (incoming: UploadFile[]) => {
      if (incoming.length === 0) return;
      setAlert(null);
      setFiles((prev) => [...prev, ...incoming]);
      track(window.setTimeout(settleUploads, UPLOAD_MS));
    },
    [settleUploads],
  );

  const valid = files.filter((f) => !f.error);
  const stillUploading = files.some((f) => f.phase === "uploading");

  const handleImport = () => {
    // Step 2A — nothing to import.
    if (valid.length === 0) {
      setAlert("Please upload at least one CV to import and invite contractors");
      return;
    }

    // Step 3 — pressing while files are still uploading completes the upload
    // first, which is the "Uploading" -> "Uploaded" transition in Figma.
    if (stillUploading) {
      settleUploads();
      return;
    }

    // Step 4 — start the import.
    setPhase("importing");
    track(
      window.setTimeout(() => {
        addContractors(
          valid.map((f) => ({
            name: nameFromFilename(f.name),
            email: null,
            hasCv: true,
            status: "invitation-sent" as const,
          })),
        );
      }, IMPORT_MS),
    );
  };

  if (phase === "importing") {
    return (
      <FullScreenModal title="Add Contractors" onClose={cancelFlow}>
        <div className="upload-flow__loader">
          <div className="upload-flow__donut">
            <DonutLoader />
          </div>
          <div className="upload-flow__loader-copy">
            <p className="t-accent-h3">
              Reading {valid.length} CV{valid.length === 1 ? "" : "s"}...
            </p>
            <p className="t-b1-regular">
              It usually take up to 3 minutes –<br />
              keep this popup open
            </p>
          </div>
        </div>
      </FullScreenModal>
    );
  }

  return (
    <FullScreenModal
      title="Add Contractors"
      onClose={cancelFlow}
      alert={alert && <Alert onDismiss={() => setAlert(null)}>{alert}</Alert>}
    >
      <div className="fsm__column">
        <div className="upload-flow__intro">
          <p className="t-b1-medium">Upload CVs</p>
          <p className="t-b2-regular">
            We'll use AI to pre-fill their profile in your Contractor Pool. Inviting them to Scout
            keeps their info up to date and improves how well they match your requests
          </p>
        </div>

        <div className="upload-flow__area">
          <FileDropzone
            files={files}
            onChooseFiles={() => addFiles(demoCvFiles())}
            onDropFiles={(real) => addFiles(fromRealFiles(real))}
            onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
          />
          <Button fullWidth onClick={handleImport}>
            Import &amp; Invite
          </Button>
        </div>
      </div>
    </FullScreenModal>
  );
}
