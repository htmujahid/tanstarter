function toDate(value: string | Date): Date {
  if (value instanceof Date) return value

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
