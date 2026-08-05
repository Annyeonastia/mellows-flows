import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useApp } from "../state/store";
import "./SectionPlaceholder.css";

/* Dashboard and Requests are real destinations in the sidebar but were never
   designed for this prototype. Rather than leaving the nav items dead, they
   land here — the page chrome is the real thing, and the body says plainly
   what is and isn't built. */

const COPY: Record<string, { title: string; text: string }> = {
  dashboard: {
    title: "Dashboard",
    text: "The dashboard isn’t part of this prototype. Contractor Pool is the section that’s built out.",
  },
  requests: {
    title: "Requests",
    text: "Requests aren’t part of this prototype yet. Contractor Pool is the section that’s built out.",
  },
};

export function SectionPlaceholder({ section }: { section: "dashboard" | "requests" }) {
  const { goTo } = useApp();
  const copy = COPY[section];

  return (
    <>
      <Header title={copy.title} />

      <div className="section-placeholder">
        <p className="section-placeholder__text t-b1-regular u-secondary">{copy.text}</p>
        <Button size="md" variant="secondary" onClick={() => goTo("pool")}>
          Go to Contractor Pool
        </Button>
      </div>
    </>
  );
}
