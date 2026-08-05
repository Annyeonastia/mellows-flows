import { useEffect, useState, type ReactNode } from "react";
import { FigmaIcon } from "./FigmaIcon";
import { useApp } from "../state/store";
import chevronDown from "../assets/icons/chevron-down.svg";
import avatarOval from "../assets/icons/avatar-oval.svg";
import iconSparkles from "../assets/icons/icon-sparkles.svg";
import "./Header.css";

interface HeaderProps {
  /** Accent-font page title. Omitted on the empty state. */
  title?: string;
  /** Action row rendered under the title. */
  actions?: ReactNode;
  /** "Generate request" pill — present on the pool, absent on the empty state. */
  showGenerate?: boolean;
}

type HeaderMenu = "product" | "profile" | null;

export function Header({ title, actions, showGenerate = false }: HeaderProps) {
  const { goTo, notify } = useApp();
  const [menu, setMenu] = useState<HeaderMenu>(null);

  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".header__menu-wrap")) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <header className={`header ${title ? "" : "header--bare"}`}>
      <div className="header__row">
        {title ? <h1 className="header__title t-accent-h3">{title}</h1> : <span />}

        <div className="header__right">
          {showGenerate && (
            <button
              type="button"
              className="header__generate"
              onClick={() => goTo("requests")}
            >
              <FigmaIcon
                src={iconSparkles}
                size={16}
                inset={[8.33, 8.33, 8.33, 8.33]}
                expand={[5.63, 5.63]}
              />
              <span className="t-b3-medium">Generate request</span>
            </button>
          )}

          <div className="header__menu-wrap">
            <button
              type="button"
              className="header__product"
              aria-haspopup="menu"
              aria-expanded={menu === "product"}
              onClick={() => setMenu((m) => (m === "product" ? null : "product"))}
            >
              <span className="t-b3-medium">AI Scout</span>
              <FigmaIcon
                src={chevronDown}
                size={16}
                inset={[37.5, 25, 37.5, 25]}
                expand={[18.75, 9.38]}
              />
            </button>

            {menu === "product" && (
              <div className="header__menu row-menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className="row-menu__item t-b2-regular is-current"
                  onClick={() => setMenu(null)}
                >
                  AI Scout
                </button>
                <p className="header__menu-note t-b3-regular u-secondary">
                  Other products aren’t part of this prototype.
                </p>
              </div>
            )}
          </div>

          <div className="header__menu-wrap">
            <button
              type="button"
              className="header__profile"
              aria-label="Account: JM"
              aria-haspopup="menu"
              aria-expanded={menu === "profile"}
              onClick={() => setMenu((m) => (m === "profile" ? null : "profile"))}
            >
              <img className="header__profile-bg" src={avatarOval} alt="" aria-hidden="true" />
              <span className="header__profile-initials">JM</span>
            </button>

            {menu === "profile" && (
              <div className="header__menu row-menu" role="menu">
                <span className="header__menu-head">
                  <span className="t-b2-regular">Jamie Moore</span>
                  <span className="t-b3-regular u-secondary">jamie@company.com</span>
                </span>
                <button
                  type="button"
                  role="menuitem"
                  className="row-menu__item t-b2-regular"
                  onClick={() => {
                    setMenu(null);
                    notify("Account settings aren’t part of this prototype");
                  }}
                >
                  Account settings
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="row-menu__item t-b2-regular"
                  onClick={() => {
                    setMenu(null);
                    notify("Signed out — this prototype has no accounts");
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {actions && <div className="header__actions">{actions}</div>}
    </header>
  );
}
