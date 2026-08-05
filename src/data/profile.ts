import type { Contractor } from "../state/types";

/* Prototype filler for the profile drawer.
 *
 * Links, skills and the activity feed have no home in the Contractor model yet,
 * so they are derived from what the row already knows. Deterministic: the same
 * contractor always shows the same profile, which keeps a demo repeatable.
 * Replace this file with real data when the drawer stops being a mockup. */

export interface ProfileLink {
  label: string;
  href: string;
}

export interface ActivityEntry {
  id: string;
  /** Drives the avatar: the account holder or the contractor. */
  actor: "you" | "contractor";
  initials: string;
  text: string;
  /** Trailing accent link, e.g. the request the contractor applied to. */
  link?: string;
  /** dd.mm.yyyy, as printed everywhere else in the design. */
  date: string;
}

const SKILLS_BY_ROLE: Record<string, string[]> = {
  "Product Design": [
    "Interaction Design",
    "Prototyping",
    "Wireframing",
    "User Research",
    "Accessibility (WCAG)",
    "Responsive Design",
    "Design Systems",
  ],
  "Brand Designer": ["Identity", "Typography", "Art Direction", "Packaging", "Illustration"],
  "Motion Designer": ["After Effects", "Rive", "Storyboarding", "3D", "Micro-interactions"],
  "UX Researcher": [
    "Discovery",
    "Usability Testing",
    "Interviews",
    "Survey Design",
    "Synthesis",
  ],
  "Frontend Developer": ["React", "TypeScript", "CSS Architecture", "Accessibility", "Testing"],
  "QA Engineer": ["Test Plans", "Automation", "Regression", "Bug Triage", "Playwright"],
  "Data Analyst": ["SQL", "Dashboards", "Experimentation", "Reporting", "Python"],
  Copywriter: ["Long-form", "Tone of Voice", "Editing", "SEO", "Storytelling"],
  "Content Writer": ["Research", "Editing", "SEO", "Content Strategy"],
  "Digital Marketer": ["Paid Social", "Analytics", "Funnels", "Email", "Positioning"],
  "PPC Manager": ["Google Ads", "Bid Strategy", "Audience Research", "Reporting"],
  "Social Media Manager": ["Content Planning", "Community", "Analytics", "Copywriting"],
  "Human Response Agent": ["Customer Support", "Escalations", "CRM", "Written Comms"],
};

const FALLBACK_SKILLS = ["Remote Collaboration", "Async Communication", "Time Management"];

const REQUESTS = [
  "Packaging design for skincare line",
  "Landing page for a fintech launch",
  "Onboarding flow redesign",
  "Brand refresh for a travel app",
];

/** Stable small hash so every derived choice is repeatable per contractor. */
function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function initialsOf(c: Contractor): string {
  const parts = c.name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (c.email ?? "?").slice(0, 2).toUpperCase();
}

export function firstNameOf(c: Contractor): string {
  return c.name.trim().split(/\s+/)[0] || "This contractor";
}

export function skillsOf(c: Contractor): string[] {
  if (!c.role) return [];
  return SKILLS_BY_ROLE[c.role] ?? FALLBACK_SKILLS;
}

export function linksOf(c: Contractor): ProfileLink[] {
  // Nothing to build a handle from, and nothing invented for placeholder rows.
  if (!c.name) return [];
  const handle = c.name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
  const links: ProfileLink[] = [{ label: "linkedin.com", href: `https://linkedin.com/in/${handle}` }];

  const isDesign = /design|brand|motion|ux/i.test(c.role ?? "");
  if (isDesign) {
    links.push({ label: `${handle.split("-")[0]}-portfolio.io`, href: "https://example.com" });
    links.push({ label: "behance.com", href: `https://behance.net/${handle}` });
  } else if (/developer|engineer/i.test(c.role ?? "")) {
    links.push({ label: "github.com", href: `https://github.com/${handle}` });
  }
  return links;
}

/** Newest first — the drawer groups these by month in that order. */
export function activityOf(c: Contractor): ActivityEntry[] {
  const who = firstNameOf(c);
  const you = "JM";
  const mine = initialsOf(c);
  const out: ActivityEntry[] = [];

  if (c.inMatches && c.status !== "missing-info") {
    out.push({
      id: `${c.id}-applied`,
      actor: "contractor",
      initials: mine,
      text: `${who} applied to `,
      link: REQUESTS[hash(c.id) % REQUESTS.length],
      date: shift(c.added, 5),
    });
  }

  if (c.status !== "missing-info") {
    out.push({
      id: `${c.id}-invited`,
      actor: "you",
      initials: you,
      text: `You invited ${who} to complete scoring`,
      date: c.added,
    });
  }

  out.push({
    id: `${c.id}-imported`,
    actor: "you",
    initials: you,
    text: `You imported ${who} ${c.source}`,
    date: c.added,
  });

  return out;
}

/** dd.mm.yyyy + n days, staying in the same string format. */
function shift(dmy: string, days: number): string {
  const [d, m, y] = dmy.split(".").map(Number);
  const at = new Date(y, m - 1, d + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(at.getDate())}.${pad(at.getMonth() + 1)}.${at.getFullYear()}`;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthLabel(dmy: string): string {
  const [, m, y] = dmy.split(".").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}
