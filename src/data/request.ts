import type { AiMatch, MatchChip, RequestRecord } from "../state/types";
import photoSilvia from "../assets/photos/silvia.png";
import photoClint from "../assets/photos/clint.png";

/** The request the Figma frames generate from the sample description. */
export const SEED_REQUEST: RequestRecord = {
  title: "Graphic Designer for Social Media Optimisation",
  summary:
    "We are seeking a Contractored Graphic Designer to lead the visual redesign of our social media presence and marketing materials. This project aims to enhance brand identity, improve visual appeal, and optimize graphics for engagement and clarity.",
  experience: "Mid-level",
  languages: ["English", "Spanish"],
  skills: [
    "Figma",
    "Canva",
    "Adobe Photoshop",
    "Logo Design",
    "Adobe Illustrator",
    "AI Creativity",
    "Visual Concepting",
    "Reels Creation",
  ],
  projectType: "Ongoing",
  workload: "Under 20 hours per week",
};

/* The side sheet is drawn for one worked example (28432:196047). Everything
   below the header is identical in every frame, so the blocks are shared and
   only the parts the list already varies — name, role, years, rate, score —
   differ per match. The one flag exported from the design is Georgia, so that
   is the country every match works from. */

const LINKS = ["linkedin.com", "my-portfolio.io", "behance.com"];

const EDUCATION = ["Master's degree", "California State University", "2015 – 2019"];

const SKILLS = [
  "Interaction Design",
  "Prototyping",
  "Wireframing",
  "User Research",
  "Accessibility (WCAG)",
  "Responsive Design",
  "Design Systems",
  "Figma",
  "HTML/CSS",
  "A/B Testing",
];

const WORK_EXPERIENCE: MatchChip[] = [
  { label: "Graphic Designer", meta: "2023–2025" },
  { label: "Junior Designer", meta: "2022–2023" },
  { label: "Design Intern", meta: "2021–2022" },
];

/** The breakdown sentence from the frame, with the match's own first name. */
function breakdownFor(name: string): string {
  const first = name.split(" ")[0];
  return `${first}'s portfolio shows consistent social-media-first design work and a tone that aligns with your brand voice. Pricing fits your range and they are available immediately`;
}

interface MatchSeed {
  id: string;
  name: string;
  source: AiMatch["source"];
  score: number;
  experience: string;
  rate: string | null;
  isNew: boolean;
  photo?: string;
  status: AiMatch["status"];
  /** Already in the user's Contractors: star, "Contractors" label, private matching. */
  inTalents: boolean;
}

/* Statuses are spread across the list on purpose: the sheet's CTA follows the
   state a match is already in, so the demo needs a person for each frame —
   "Invite to apply", "Send email" and "Add to Contractors" all reachable
   without clicking one person through the whole chain. */
const SEEDS: MatchSeed[] = [
  { id: "m1", name: "Ismael Bruen", source: "Mellow", score: 99, experience: "5.5 years", rate: "$45/hr", isNew: true, status: "not-invited", inTalents: true },
  { id: "m2", name: "Silvia Pagac", source: "Mellow", score: 88, experience: "1 year", rate: null, isNew: false, photo: photoSilvia, status: "not-invited", inTalents: false },
  { id: "m3", name: "Rosemary Wilderman-Crooks", source: "Mellow", score: 86, experience: "3 years", rate: "$25/hr", isNew: false, status: "invited", inTalents: true },
  { id: "m4", name: "Clint Boyle", source: "LinkedIn", score: 85, experience: "2 years", rate: null, isNew: true, photo: photoClint, status: "invited", inTalents: false },
  { id: "m5", name: "Bill Haley", source: "LinkedIn", score: 82, experience: "1 year", rate: null, isNew: true, status: "viewed", inTalents: false },
  { id: "m6", name: "Andy Stiedemann", source: "Mellow", score: 80, experience: "1 year", rate: "$32/hr", isNew: false, status: "not-invited", inTalents: false },
];

/** AI matches as listed on the Live Request frames. */
export const SEED_MATCHES: AiMatch[] = SEEDS.map((s) => ({
  ...s,
  role: "Graphic Designer",
  /** The photo doubles as the video intro, exactly as the avatar is drawn. */
  hasVideo: Boolean(s.photo),
  verdict: "Strong match",
  breakdown: breakdownFor(s.name),
  links: LINKS,
  country: "Georgia",
  education: EDUCATION,
  skills: SKILLS,
  workExperience: WORK_EXPERIENCE,
}));

export const EXPERIENCE_LEVELS = ["Junior", "Mid-level", "Senior", "Top-tier"] as const;
