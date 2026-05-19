import Decimal from 'decimal.js'
import { db, useLiveQuery } from '../../db/db'

export type { LoggedAction } from '../../db/db'

export function useLoggedActions() {
  return useLiveQuery(
    () => db.loggedActions.orderBy('timestamp').reverse().toArray(),
    [] as import('../../db/db').LoggedAction[],
  )
}

export function useTodayLoggedActions() {
  return useLiveQuery(loadTodayLoggedActions, [] as import('../../db/db').LoggedAction[])
}

export function useTokenBalance() {
  return useLiveQuery(
    async () => {
      const all = await db.loggedActions.toArray()
      return all.reduce((sum, la) => sum.plus(la.tokens), new Decimal(0)).toNumber()
    },
    0,
  )
}

export async function logAction(actionId: number | undefined, actionName: string, tokens: number, daily = false) {
  if (daily && await hasLoggedActionToday(actionId, actionName)) {
    return false
  }

  return db.loggedActions.add({ actionId, actionName, tokens, timestamp: new Date() })
}

export async function deleteLoggedAction(id: number) {
  return db.loggedActions.delete(id)
}

async function loadTodayLoggedActions() {
  const todayStart = startOfDay(new Date())
  const tomorrowStart = new Date(todayStart)
  tomorrowStart.setDate(todayStart.getDate() + 1)

  return db.loggedActions
    .where('timestamp')
    .between(todayStart, tomorrowStart, true, false)
    .toArray()
}

async function hasLoggedActionToday(actionId: number | undefined, actionName: string) {
  const todayLoggedActions = await loadTodayLoggedActions()

  return todayLoggedActions.some((entry) => {
    if (actionId != null && entry.actionId != null) {
      return entry.actionId === actionId
    }

    return entry.actionName === actionName
  })
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
