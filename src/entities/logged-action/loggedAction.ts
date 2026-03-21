import { db, useLiveQuery } from '../../db/db'

export type { LoggedAction } from '../../db/db'

export function useLoggedActions() {
  return useLiveQuery(
    () => db.loggedActions.orderBy('timestamp').reverse().toArray(),
    [] as import('../../db/db').LoggedAction[],
  )
}

export function useTokenBalance() {
  return useLiveQuery(
    async () => {
      const all = await db.loggedActions.toArray()
      return all.reduce((sum, la) => sum + la.tokens, 0)
    },
    0,
  )
}

export async function logAction(actionName: string, tokens: number) {
  return db.loggedActions.add({ actionName, tokens, timestamp: new Date() })
}

export async function deleteLoggedAction(id: number) {
  return db.loggedActions.delete(id)
}
