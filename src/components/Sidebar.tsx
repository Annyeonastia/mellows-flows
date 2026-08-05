import { FigmaIcon } from "./FigmaIcon";
import { useApp } from "../state/store";
import logoFull from "../assets/icons/logo-full.svg";
import logoSignL from "../assets/icons/logo-sign-l.svg";
import logoSignR from "../assets/icons/logo-sign-r.svg";
import navDashboard from "../assets/icons/nav-dashboard.svg";
import navRequests from "../assets/icons/nav-requests.svg";
import navContractors from "../assets/icons/nav-contractors.svg";
import "./Sidebar.css";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: navDashboard },
  { id: "requests", label: "Requests", icon: navRequests },
  { id: "contractors", label: "Contractors", icon: navContractors },
] as const;

interface SidebarProps {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export function Sidebar({ expanded, onExpandedChange }: SidebarProps) {
  const { screen, goTo, goToContractors } = useApp();

  // Contractors owns both the empty state and the table.
  const active =
    screen === "dashboard" || screen === "requests" ? screen : "contractors";

  return (
    <nav
      className={`sidebar ${expanded ? "sidebar--expanded" : "sidebar--collapsed"}`}
      aria-label="Main"
      onMouseEnter={() => onExpandedChange(true)}
      onMouseLeave={() => onExpandedChange(false)}
    >
      <div className="sidebar__top">
        <div className="sidebar__logo">
          {expanded ? (
            <img className="sidebar__logo-full" src={logoFull} alt="Scout" />
          ) : (
            <span className="sidebar__logo-sign" role="img" aria-label="Scout">
              <img className="sidebar__logo-sign-l" src={logoSignL} alt="" />
              <img className="sidebar__logo-sign-r" src={logoSignR} alt="" />
            </span>
          )}
        </div>

        <ul className="sidebar__nav">
          {NAV.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`sidebar__item ${item.id === active ? "is-active" : ""}`}
                aria-current={item.id === active ? "page" : undefined}
                onClick={() =>
                  item.id === "contractors" ? goToContractors() : goTo(item.id)
                }
              >
                <FigmaIcon
                  src={item.icon}
                  size={20}
                  inset={
                    item.id === "contractors" ? [12.5, 8.07, 9.71, 12.5] : [12.5, 12.5, 12.5, 12.5]
                  }
                  expand={item.id === "contractors" ? [4.82, 4.72] : [5, 5]}
                />
                {expanded && <span className="sidebar__label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
