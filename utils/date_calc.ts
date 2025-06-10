// utils/dates.ts

export function getNextFridayNoon(): string {
  const now = new Date()
  const day = now.getDay()
  const daysUntilFriday = (5 - day + 7) % 7 || 7
  const nextFriday = new Date(now)
  nextFriday.setDate(now.getDate() + daysUntilFriday)
  nextFriday.setUTCHours(12, 0, 0, 0)
  return nextFriday.toISOString()
}
