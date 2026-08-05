import { useRef, useState } from "react";
import { FigmaIcon } from "./FigmaIcon";
import iconFile20 from "../assets/icons/icon-file-20.svg";
import iconX20 from "../assets/icons/icon-x-20.svg";
import type { UploadFile } from "../state/types";
import "./FileDropzone.css";

interface FileDropzoneProps {
  files: UploadFile[];
  hint?: string;
  onChooseFiles: () => void;
  onDropFiles: (files: File[]) => void;
  onRemove: (id: string) => void;
}

export function FileDropzone({
  files,
  hint = "PDF, DOC or DOCX (up to 5 MB)",
  onChooseFiles,
  onDropFiles,
  onRemove,
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const depth = useRef(0);

  return (
    <div className="dropzone">
      <div
        className={`dropzone__area ${dragging ? "is-dragging" : ""}`}
        onClick={onChooseFiles}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChooseFiles();
          }
        }}
        role="button"
        tabIndex={0}
        onDragEnter={(e) => {
          e.preventDefault();
          depth.current += 1;
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          depth.current -= 1;
          if (depth.current <= 0) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          depth.current = 0;
          setDragging(false);
          const dropped = Array.from(e.dataTransfer.files);
          if (dropped.length) onDropFiles(dropped);
        }}
      >
        <div className="dropzone__copy">
          <p className="t-b2-regular">
            Drag &amp; drop or <span className="u-brand">choose files</span>
          </p>
          <p className="t-b3-regular u-secondary">{hint}</p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="dropzone__files">
          {files.map((file) => (
            <li key={file.id} className="file-row">
              <div
                className={`file-card ${file.error ? "is-invalid" : ""} ${
                  file.phase === "uploading" ? "is-uploading" : ""
                }`}
              >
                <span className="file-card__icon">
                  <FigmaIcon
                    src={iconFile20}
                    size={20}
                    inset={[8.33, 16.67, 8.33, 16.67]}
                    expand={[4.5, 5.63]}
                  />
                </span>

                <span className="file-card__meta">
                  <span className="file-card__name t-b3-medium">{file.name}</span>
                  <span className={`t-caption ${file.error ? "file-card__error" : "u-secondary"}`}>
                    {file.error ?? file.size}
                  </span>
                </span>

                {file.phase === "uploading" && (
                  <span className="file-card__status t-caption u-secondary">Uploading...</span>
                )}

                <button
                  type="button"
                  className="file-card__remove"
                  onClick={() => onRemove(file.id)}
                  aria-label={`Remove ${file.name}`}
                >
                  <FigmaIcon
                    src={iconX20}
                    size={20}
                    inset={[25, 25, 25, 25]}
                    expand={[7.5, 7.5]}
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
