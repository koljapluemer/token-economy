import { db, useLiveQuery } from '../../db/db'

export interface DailyTokenRange {
  dayKey: string
  shortLabel: string
  fullLabel: string
  openBalance: number
  closeBalance: number
  minBalance: number
  maxBalance: number
}

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
})

const fullDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function useDailyTokenRanges() {
  return useLiveQuery(loadDailyTokenRanges, [] as DailyTokenRange[])
}

async function loadDailyTokenRanges() {
  const loggedActions = await db.loggedActions.orderBy('timestamp').toArray()

  if (loggedActions.length === 0) {
    return []
  }

  const firstDay = startOfDay(loggedActions[0].timestamp)
  const today = startOfDay(new Date())
  const ranges: DailyTokenRange[] = []

  let balance = 0
  let actionIndex = 0

  for (let day = firstDay; day <= today; day = addDays(day, 1)) {
    const dayKey = toDayKey(day)
    const openBalance = balance
    let minBalance = balance
    let maxBalance = balance

    while (actionIndex < loggedActions.length && toDayKey(loggedActions[actionIndex].timestamp) === dayKey) {
      balance += loggedActions[actionIndex].tokens
      minBalance = Math.min(minBalance, balance)
      maxBalance = Math.max(maxBalance, balance)
      actionIndex += 1
    }

    ranges.push({
      dayKey,
      shortLabel: shortDateFormatter.format(day),
      fullLabel: fullDateFormatter.format(day),
      openBalance,
      closeBalance: balance,
      minBalance,
      maxBalance,
    })
  }

  return ranges
}

function startOfDay(date: Date) {
  const d = new Date(date)
  if (d.getHours() < 4) {
    d.setDate(d.getDate() - 1)
  }
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 4, 0, 0, 0)
}

function addDays(date: Date, amount: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

function toDayKey(date: Date) {
  const d = new Date(date)
  if (d.getHours() < 4) {
    d.setDate(d.getDate() - 1)
  }
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
