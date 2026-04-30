import { db, useLiveQuery } from '../../db/db'

export interface DailyTokenRange {
  dayKey: string
  shortLabel: string
  fullLabel: string
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
      minBalance,
      maxBalance,
    })
  }

  return ranges
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, amount: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

function toDayKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
