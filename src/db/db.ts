import Dexie, { type Table, liveQuery } from 'dexie'
import { shallowRef, onUnmounted, type ShallowRef } from 'vue'

export interface Action {
  id?: number
  name: string
  tokens: number
}

export interface LoggedAction {
  id?: number
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
  }
}

export const db = new TokenDb()

export function useLiveQuery<T>(querier: () => T | Promise<T>, initial: T): ShallowRef<T> {
  const result = shallowRef<T>(initial)
  const sub = liveQuery(querier).subscribe({ next: (v) => { result.value = v } })
  onUnmounted(() => sub.unsubscribe())
  return result
}
