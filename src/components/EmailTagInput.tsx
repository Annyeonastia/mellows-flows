import { useRef, useState, type KeyboardEvent, type ClipboardEvent } from "react";
import { FigmaIcon } from "./FigmaIcon";
import iconX16 from "../assets/icons/icon-x-16.svg";
import "./EmailTagInput.css";

export interface EmailTag {
  id: string;
  value: string;
  valid: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let seq = 0;
export function makeTag(value: string): EmailTag {
  return { id: `e${++seq}`, value, valid: EMAIL_RE.test(value) };
}

/** Splits on comma, semicolon or whitespace — the separators the design names. */
export function parseEmails(raw: string): EmailTag[] {
  return raw
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(makeTag);
}

interface EmailTagInputProps {
  tags: EmailTag[];
  onChange: (tags: EmailTag[]) => void;
  placeholder?: string;
}

export function EmailTagInput({
  tags,
  onChange,
  placeholder = "Paste emails separated with a comma, or space",
}: EmailTagInputProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (raw: string) => {
    const parsed = parseEmails(raw);
    if (parsed.length) onChange([...tags, ...parsed]);
    setDraft("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === " " || e.key === "Enter" || e.key === ";") {
      if (draft.trim()) {
        e.preventDefault();
        commit(draft);
      }
      return;
    }
    if (e.key === "Backspace" && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (/[\s,;]/.test(text)) {
      e.preventDefault();
      commit(text);
    }
  };

  const validCount = tags.filter((t) => t.valid).length;
  const invalidCount = tags.length - validCount;

  return (
    <div className="tag-input">
      <div className="tag-input__box" onClick={() => inputRef.current?.focus()}>
        {tags.map((tag) => (
          <span key={tag.id} className={`tag ${tag.valid ? "" : "tag--invalid"}`}>
            <span className="t-b3-regular">{tag.value}</span>
            <button
              type="button"
              className="tag__remove"
              aria-label={`Remove ${tag.value}`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(tags.filter((t) => t.id !== tag.id));
              }}
            >
              <FigmaIcon src={iconX16} size={16} inset={[25, 25, 25, 25]} expand={[9.38, 9.38]} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          className="tag-input__field t-b2-regular"
          value={draft}
          placeholder={tags.length === 0 ? placeholder : ""}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => draft.trim() && commit(draft)}
          aria-label="Emails"
        />
      </div>

      <p className="tag-input__counter t-b3-regular u-secondary">
        {validCount} valid · {invalidCount} invalid
      </p>
    </div>
  );
}
