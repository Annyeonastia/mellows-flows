import type { AiMatch, RequestRecord } from "../state/types";

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

/** AI matches as listed on the Live Request frames. */
export const SEED_MATCHES: AiMatch[] = [
  {
    id: "m1",
    name: "Ismael Bruen",
    source: "My Pool",
    score: 99,
    role: "Graphic Designer",
    experience: "5.5 years",
    rate: "$45/hr",
    status: "not-invited",
    isNew: true,
  },
  {
    id: "m2",
    name: "Silvia Pagac",
    source: "Mellow",
    score: 88,
    role: "Graphic Designer",
    experience: "1 year",
    rate: null,
    status: "not-invited",
    isNew: false,
  },
  {
    id: "m3",
    name: "Rosemary Wilderman-Crooks",
    source: "My Pool",
    score: 86,
    role: "Graphic Designer",
    experience: "3 years",
    rate: "$25/hr",
    status: "not-invited",
    isNew: false,
  },
  {
    id: "m4",
    name: "Clint Boyle",
    source: "LinkedIn",
    score: 85,
    role: "Graphic Designer",
    experience: "2 years",
    rate: null,
    status: "not-invited",
    isNew: true,
  },
  {
    id: "m5",
    name: "Bill Haley",
    source: "LinkedIn",
    score: 82,
    role: "Graphic Designer",
    experience: "1 year",
    rate: null,
    status: "not-invited",
    isNew: true,
  },
  {
    id: "m6",
    name: "Andy Stiedemann",
    source: "Mellow",
    score: 80,
    role: "Graphic Designer",
    experience: "1 year",
    rate: "$32/hr",
    status: "not-invited",
    isNew: false,
  },
];

export const EXPERIENCE_LEVELS = ["Junior", "Mid-level", "Senior", "Top-tier"] as const;
