/**
 * Display name from an address: "john.smith@acme.com" -> "John Smith".
 * Falls back to the raw local part when it carries no separators.
 */
export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  const words = local
    .replace(/[._\-+]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return email;
  return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
