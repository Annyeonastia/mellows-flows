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

/** What the user types in the "Generate request" popup, kept in the store so
    stepping back from Edit request returns to a filled-in form. */
export interface RequestDraft {
  description: string;
  /** "Search only my pool" — private matching, no public link, no promotion. */
  privatePool: boolean;
}

export const EMPTY_REQUEST_DRAFT: RequestDraft = { description: "", privatePool: false };

export type ExperienceLevel = "Junior" | "Mid-level" | "Senior" | "Top-tier";

/** The request produced from a draft, as drawn on the Edit request frames. */
export interface RequestRecord {
  title: string;
  summary: string;
  experience: ExperienceLevel;
  languages: string[];
  skills: string[];
  projectType: string;
  workload: string;
}

/** Where an AI match came from. "My Pool" is the user's own Contractor Pool. */
export type MatchSource = "My Pool" | "Mellow" | "LinkedIn" | "Internet";

/** Not invited -> viewed on open -> invited after the CTA. */
export type MatchStatus = "not-invited" | "viewed" | "invited";

export interface AiMatch {
  id: string;
  name: string;
  source: MatchSource;
  /** Percentage shown in the green "N% match" chip. */
  score: number;
  role: string;
  experience: string;
  /** null renders "Contact for rate". */
  rate: string | null;
  status: MatchStatus;
  /** Orange dot on the avatar. */
  isNew: boolean;
}

/** `dashboard` and `requests` are navigable but out of this prototype's scope. */
export type Screen = "empty" | "pool" | "dashboard" | "requests" | "request";

export type Overlay =
  | { kind: "none" }
  | { kind: "upload-cvs" }
  | { kind: "add-emails" }
  | { kind: "invited"; count: number }
  | { kind: "delete-contractor"; id: string }
  | { kind: "delete-many"; ids: string[] }
  | { kind: "missing-info"; id: string }
  | { kind: "profile"; id: string }
  | { kind: "new-request" }
  | { kind: "edit-request" }
  | { kind: "match"; id: string };

/** Where a flow was opened from, so closing returns the user there. */
export type FlowOrigin = "empty-expanded" | "empty-collapsed" | "pool";
