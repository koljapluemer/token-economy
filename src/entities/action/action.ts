import { db, useLiveQuery } from '../../db/db'

export type { Action } from '../../db/db'

export function useActions() {
  return useLiveQuery(() => db.actions.toArray(), [] as import('../../db/db').Action[])
}

export async function addAction(name: string, tokens: number, daily = false) {
  return db.actions.add({ name, tokens, daily })
}

export async function updateAction(id: number, changes: { name?: string; tokens?: number; daily?: boolean }) {
  return db.actions.update(id, changes)
}

export async function deleteAction(id: number) {
  return db.actions.delete(id)
}
