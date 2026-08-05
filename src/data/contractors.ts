import type { Contractor } from "../state/types";

let seedSeq = 0;

/**
 * Seed pool matching the Figma "Default" frame (20 rows, "Showing 1-20 of 20").
 * Newly imported contractors are prepended to this list at runtime.
 */
export const SEED_CONTRACTORS: Contractor[] = [
  row("Juana Sporer", "juana_sporer@gmail.com", "United States", "🇺🇸", "scored", "Human Response Agent", null, "$50", null, true, "07.06.2026", "from email invite"),
  row("Jessica Martinez", "jessica.martinez@gmail.com", null, null, "invitation-sent", "Product Design", "5.5 years", "$25", "Strong visual sense, quick turnaround on concepts", true, "06.06.2026", "from CV"),
  row("Sophie Müller", "sophie.mueller@gmail.com", "Sweden", "🇸🇪", "scored", "Content Writer", "2 years", null, null, true, "05.06.2026", "from request"),
  row("Liam O'Connell", "liam.oconnell@gmail.com", "Japan", "🇯🇵", "scored", "Digital Marketer", null, null, "Great communicator, prefers long-term engagements", true, "04.06.2026", "from CV"),
  row(null, "hana.takahashi@gmail", null, null, "missing-info", null, null, null, null, false, "03.06.2026", "from email invite"),
  row("Lucas Silva", "lucas.silva@gmail.com", "France", "🇫🇷", "invitation-viewed", "Product Design", "2 years", null, null, true, "02.06.2026", "from request"),
  row("Isabella Rossi", "isabella.rossi@outlook.com", "Italy", "🇮🇹", "invitation-sent", "PPC Manager", "1 year", "$75", "Worked with us in 2023", true, "01.06.2026", "from email invite"),
  row("Ethan Clarke", "ethan.clarke@gmail.com", "Spain", "🇪🇸", "invitation-sent", "Social Media Manager", "6.5 years", "$80", "Prefers async work, no calls before noon", true, "31.05.2026", "from CV"),
  row(null, "chloe.dubois@yahoo.com", null, null, "invitation-viewed", null, null, null, "Junior level, needs mentoring on client comms", false, "30.05.2026", "from email invite"),
  row("Diego Fernandez", "diego.fernandez@gmail.com", "United Kingdom", "🇬🇧", "invitation-viewed", "Data Analyst", "12 years", "$90", null, true, "29.05.2026", "from email invite"),
  row("Amara Okafor", "amara.okafor@gmail.com", "Nigeria", "🇳🇬", "scored", "Brand Designer", "4 years", "$45", "Portfolio heavy on fintech", true, "28.05.2026", "from CV"),
  row("Nils Andersson", "nils.andersson@proton.me", "Norway", "🇳🇴", "invitation-sent", "Motion Designer", "3 years", "$60", null, true, "27.05.2026", "from CV"),
  row(null, "p.novak@seznam.cz", null, null, "missing-info", null, null, null, null, false, "26.05.2026", "from email invite"),
  row("Mei Lin", "mei.lin@gmail.com", "Singapore", "🇸🇬", "scored", "UX Researcher", "7 years", "$70", "Ran discovery for two of our 2025 requests", true, "25.05.2026", "from request"),
  row("Tomás Herrera", "tomas.herrera@gmail.com", "Mexico", "🇲🇽", "invitation-viewed", "Frontend Developer", "5 years", "$65", null, true, "24.05.2026", "from CV"),
  row("Freya Lund", "freya.lund@outlook.com", "Denmark", "🇩🇰", "invitation-sent", "Copywriter", "8 years", "$55", "Long-form specialist", true, "23.05.2026", "from email invite"),
  row("Rohan Mehta", "rohan.mehta@gmail.com", "India", "🇮🇳", "scored", "Product Design", "6 years", "$40", null, true, "22.05.2026", "from request"),
  row(null, "l.bianchi@libero.it", null, null, "missing-info", null, null, null, "Referred by Isabella", false, "21.05.2026", "from email invite"),
  row("Zofia Kowalski", "zofia.kowalski@gmail.com", "Poland", "🇵🇱", "invitation-viewed", "QA Engineer", "9 years", "$50", null, true, "20.05.2026", "from CV"),
  row("Kofi Mensah", "kofi.mensah@gmail.com", "Ghana", "🇬🇭", "invitation-sent", "Data Analyst", "2 years", "$35", "Available from July", true, "19.05.2026", "from request"),
];

function row(
  name: string | null,
  email: string,
  location: string | null,
  flag: string | null,
  status: Contractor["status"],
  role: string | null,
  seniority: string | null,
  rate: string | null,
  notes: string | null,
  inMatches: boolean,
  added: string,
  source: string,
): Contractor {
  return {
    id: `seed${++seedSeq}`,
    name: name ?? "",
    email,
    hasCv: source === "from CV",
    status,
    role,
    seniority,
    location,
    rate,
    notes,
    addedAt: 0,
    flag,
    inMatches,
    added,
    source,
  };
}
