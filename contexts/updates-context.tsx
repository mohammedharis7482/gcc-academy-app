import { createContext, Dispatch, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

import { updatesService } from '@/services/updates-service';
import { AcademyCommunicationUpdate, UpdatesAction, UpdatesState } from '@/types/updates';
import { readStoredValue, storageKeys, writeStoredValue } from '@/utils/app-storage';

interface UpdatesContextValue {
  readonly updates: readonly AcademyCommunicationUpdate[];
  readonly status: UpdatesState['status'];
  readonly unreadCount: number;
  isRead: (updateId: string) => boolean;
  markRead: (updateId: string) => void;
  markAllRead: () => void;
  resetReadState: () => void;
  retry: () => void;
}

const initialState: UpdatesState = { updates: [], readIds: new Set<string>(), status: 'loading' };

function updatesReducer(state: UpdatesState, action: UpdatesAction): UpdatesState {
  switch (action.type) {
    case 'loading': return { ...state, status: 'loading' };
    case 'load-error': return { ...state, status: 'error' };
    case 'load-success': return { updates: action.updates, status: 'ready', readIds: new Set([...state.readIds, ...action.updates.filter((item) => item.initiallyRead).map((item) => item.id)]) };
    case 'mark-read': return state.readIds.has(action.updateId) ? state : { ...state, readIds: new Set([...state.readIds, action.updateId]) };
    case 'mark-all-read': return { ...state, readIds: new Set(state.updates.map((item) => item.id)) };
    case 'replace-read-state': return { ...state, readIds: action.readIds };
  }
}

const UpdatesContext = createContext<UpdatesContextValue | undefined>(undefined);

function isReadIds(value: unknown): value is readonly string[] { return Array.isArray(value) && value.every((item) => typeof item === 'string'); }

async function loadUpdates(dispatch: Dispatch<UpdatesAction>) {
  dispatch({ type: 'loading' });
  try {
    const [updates, storedIds] = await Promise.all([updatesService.getUpdates(), readStoredValue(storageKeys.updatesReadState, isReadIds)]);
    dispatch({ type: 'load-success', updates });
    const validIds = new Set(updates.map((update) => update.id));
    storedIds?.filter((id) => validIds.has(id)).forEach((updateId) => dispatch({ type: 'mark-read', updateId }));
  }
  catch { dispatch({ type: 'load-error' }); }
}

export function UpdatesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(updatesReducer, initialState);
  useEffect(() => { void loadUpdates(dispatch); }, []);
  const isRead = useCallback((updateId: string) => state.readIds.has(updateId), [state.readIds]);
  const persistIds = useCallback((ids: ReadonlySet<string>) => { void writeStoredValue(storageKeys.updatesReadState, [...ids]); }, []);
  const markRead = useCallback((updateId: string) => {
    if (state.readIds.has(updateId)) return;
    const next = new Set([...state.readIds, updateId]);
    dispatch({ type: 'mark-read', updateId });
    persistIds(next);
  }, [persistIds, state.readIds]);
  const markAllRead = useCallback(() => {
    const next = new Set(state.updates.map((item) => item.id));
    dispatch({ type: 'mark-all-read' });
    persistIds(next);
  }, [persistIds, state.updates]);
  const resetReadState = useCallback(() => {
    const defaults = new Set(state.updates.filter((item) => item.initiallyRead).map((item) => item.id));
    dispatch({ type: 'replace-read-state', readIds: defaults });
    persistIds(defaults);
  }, [persistIds, state.updates]);
  const retry = useCallback(() => { void loadUpdates(dispatch); }, []);
  const unreadCount = state.updates.reduce((count, update) => count + (state.readIds.has(update.id) ? 0 : 1), 0);
  const value = useMemo(() => ({ updates: state.updates, status: state.status, unreadCount, isRead, markRead, markAllRead, resetReadState, retry }), [isRead, markAllRead, markRead, resetReadState, retry, state.status, state.updates, unreadCount]);
  return <UpdatesContext.Provider value={value}>{children}</UpdatesContext.Provider>;
}

export function useUpdates() {
  const context = useContext(UpdatesContext);
  if (!context) throw new Error('useUpdates must be used inside UpdatesProvider');
  return context;
}
