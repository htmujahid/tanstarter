/**
 * Explicit UTC avoids server/client hydration mismatches for
 * suspense-rendered (SSR) timestamps: without a fixed timezone,
 * `toLocaleString()`/`toLocaleDateString()` format using the runtime's
 * default timezone, which differs between the server (Cloudflare Workers,
 * UTC) and the visitor's browser.
 */
function toDate(value: string | Date): Date {
  if (value instanceof Date) return value

  // SQLite `current_timestamp` values look like "2026-09-20 04:56:46" —
  // space-separated, no timezone marker, but always UTC. Normalize to a
  // proper ISO string so parsing doesn't depend on the runtime's default.
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(value)
    ? `${value.replace(' ', 'T')}Z`
    : value

  return new Date(normalized)
}

export function formatDateTime(value: string | Date) {
  return `${toDate(value).toLocaleString(undefined, { timeZone: 'UTC' })} UTC`
}

export function formatDate(value: string | Date) {
  return `${toDate(value).toLocaleDateString(undefined, { timeZone: 'UTC' })} UTC`
}
