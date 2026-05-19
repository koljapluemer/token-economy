import Dexie, { type Table, liveQuery } from 'dexie'
import { shallowRef, onUnmounted, type ShallowRef } from 'vue'

export interface Action {
  id?: number
  name: string
  tokens: number
  daily: boolean
}

export interface LoggedAction {
  id?: number
  actionId?: number
  actionName: string
  tokens: number
  timestamp: Date
}

class TokenDb extends Dexie {
  actions!: Table<Action>
  loggedActions!: Table<LoggedAction>

  constructor() {
    super('token-economy')
    this.version(1).stores({
      actions: '++id',
      loggedActions: '++id,timestamp',
    })
    this.version(2)
      .stores({
        actions: '++id,daily',
        loggedActions: '++id,timestamp,actionId',
      })
      .upgrade(async (tx) => {
        await tx.table('actions').toCollection().modify((action: Action) => {
          if (action.daily == null) {
            action.daily = false
          }
        })
      })
  }
}

export const db = new TokenDb()

export function useLiveQuery<T>(querier: () => T | Promise<T>, initial: T): ShallowRef<T> {
  const result = shallowRef<T>(initial)
  const sub = liveQuery(querier).subscribe({ next: (v) => { result.value = v } })
  onUnmounted(() => sub.unsubscribe())
  return result
}
