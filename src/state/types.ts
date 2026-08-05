export type ContractorStatus =
  | "missing-info"
  | "invitation-sent"
  | "invitation-viewed"
  | "scored";

export const STATUS_LABEL: Record<ContractorStatus, string> = {
  "missing-info": "Missing info",
  "invitation-sent": "Invitation sent",
  "invitation-viewed": "Invitation viewed",
  scored: "Scored",
};

export interface Contractor {
  id: string;
  /** Empty when only an email is known — the table then shows "Contractor". */
  name: string;
  email: string | null;
  hasCv: boolean;
  status: ContractorStatus;
  role: string | null;
  /** "Experience" column, e.g. "5.5 years". */
  seniority: string | null;
  /** "Working from" country name. */
  location: string | null;
  /** Country flag shown next to the location. */
  flag: string | null;
  rate: string | null;
  notes: string | null;
  /** "In matches" column. */
  inMatches: boolean;
  /** "Added" column, dd.mm.yyyy as printed in the design. */
  added: string;
  /** Second line of the "Added" cell: "from CV" | "from email invite" | … */
  source: string;
  addedAt: number;
}

/** A file sitting in the Upload CVs drop zone. */
export interface UploadFile {
  id: string;
  name: string;
  /** Human-readable size, e.g. "429 KB" — matches the Figma copy. */
  size: string;
  /** `uploading` renders "Uploading...", `done` renders the size only. */
  phase: "uploading" | "done";
  /** Set when the extension is not PDF/DOC/DOCX. */
  error: string | null;
}

/** `dashboard` and `requests` are navigable but out of this prototype's scope. */
export type Screen = "empty" | "pool" | "dashboard" | "requests";

export type Overlay =
  | { kind: "none" }
  | { kind: "upload-cvs" }
  | { kind: "add-emails" }
  | { kind: "invited"; count: number }
  | { kind: "delete-contractor"; id: string }
  | { kind: "delete-many"; ids: string[] }
  | { kind: "missing-info"; id: string }
  | { kind: "profile"; id: string };

/** Where a flow was opened from, so closing returns the user there. */
export type FlowOrigin = "empty-expanded" | "empty-collapsed" | "pool";
