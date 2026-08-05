import { useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { Intercom } from "./components/Intercom";
import { Sidebar } from "./components/Sidebar";
import { EmptyState } from "./screens/EmptyState";
import { ContractorPool } from "./screens/ContractorPool";
import { ContractorProfile } from "./screens/ContractorProfile";
import { SectionPlaceholder } from "./screens/SectionPlaceholder";
import { UploadCvsFlow } from "./flows/UploadCvsFlow";
import { AddEmailsFlow } from "./flows/AddEmailsFlow";
import { InvitedModal } from "./flows/InvitedModal";
import { DeleteContractorModal } from "./flows/DeleteContractorModal";
import { DeleteManyModal } from "./flows/DeleteManyModal";
import { MissingInfoModal } from "./flows/MissingInfoModal";
import { NewRequestFlow } from "./flows/NewRequestFlow";
import { AppProvider, useApp } from "./state/store";
import { IllustrationGallery } from "./dev/IllustrationGallery";
import "./App.css";

/** Beat before the intro collapse, so the expanded menu is readable first. */
const INTRO_COLLAPSE_MS = 1400;

function Shell() {
  const { screen, overlay, menuExpanded, setMenuExpanded } = useApp();
  const introDone = useRef(false);
  const hovering = useRef(false);

  // Screen 1 -> Screen 2: open with the menu expanded, then collapse it once so
  // the transition is demonstrated. After that the menu follows the pointer.
  useEffect(() => {
    if (introDone.current) return;
    const id = window.setTimeout(() => {
      introDone.current = true;
      if (!hovering.current) setMenuExpanded(false);
    }, INTRO_COLLAPSE_MS);
    return () => clearTimeout(id);
  }, [setMenuExpanded]);

  const handleExpandedChange = (expanded: boolean) => {
    hovering.current = expanded;
    // Ignore hover-out until the intro collapse has run, or the menu would
    // snap shut the moment the pointer crosses it on load.
    if (!introDone.current && !expanded) return;
    setMenuExpanded(expanded);
  };

  return (
    <div className="app">
      <Sidebar expanded={menuExpanded} onExpandedChange={handleExpandedChange} />

      <main className="app__main">
        {screen === "empty" && (
          <>
            <Header />
            <EmptyState />
          </>
        )}
        {screen === "pool" && <ContractorPool />}
        {(screen === "dashboard" || screen === "requests") && (
          <SectionPlaceholder section={screen} />
        )}
      </main>

      <Intercom />

      {overlay.kind === "upload-cvs" && <UploadCvsFlow />}
      {overlay.kind === "add-emails" && <AddEmailsFlow />}
      {overlay.kind === "invited" && <InvitedModal count={overlay.count} />}
      {overlay.kind === "delete-contractor" && <DeleteContractorModal id={overlay.id} />}
      {overlay.kind === "delete-many" && <DeleteManyModal ids={overlay.ids} />}
      {overlay.kind === "missing-info" && <MissingInfoModal id={overlay.id} />}
      {overlay.kind === "profile" && <ContractorProfile id={overlay.id} />}
      {overlay.kind === "new-request" && <NewRequestFlow />}
    </div>
  );
}

export default function App() {
  // Dev aid: #gallery renders the artwork on its own for visual checks.
  if (window.location.hash === "#gallery") return <IllustrationGallery />;

  // Dev aid: #pool skips the import flow and opens on the filled table.
  return (
    <AppProvider initialScreen={window.location.hash === "#pool" ? "pool" : "empty"}>
      <Shell />
    </AppProvider>
  );
}
