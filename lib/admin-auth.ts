export const DEFAULT_ADMIN_EMAILS = [
  "ahmedpolash732@gmail.com",
  "talk.polsh@gmail.com",
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const envAdmins = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
    : [];
  const allowed = [...DEFAULT_ADMIN_EMAILS, ...envAdmins].map((e) =>
    e.toLowerCase()
  );
  return allowed.includes(email.toLowerCase());
}
