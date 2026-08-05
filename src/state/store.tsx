import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Contractor, ContractorStatus, FlowOrigin, Overlay, Screen } from "./types";
import { SEED_CONTRACTORS } from "../data/contractors";

/* Session-local state only — no backend. Everything a user does inside a flow
   (imports, invites, deletions, edits) persists for the life of the tab, which
   is what the prototype needs to demonstrate the flows end to end. */

let seq = 0;
const nextId = () => `c${++seq}`;

const TOAST_MS = 2400;

/** dd.mm.yyyy — the format printed in the "Added" column. */
function todayLabel(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

interface AppState {
  screen: Screen;
  overlay: Overlay;
  flowOrigin: FlowOrigin;
  contractors: Contractor[];
  menuExpanded: boolean;
  /** Single transient snackbar message, or null when nothing is showing. */
  toast: string | null;
}

interface AppActions {
  setMenuExpanded: (expanded: boolean) => void;
  openUploadCvs: (origin: FlowOrigin) => void;
  openAddEmails: (origin: FlowOrigin) => void;
  closeOverlay: () => void;
  /** Cancels a flow: no data changes, user goes back where they came from. */
  cancelFlow: () => void;
  /** Commits imported contractors and swaps to the success modal. */
  addContractors: (input: NewContractor[], opts?: AddOptions) => void;
  /** Dismisses the success modal and lands on the pool table. */
  finishInvite: () => void;
  removeContractor: (id: string) => void;
  removeContractors: (ids: string[]) => void;
  openDeleteMany: (ids: string[]) => void;
  updateContractor: (id: string, patch: Partial<Contractor>) => void;
  openDeleteContractor: (id: string) => void;
  openMissingInfo: (id: string) => void;
  openProfile: (id: string) => void;
  /** Sidebar / header navigation between top-level sections. */
  goTo: (screen: Screen) => void;
  /** Returns to whichever Contractors screen the user last saw. */
  goToContractors: () => void;
  /** Shows the snackbar; it clears itself after a few seconds. */
  notify: (message: string) => void;
  dismissToast: () => void;
}

export interface AddOptions {
  /** `none` skips the success modal — the caller shows a snack instead. */
  announce?: "modal" | "none";
}

export interface NewContractor {
  name: string;
  email: string | null;
  hasCv: boolean;
  status?: ContractorStatus;
  role?: string | null;
  seniority?: string | null;
  location?: string | null;
  rate?: string | null;
}

const Ctx = createContext<(AppState & AppActions) | null>(null);

export function AppProvider({
  children,
  initialScreen = "empty",
}: {
  children: ReactNode;
  /** Dev aid: #pool opens straight on the table instead of the empty state. */
  initialScreen?: Screen;
}) {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [overlay, setOverlay] = useState<Overlay>({ kind: "none" });
  const [flowOrigin, setFlowOrigin] = useState<FlowOrigin>("empty-collapsed");
  const [contractors, setContractors] = useState<Contractor[]>(SEED_CONTRACTORS);
  const [menuExpanded, setMenuExpanded] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const openUploadCvs = useCallback((origin: FlowOrigin) => {
    setFlowOrigin(origin);
    setOverlay({ kind: "upload-cvs" });
  }, []);

  const openAddEmails = useCallback((origin: FlowOrigin) => {
    setFlowOrigin(origin);
    setOverlay({ kind: "add-emails" });
  }, []);

  const closeOverlay = useCallback(() => setOverlay({ kind: "none" }), []);

  const cancelFlow = useCallback(() => {
    setOverlay({ kind: "none" });
    setScreen(flowOrigin === "pool" ? "pool" : "empty");
  }, [flowOrigin]);

  const addContractors = useCallback((input: NewContractor[], opts?: AddOptions) => {
    setContractors((prev) => [
      ...input.map<Contractor>((c) => ({
        id: nextId(),
        name: c.name,
        email: c.email,
        hasCv: c.hasCv,
        status: c.status ?? "invitation-sent",
        role: c.role ?? null,
        seniority: c.seniority ?? null,
        location: c.location ?? null,
        flag: null,
        rate: c.rate ?? null,
        notes: null,
        inMatches: true,
        added: todayLabel(),
        source: c.hasCv ? "from CV" : "from email invite",
        addedAt: Date.now(),
      })),
      ...prev,
    ]);
    // The pool is the screen the success modal belongs on: the import has
    // already happened, so the page underneath must show its result rather
    // than whatever the user started from.
    setScreen("pool");
    // Upload CVs ends on the "All Invited" modal; Add emails lands straight on
    // the table and announces itself with a snack, so it opts out here.
    setOverlay(
      opts?.announce === "none" ? { kind: "none" } : { kind: "invited", count: input.length },
    );
  }, []);

  /** Only dismisses the modal — the pool underneath is already up to date. */
  const finishInvite = useCallback(() => {
    setOverlay({ kind: "none" });
  }, []);

  const removeContractor = useCallback((id: string) => {
    setContractors((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const removeContractors = useCallback((ids: string[]) => {
    const drop = new Set(ids);
    setContractors((prev) => prev.filter((c) => !drop.has(c.id)));
  }, []);

  const openDeleteMany = useCallback(
    (ids: string[]) => setOverlay({ kind: "delete-many", ids }),
    [],
  );

  const updateContractor = useCallback((id: string, patch: Partial<Contractor>) => {
    setContractors((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const openDeleteContractor = useCallback(
    (id: string) => setOverlay({ kind: "delete-contractor", id }),
    [],
  );

  const openMissingInfo = useCallback(
    (id: string) => setOverlay({ kind: "missing-info", id }),
    [],
  );

  const openProfile = useCallback((id: string) => setOverlay({ kind: "profile", id }), []);

  const goTo = useCallback((next: Screen) => {
    setOverlay({ kind: "none" });
    setScreen(next);
  }, []);

  // Leaving the Contractors section and coming back should land where the user
  // was — the empty state before the first import, the table afterwards.
  const lastContractorsScreen = useRef<Screen>(initialScreen === "pool" ? "pool" : "empty");
  useEffect(() => {
    if (screen === "empty" || screen === "pool") lastContractorsScreen.current = screen;
  }, [screen]);

  const goToContractors = useCallback(() => goTo(lastContractorsScreen.current), [goTo]);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  const value = useMemo(
    () => ({
      screen,
      overlay,
      flowOrigin,
      contractors,
      menuExpanded,
      toast,
      setMenuExpanded,
      openUploadCvs,
      openAddEmails,
      closeOverlay,
      cancelFlow,
      addContractors,
      finishInvite,
      removeContractor,
      removeContractors,
      openDeleteMany,
      updateContractor,
      openDeleteContractor,
      openMissingInfo,
      openProfile,
      goTo,
      goToContractors,
      notify,
      dismissToast,
    }),
    [
      screen,
      overlay,
      flowOrigin,
      contractors,
      menuExpanded,
      toast,
      openUploadCvs,
      openAddEmails,
      closeOverlay,
      cancelFlow,
      addContractors,
      finishInvite,
      removeContractor,
      removeContractors,
      openDeleteMany,
      updateContractor,
      openDeleteContractor,
      openMissingInfo,
      openProfile,
      goTo,
      goToContractors,
      notify,
      dismissToast,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
