import { useEffect, useRef, useState } from "react";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { EmailTagInput, type EmailTag } from "../components/EmailTagInput";
import { FileDropzone } from "../components/FileDropzone";
import { FullScreenModal } from "../components/FullScreenModal";
import { DonutLoader } from "../components/DonutLoader";
import "./UploadCvsFlow.css";
import { nameFromEmail } from "../lib/emails";
import { useApp } from "../state/store";
import type { UploadFile } from "../state/types";
import "./AddEmailsFlow.css";

const UPLOAD_MS = 1200;
/** Long enough for the loader to read as a real step, short enough not to stall. */
const INVITE_MS = 2200;
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_EXT = ["csv", "xlsx", "txt"];
const EMAIL_IN_TEXT = /[^\s,;<>()"']+@[^\s,;<>()"']+\.[^\s,;<>()"']+/g;

/** Contacts the demo spreadsheet resolves to once it finishes uploading. */
const FILE_CONTACTS = [
  "john.smith@acme.com",
  "sara.kim@studio.io",
  "m.rodriguez@freelance.net",
];

let fileSeq = 0;

export function AddEmailsFlow() {
  const { addContractors, cancelFlow, notify } = useApp();
  const [tags, setTags] = useState<EmailTag[]>([]);
  const [files, setFiles] = useState<UploadFile[]>([]);
  /** Addresses the attached file resolves to. */
  const [fileContacts, setFileContacts] = useState<string[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const track = (id: number) => {
    timers.current.push(id);
  };

  const attach = (file: UploadFile, contacts: string[]) => {
    setAlert(null);
    setFiles([file]); // the design shows a single attachment
    setFileContacts(contacts);
    track(
      window.setTimeout(
        () => setFiles((prev) => prev.map((f) => ({ ...f, phase: "done" as const }))),
        UPLOAD_MS,
      ),
    );
  };

  /**
   * The error state belongs to the file branch only — an empty or invalid
   * manual input is covered by the disabled Invite button and inline validation.
   */
  const handleRealFiles = async (dropped: File[]) => {
    const file = dropped[0];
    if (!file) return;

    const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";

    if (!ALLOWED_EXT.includes(ext)) {
      setAlert("This file type isn't supported. Upload a CSV, XLSX or TXT file");
      return;
    }
    if (file.size > MAX_BYTES) {
      setAlert("This file is larger than 2 MB. Upload a smaller file");
      return;
    }

    let contacts = FILE_CONTACTS;

    // CSV and TXT are plain text, so the addresses can actually be read out.
    // XLSX is binary — the demo contacts stand in for parsed contents.
    if (ext === "csv" || ext === "txt") {
      let text = "";
      try {
        text = await file.text();
      } catch {
        setAlert("This file couldn't be read. Try uploading it again");
        return;
      }
      contacts = [...new Set(text.match(EMAIL_IN_TEXT) ?? [])];
      if (contacts.length === 0) {
        setAlert("No valid email addresses found in this file");
        return;
      }
    }

    attach(
      {
        id: `rf${++fileSeq}`,
        name: file.name,
        size: file.size >= 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`,
        phase: "uploading",
        error: null,
      },
      contacts,
    );
  };

  const validTags = tags.filter((t) => t.valid);
  const readyFile = files.find((f) => !f.error);

  /* Invite stays inactive until there is something real to send: at least one
     valid address, or a finished attachment. An invalid address does not
     count as input. */
  const canInvite = validTags.length > 0 || Boolean(readyFile);

  const handleInvite = () => {
    // Invite is always clickable: pressing it with nothing entered is what
    // surfaces the red snack, and the user stays on this screen.
    if (!canInvite) {
      setAlert("Add at least one email to send invitations");
      return;
    }

    const emails = validTags.length > 0 ? validTags.map((t) => t.value) : fileContacts;

    setInviting(true);
    track(
      window.setTimeout(() => {
        addContractors(
          emails.map((email) => ({
            name: nameFromEmail(email),
            email,
            hasCv: false,
            status: "invitation-sent" as const,
          })),
          // Add emails has no success modal — it lands on the table with a snack.
          { announce: "none" },
        );
        notify(
          `All done! ${emails.length} contractor${emails.length === 1 ? "" : "s"} invited to your pool.`,
        );
      }, INVITE_MS),
    );
  };

  // Sending state — the same loader the CV import uses.
  if (inviting) {
    return (
      <FullScreenModal title="Add Contractors" onClose={cancelFlow}>
        <div className="upload-flow__loader">
          <div className="upload-flow__donut">
            <DonutLoader />
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
        <div className="emails-flow__intro">
          <p className="t-b1-medium">Add Emails</p>
          <p className="t-b2-regular">
            Attach a file or paste emails below — we'll invite each contractor to fill in their own
            details on Scout
          </p>
        </div>

        <div className="emails-flow__area">
          <FileDropzone
            files={files}
            hint="CSV, XLSX or TXT (up to 2 MB)"
            onChooseFiles={() =>
              attach(
                {
                  id: `xf${++fileSeq}`,
                  name: "freelancers_contacts_2026_file.xlsx",
                  size: "209 KB",
                  phase: "uploading",
                  error: null,
                },
                FILE_CONTACTS,
              )
            }
            onDropFiles={handleRealFiles}
            onRemove={(id) => {
              setFiles((prev) => prev.filter((f) => f.id !== id));
              setFileContacts([]);
            }}
          />

          <div className="emails-flow__divider">
            <span />
            <p className="t-caption u-secondary">OR</p>
            <span />
          </div>

          <EmailTagInput
            tags={tags}
            onChange={(next) => {
              setAlert(null);
              setTags(next);
            }}
          />
        </div>

        <Button fullWidth loading={inviting} onClick={handleInvite}>
          Invite
        </Button>
      </div>
    </FullScreenModal>
  );
}
