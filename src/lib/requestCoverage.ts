/* The "Required" / "Recommended" chips under the request field.

   In the Figma frames a chip switches to the covered (green) look once the
   description mentions that piece of information. The match is a keyword scan,
   not real language understanding — enough for the prototype to react honestly
   while the user types.

   The rules are calibrated against the "Popup - Filled" frame, where
   "Graphic designer based in the EU, up to $30/hr. Around 20 hours per week"
   lights exactly four chips: role, time commitment, budget and location. */

export type ChipGroup = "required" | "recommended";

export interface CoverageChip {
  id: string;
  label: string;
  group: ChipGroup;
  /** Case-insensitive patterns. */
  patterns: RegExp[];
  /** Patterns that must keep their case, so "US" does not match "us". */
  exact?: RegExp[];
}

export const COVERAGE_CHIPS: CoverageChip[] = [
  {
    id: "role",
    label: "Role or position",
    group: "required",
    patterns: [
      /\b(designer|developer|engineer|manager|marketer|writer|copywriter|editor|illustrator|animator|architect|consultant|specialist|producer|strategist|researcher|analyst|photographer|videographer|assistant|accountant|recruiter|translator|moderator)s?\b/i,
    ],
  },
  {
    id: "experience",
    label: "Work experience",
    group: "required",
    // "designer" must not count here, so the role noun is deliberately absent.
    patterns: [
      /\b\d+(\.\d+)?\+?\s*(years?|yrs?)\b/i,
      /\b(junior|mid[- ]level|middle|senior|top[- ]tier|entry[- ]level|seniority|experienced|experience|background in|proven track)\b/i,
    ],
  },
  {
    id: "scope",
    label: "Scope of work",
    group: "required",
    patterns: [
      /\b(redesign|rebrand|manage|managing|create|creating|develop|developing|produce|writing|editing|optimi[sz]e|optimi[sz]ation|campaign|content|deliverables?|scope|responsibilit|maintain|building|launch|audit|migration|support|workflow|tasks?)\b/i,
    ],
  },
  {
    id: "time",
    label: "Time commitment",
    group: "recommended",
    patterns: [
      /\b\d+\s*(hours?|hrs?|h)\s*(per|a|\/)\s*(week|day|month)\b/i,
      /\b(hours per week|part[- ]time|full[- ]time|days? per week|ongoing|one[- ]off)\b/i,
    ],
  },
  {
    id: "budget",
    label: "Budget / Hourly rate",
    group: "recommended",
    patterns: [
      /[$€£]\s*\d/,
      /\b\d+\s*(usd|eur|gbp)\b/i,
      /\b(per hour|hourly|\/hr|\/hour|rate|budget|salary|compensation|negotiable)\b/i,
    ],
  },
  {
    id: "skills",
    label: "Key skills",
    group: "recommended",
    patterns: [
      /\b(figma|sketch|photoshop|illustrator|indesign|canva|after effects|premiere|blender|webflow|framer|react|vue|angular|python|javascript|typescript|node|sql|excel|hubspot|salesforce)\b/i,
      /\b(skills?|proficient|proficiency|tooling|toolset)\b/i,
    ],
  },
  {
    id: "languages",
    label: "Languages",
    group: "recommended",
    patterns: [
      /\b(english|spanish|german|french|italian|portuguese|dutch|polish|russian|ukrainian|chinese|japanese|korean|arabic|turkish)\b/i,
      /\b(languages?|bilingual|fluent|native speaker)\b/i,
    ],
  },
  {
    id: "location",
    label: "Location",
    group: "recommended",
    patterns: [
      /\b(based in|located in|remote|on[- ]site|onsite|hybrid|time ?zone|relocat)\b/i,
      /\b(europe|america|asia|africa|germany|france|spain|italy|poland|portugal|netherlands|sweden|norway|ukraine|canada|mexico|brazil|india|australia|japan|england|scotland)\b/i,
    ],
    // Region codes only count when actually written as codes.
    exact: [/\b(EU|EEA|US|USA|UK|LATAM|APAC|EMEA|CET|CEST|EST|PST|GMT|UTC)\b/],
  },
  {
    id: "industry",
    label: "Industry",
    group: "recommended",
    patterns: [
      /\b(fintech|e-?commerce|saas|healthcare|health ?tech|edtech|gaming|crypto|web3|blockchain|retail|logistics|travel|marketplace|insurance|banking|real estate|nonprofit|hospitality|automotive)\b/i,
      /\b(industry|sector|b2b|b2c|vertical)\b/i,
    ],
  },
];

/** Ids of every chip the description already covers. */
export function coveredChips(text: string): Set<string> {
  const covered = new Set<string>();
  if (!text.trim()) return covered;

  for (const chip of COVERAGE_CHIPS) {
    const hit =
      chip.patterns.some((re) => re.test(text)) || (chip.exact?.some((re) => re.test(text)) ?? false);
    if (hit) covered.add(chip.id);
  }
  return covered;
}
