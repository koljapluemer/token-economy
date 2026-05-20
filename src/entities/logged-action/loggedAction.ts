import Decimal from 'decimal.js'
import { computed, onUnmounted, ref } from 'vue'
import { db, useLiveQuery } from '../../db/db'

export type { LoggedAction } from '../../db/db'

export function useLoggedActions() {
  return useLiveQuery(
    () => db.loggedActions.orderBy('timestamp').reverse().toArray(),
    [] as import('../../db/db').LoggedAction[],
  )
}

export function useTodayLoggedActions() {
  const loggedActions = useLoggedActions()
  const currentDayKey = useCurrentDayKey()

  return computed(() => {
    return loggedActions.value.filter((entry) => toDayKey(entry.timestamp) === currentDayKey.value)
  })
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

function toDayKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function useCurrentDayKey() {
  const currentDayKey = ref(toDayKey(new Date()))

  const sync = () => {
    currentDayKey.value = toDayKey(new Date())
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('focus', sync)
    document.addEventListener('visibilitychange', sync)
  }

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  })

  return currentDayKey
}
