import { useMemo } from "react";
import { Button } from "../components/Button";
import { FullScreenModal } from "../components/FullScreenModal";
import { COVERAGE_CHIPS, coveredChips } from "../lib/requestCoverage";
import { useApp } from "../state/store";
import "./NewRequestFlow.css";

/** Figma prints this greyed sample in the empty field. */
const PLACEHOLDER =
  "Graphic designer for social media content – mid-level or above, based in the EU, up to $30/hr. Around 20 hours per week.";

const MAX_LENGTH = 256;

/**
 * "Popup - Empty / Filled" from AIHR-614: the takeover where a request starts.
 * Closing abandons the draft and returns to the Contractors screen; Generate
 * request carries the draft on to Edit request.
 */
export function NewRequestFlow() {
  const { requestDraft, updateRequestDraft, openEditRequest, closeRequestFlow } = useApp();

  const { description, privatePool } = requestDraft;
  const covered = useMemo(() => coveredChips(description), [description]);

  const required = COVERAGE_CHIPS.filter((c) => c.group === "required");
  const recommended = COVERAGE_CHIPS.filter((c) => c.group === "recommended");

  /** "Generate request becomes active" — nothing to generate from an empty field. */
  const canSubmit = description.trim().length > 0;

  const renderChips = (group: typeof required) => (
    <div className="nr__badges">
      {group.map((chip) => (
        <span
          key={chip.id}
          className={`nr__badge t-caption${covered.has(chip.id) ? " is-covered" : ""}`}
          data-chip={chip.id}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );

  return (
    <FullScreenModal title="New Request" onClose={closeRequestFlow}>
      <div className="nr">
        <div className="nr__wrap">
          <header className="nr__intro">
            <h2 className="t-accent-h5">Who are You Looking For?</h2>
            <p className="t-b2-regular">Describe the contractor you need in your own words</p>
          </header>

          <div className="nr__form">
            <div className="nr__field">
              <textarea
                className="nr__textarea t-b2-regular"
                placeholder={PLACEHOLDER}
                maxLength={MAX_LENGTH}
                value={description}
                onChange={(e) => updateRequestDraft({ description: e.target.value })}
                aria-label="Describe the contractor you need"
              />
              <p className="nr__counter t-caption">
                {description.length} / {MAX_LENGTH}
              </p>
            </div>

            <div className="nr__hints">
              <div className="nr__group">
                <p className="nr__group-label t-caption">Required</p>
                {renderChips(required)}
              </div>
              <div className="nr__group">
                <p className="nr__group-label t-caption">Recommended</p>
                {renderChips(recommended)}
              </div>
            </div>

            <div className="nr__hints nr__privacy">
              <div className="nr__toggle-row">
                <span className="nr__group-label t-caption" id="nr-private-label">
                  Search only my pool
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={privatePool}
                  aria-labelledby="nr-private-label"
                  className={`nr__toggle${privatePool ? " is-on" : ""}`}
                  onClick={() => updateRequestDraft({ privatePool: !privatePool })}
                >
                  <span className="nr__knob" />
                </button>
              </div>
              {/* Figma keeps this line identical in both toggle states. */}
              <p className="nr__toggle-desc t-b3-regular">
                Private matching is Off. Candidates are sourced My Pool, Mellow and Internet. A
                public link can be generated.
              </p>
            </div>

            <Button fullWidth disabled={!canSubmit} onClick={openEditRequest}>
              Generate request
            </Button>
          </div>

          <p className="nr__footer t-b3-regular">
            Are you a contractor looking for work?{" "}
            <span className="nr__footer-link u-brand">Find projects</span>
          </p>
        </div>
      </div>
    </FullScreenModal>
  );
}
