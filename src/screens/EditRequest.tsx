import { Button } from "../components/Button";
import { EXPERIENCE_LEVELS } from "../data/request";
import { useApp } from "../state/store";
import type { ExperienceLevel } from "../state/types";
import iconUser from "../assets/icons/icon-user-20.svg";
import iconInfo from "../assets/icons/icon-info-20.svg";
import iconX from "../assets/icons/icon-x-clear.svg";
import arrowLeft from "../assets/icons/icon-arrow-left-20.svg";
import logoSignL from "../assets/icons/logo-sign-l.svg";
import logoSignR from "../assets/icons/logo-sign-r.svg";
import "./EditRequest.css";

/**
 * "Edit - Public request" / "Edit - Private ON" (28328:286048 / 28328:286942):
 * the generated request, reviewed before it goes live. Back returns to the
 * still-filled popup; Publish changes creates the request.
 */
export function EditRequest() {
  const { request, updateRequest, requestDraft, updateRequestDraft, backToNewRequest, publishRequest } =
    useApp();
  const isPrivate = requestDraft.privatePool;

  return (
    <div className="er">
      <header className="er__header">
        <div className="er__header-left">
          <button type="button" className="er__back" onClick={backToNewRequest} aria-label="Back">
            <img src={arrowLeft} alt="" aria-hidden="true" />
          </button>
          <h1 className="t-accent-h5">Edit Request</h1>
        </div>
        <div className="er__header-right">
          <button type="button" className="er__preview-link t-b1-regular u-brand">
            Desktop preview
          </button>
          <Button onClick={publishRequest}>Publish changes</Button>
        </div>
      </header>

      <div className="er__body">
        <div className="er__col-form">
          <div className={`er__controls${isPrivate ? " is-on" : ""}`}>
            <button
              type="button"
              role="switch"
              aria-checked={isPrivate}
              aria-labelledby="er-private"
              className={`er__toggle${isPrivate ? " is-on" : ""}`}
              onClick={() => updateRequestDraft({ privatePool: !isPrivate })}
            >
              <span className="er__knob" />
            </button>
            <span id="er-private" className="t-b1-medium">
              Private request
            </span>
          </div>

          {isPrivate && (
            <p className="er__alert t-b3-medium">
              <img src={iconInfo} alt="" aria-hidden="true" />
              Once you will publish changes your request become private: promotion will disappear,
              but all your AI Matches will keep
            </p>
          )}

          <section className="er__card">
            <div className="er__card-head">
              <span className="er__card-icon">
                <img src={iconUser} alt="" aria-hidden="true" />
              </span>
              <h2 className="t-b1-medium">Candidate</h2>
              <button type="button" className="er__cancel t-b2-regular u-secondary">
                Cancel
              </button>
            </div>

            <label className="er__field">
              <span className="t-b3-regular u-secondary">Role</span>
              <input
                className="er__input t-b2-regular"
                value={request.title}
                onChange={(e) => updateRequest({ title: e.target.value })}
              />
            </label>

            <div className="er__field">
              <span className="t-b3-regular u-secondary">Experience level</span>
              <div className="er__tiles">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    role="radio"
                    aria-checked={request.experience === level}
                    className={`er__tile${request.experience === level ? " is-on" : ""}`}
                    onClick={() => updateRequest({ experience: level as ExperienceLevel })}
                  >
                    <span className="er__radio" />
                    <span className="t-b2-regular">{level}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="er__field">
              <span className="t-b3-regular u-secondary">Languages required</span>
              <div className="er__multiselect">
                {request.languages.map((lang) => (
                  <span key={lang} className="er__chip t-b3-regular">
                    {lang}
                    <button
                      type="button"
                      aria-label={`Remove ${lang}`}
                      onClick={() =>
                        updateRequest({ languages: request.languages.filter((l) => l !== lang) })
                      }
                    >
                      <img src={iconX} alt="" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="er__field">
              <span className="t-b1-medium">Skills and Tools</span>
              <div className="er__skills">
                {request.skills.map((skill) => (
                  <span key={skill} className="er__chip t-b3-regular">
                    {skill}
                    <button
                      type="button"
                      aria-label={`Remove ${skill}`}
                      onClick={() =>
                        updateRequest({ skills: request.skills.filter((s) => s !== skill) })
                      }
                    >
                      <img src={iconX} alt="" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Mobile Preview / Frame — how the contractor sees the request. */}
        <aside className="er__col-preview">
          <div className="er__phone">
            <span className="er__phone-logo" role="img" aria-label="Scout">
              <img src={logoSignL} alt="" />
              <img src={logoSignR} alt="" />
            </span>
            <div className="er__phone-card">
              <h3 className="t-accent-h5">{request.title}</h3>
              <p className="t-b2-regular er__phone-summary">{request.summary}</p>
              <button type="button" className="er__show-more t-b2-regular">
                Show more
              </button>

              <p className="er__phone-label t-caption">Experience level</p>
              <div className="er__skills">
                <span className="er__chip is-static t-b3-regular">{request.experience}</span>
              </div>

              <p className="er__phone-label t-caption">Skills and tools</p>
              <div className="er__skills">
                {request.skills.slice(0, 3).map((s) => (
                  <span key={s} className="er__chip is-static t-b3-regular">
                    {s}
                  </span>
                ))}
                {request.skills.length > 3 && (
                  <span className="er__chip is-outline t-b3-regular">
                    + {request.skills.length - 3} more
                  </span>
                )}
              </div>

              <p className="er__phone-label t-caption">Languages required</p>
              <div className="er__skills">
                {request.languages.map((l) => (
                  <span key={l} className="er__chip is-static t-b3-regular">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="er__phone-card">
              <p className="t-b2-regular u-secondary">
                Project type: <span className="er__phone-value">{request.projectType}</span>
              </p>
              <p className="t-b2-regular u-secondary">
                Workload: <span className="er__phone-value">{request.workload}</span>
              </p>
              {isPrivate && (
                <p className="t-b3-regular u-secondary">
                  Private request — shared by link only, no promotion.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
