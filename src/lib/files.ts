import type { UploadFile } from "../state/types";

let seq = 0;
const nextId = () => `f${++seq}`;

const VALID_EXT = ["pdf", "doc", "docx"];

/**
 * The scripted set from the Figma "Uploaded" frame — same names, sizes and the
 * one invalid entry, so a click-through demo always reproduces the design.
 * Real drag-and-drop is handled separately by `fromRealFiles`.
 */
export function demoCvFiles(): UploadFile[] {
  return [
    { name: "CV_ethan_clarke_2026.pdf", size: "0.1 MB", error: null },
    { name: "Layla Patel 2025.docx", size: "429 KB", error: null },
    { name: "CV Samantha Clay 2026.txt", size: "128 KB", error: "Invalid file type" },
    { name: "Andersson2026", size: "0.3 MB", error: null },
  ].map((f) => ({ ...f, id: nextId(), phase: "uploading" as const }));
}

export function demoEmailFile(): UploadFile {
  return {
    id: nextId(),
    name: "contractors_emails.csv",
    size: "12 KB",
    phase: "uploading",
    error: null,
  };
}

export function fromRealFiles(files: File[]): UploadFile[] {
  return files.map((file) => {
    const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
    const tooBig = file.size > 5 * 1024 * 1024;
    return {
      id: nextId(),
      name: file.name,
      size: formatSize(file.size),
      phase: "uploading" as const,
      error: !VALID_EXT.includes(ext)
        ? "Invalid file type"
        : tooBig
          ? "File is over 5 MB"
          : null,
    };
  });
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Best-effort person name from a CV filename:
 * "CV_ethan_clarke_2026.pdf" -> "Ethan Clarke", "Andersson2026" -> "Andersson".
 */
export function nameFromFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  const words = base
    .replace(/[_\-.]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/(\D)(\d)/g, "$1 $2")
    .split(/\s+/)
    .filter((w) => w && !/^\d+$/.test(w) && !/^(cv|resume|curriculum|vitae)$/i.test(w));

  if (words.length === 0) return base || "Unnamed contractor";
  return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
