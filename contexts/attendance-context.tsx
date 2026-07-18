import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';

import { attendanceSessions, createInitialDraft, getAttendanceSession, getDefaultAttendanceSessionForSquad, initialSubmittedAttendance, summarizeAttendance } from '@/data/attendance';
import { getPlayerById } from '@/data/academy';
import { attendanceService } from '@/services/attendance-service';
import { AttendanceLoadStatus, AttendanceSessionDefinition, AttendanceStatus, AttendanceSummary, PlayerAttendanceComputed, PlayerAttendanceEntry, PlayerSubmittedAttendance, SessionAttendance } from '@/types/attendance';

interface AttendanceState {
  readonly records: readonly SessionAttendance[];
  readonly loadStatus: AttendanceLoadStatus;
  readonly loadError: string | null;
  readonly selectedSessionId: string;
  readonly draftEntries: readonly PlayerAttendanceEntry[];
  readonly baselineEntries: readonly PlayerAttendanceEntry[];
  readonly isSaving: boolean;
  readonly saveError: string | null;
}

type AttendanceAction =
  | { readonly type: 'load-start' }
  | { readonly type: 'load-success'; readonly records: readonly SessionAttendance[]; readonly storageFailed: boolean }
  | { readonly type: 'select-session'; readonly sessionId: string }
  | { readonly type: 'set-status'; readonly playerId: string; readonly status: AttendanceStatus; readonly markedAt: string }
  | { readonly type: 'set-note'; readonly playerId: string; readonly note?: string }
  | { readonly type: 'replace-draft'; readonly entries: readonly PlayerAttendanceEntry[] }
  | { readonly type: 'discard-draft' }
  | { readonly type: 'save-start' }
  | { readonly type: 'save-success'; readonly record: SessionAttendance }
  | { readonly type: 'save-error'; readonly message: string }
  | { readonly type: 'reset' };

const defaultSessionId = 'training-1';
const defaultEntries = createInitialDraft(defaultSessionId, initialSubmittedAttendance);
const initialState: AttendanceState = { records: initialSubmittedAttendance, loadStatus: 'loading', loadError: null, selectedSessionId: defaultSessionId, draftEntries: defaultEntries, baselineEntries: defaultEntries, isSaving: false, saveError: null };

function attendanceReducer(state: AttendanceState, action: AttendanceAction): AttendanceState {
  switch (action.type) {
    case 'load-start': return { ...state, loadStatus: 'loading', loadError: null };
    case 'load-success': {
      const entries = createInitialDraft(state.selectedSessionId, action.records);
      return { ...state, records: action.records, draftEntries: entries, baselineEntries: entries, loadStatus: action.storageFailed ? 'error' : 'ready', loadError: action.storageFailed ? 'Saved attendance could not be restored from this device.' : null, isSaving: false, saveError: null };
    }
    case 'select-session': {
      const entries = createInitialDraft(action.sessionId, state.records);
      return { ...state, selectedSessionId: action.sessionId, draftEntries: entries, baselineEntries: entries, saveError: null };
    }
    case 'set-status': return { ...state, draftEntries: state.draftEntries.map((entry) => entry.playerId === action.playerId ? { ...entry, status: action.status, note: action.status === 'absent' || action.status === 'late' ? entry.note : undefined, markedAt: action.markedAt } : entry), saveError: null };
    case 'set-note': return { ...state, draftEntries: state.draftEntries.map((entry) => entry.playerId === action.playerId ? { ...entry, note: action.note } : entry), saveError: null };
    case 'replace-draft': return { ...state, draftEntries: action.entries, saveError: null };
    case 'discard-draft': return { ...state, draftEntries: state.baselineEntries.map((entry) => ({ ...entry })), saveError: null };
    case 'save-start': return { ...state, isSaving: true, saveError: null };
    case 'save-success': return { ...state, records: [...state.records.filter((record) => record.sessionId !== action.record.sessionId), action.record], draftEntries: action.record.entries, baselineEntries: action.record.entries, isSaving: false, saveError: null, loadStatus: 'ready', loadError: null };
    case 'save-error': return { ...state, isSaving: false, saveError: action.message };
    case 'reset': return { ...initialState, loadStatus: 'ready' };
  }
}

function entriesMatch(first: readonly PlayerAttendanceEntry[], second: readonly PlayerAttendanceEntry[]) {
  if (first.length !== second.length) return false;
  return first.every((entry) => { const other = second.find((item) => item.playerId === entry.playerId); return other?.status === entry.status && (other.note ?? '') === (entry.note ?? ''); });
}

interface AttendanceDataContextValue {
  readonly sessions: readonly AttendanceSessionDefinition[];
  readonly records: readonly SessionAttendance[];
  readonly loadStatus: AttendanceLoadStatus;
  readonly loadError: string | null;
  getSessionEntries: (sessionId: string) => readonly PlayerAttendanceEntry[];
  getSessionSummary: (sessionId: string) => AttendanceSummary;
  getSessionRecord: (sessionId: string) => SessionAttendance | undefined;
  getPlayerSummary: (playerId: string) => PlayerAttendanceComputed | undefined;
  getPlayerHistory: (playerId: string) => readonly PlayerSubmittedAttendance[];
}

interface AttendanceDraftContextValue {
  readonly selectedSessionId: string;
  readonly draftEntries: readonly PlayerAttendanceEntry[];
  readonly summary: AttendanceSummary;
  readonly hasUnsavedChanges: boolean;
  readonly isSaving: boolean;
  readonly saveError: string | null;
  selectSession: (sessionId: string) => boolean;
  setStatus: (playerId: string, status: AttendanceStatus) => void;
  setNote: (playerId: string, note: string) => void;
  markAllPresent: () => void;
  resetDraft: () => void;
  discardDraft: () => void;
  saveDraft: () => Promise<SessionAttendance | null>;
  retryLoad: () => void;
  resetAttendance: () => void;
}

const AttendanceDataContext = createContext<AttendanceDataContextValue | undefined>(undefined);
const AttendanceDraftContext = createContext<AttendanceDraftContextValue | undefined>(undefined);

function changeCount(counts: { present: number; absent: number; late: number }, status: AttendanceStatus, amount: 1 | -1) {
  if (status === 'present') counts.present += amount;
  else if (status === 'absent') counts.absent += amount;
  else if (status === 'late') counts.late += amount;
}

export function AttendanceProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(attendanceReducer, initialState);
  const savingRef = useRef(false);
  const load = useCallback(async () => {
    dispatch({ type: 'load-start' });
    const result = await attendanceService.load();
    dispatch({ type: 'load-success', records: result.records, storageFailed: result.failed });
  }, []);
  useEffect(() => { void load(); }, [load]);

  const selectSession = useCallback((sessionId: string) => {
    if (!getAttendanceSession(sessionId)) return false;
    dispatch({ type: 'select-session', sessionId });
    return true;
  }, []);
  const setStatus = useCallback((playerId: string, status: AttendanceStatus) => dispatch({ type: 'set-status', playerId, status, markedAt: new Date().toISOString() }), []);
  const setNote = useCallback((playerId: string, note: string) => dispatch({ type: 'set-note', playerId, note: note.trim().slice(0, 80) || undefined }), []);
  const markAllPresent = useCallback(() => dispatch({ type: 'replace-draft', entries: state.draftEntries.map((entry) => ({ ...entry, status: 'present', note: undefined, markedAt: new Date().toISOString() })) }), [state.draftEntries]);
  const resetDraft = useCallback(() => dispatch({ type: 'replace-draft', entries: state.draftEntries.map((entry) => ({ playerId: entry.playerId, status: 'not-marked' })) }), [state.draftEntries]);
  const discardDraft = useCallback(() => dispatch({ type: 'discard-draft' }), []);
  const saveDraft = useCallback(async () => {
    const session = getAttendanceSession(state.selectedSessionId);
    if (!session || state.draftEntries.length === 0 || state.isSaving || savingRef.current) return null;
    savingRef.current = true;
    dispatch({ type: 'save-start' });
    const savedAt = new Date().toISOString();
    const record: SessionAttendance = { sessionId: session.id, squadId: session.squadId, date: session.date, startTime: session.startTime, endTime: session.endTime, coachId: session.coachId, entries: state.draftEntries.map((entry) => ({ ...entry, markedAt: entry.markedAt ?? savedAt })), savedAt, isSubmitted: true };
    const records = [...state.records.filter((item) => item.sessionId !== record.sessionId), record];
    const persisted = await attendanceService.save(records);
    if (!persisted) { savingRef.current = false; dispatch({ type: 'save-error', message: 'Attendance could not be saved on this device. Check storage and try again.' }); return null; }
    dispatch({ type: 'save-success', record });
    savingRef.current = false;
    return record;
  }, [state.draftEntries, state.isSaving, state.records, state.selectedSessionId]);
  const resetAttendance = useCallback(() => { savingRef.current = false; dispatch({ type: 'reset' }); }, []);

  const getSessionRecord = useCallback((sessionId: string) => state.records.find((record) => record.sessionId === sessionId && record.isSubmitted), [state.records]);
  const getSessionEntries = useCallback((sessionId: string) => getSessionRecord(sessionId)?.entries ?? createInitialDraft(sessionId, state.records), [getSessionRecord, state.records]);
  const getSessionSummary = useCallback((sessionId: string) => summarizeAttendance(getSessionEntries(sessionId)), [getSessionEntries]);
  const getPlayerSummary = useCallback((playerId: string): PlayerAttendanceComputed | undefined => {
    const player = getPlayerById(playerId);
    if (!player) return undefined;
    const counts = { present: player.attendance.present, absent: player.attendance.absent, late: player.attendance.late };
    let hasSubmittedDelta = false;
    state.records.forEach((record) => {
      const entry = record.entries.find((item) => item.playerId === player.id);
      if (!entry) return;
      const baselineRecord = initialSubmittedAttendance.find((item) => item.sessionId === record.sessionId);
      const baselineEntry = baselineRecord?.entries.find((item) => item.playerId === player.id);
      if (baselineEntry) { changeCount(counts, baselineEntry.status, -1); if (baselineEntry.status !== entry.status) hasSubmittedDelta = true; }
      else if (entry.status !== 'not-marked') hasSubmittedDelta = true;
      changeCount(counts, entry.status, 1);
    });
    const total = counts.present + counts.absent + counts.late;
    const currentSessionId = getDefaultAttendanceSessionForSquad(player.squadId)?.id ?? defaultSessionId;
    const currentEntry = state.records.find((record) => record.sessionId === currentSessionId)?.entries.find((entry) => entry.playerId === player.id);
    const latest = state.records.filter((record) => record.entries.some((entry) => entry.playerId === player.id && entry.status !== 'not-marked')).sort((a, b) => b.date.localeCompare(a.date))[0];
    const recalculatedPercentage = total ? Math.round(((counts.present + counts.late) / total) * 100) : 0;
    return { ...counts, total, percentage: hasSubmittedDelta ? recalculatedPercentage : player.attendance.percentage, currentStatus: currentEntry?.status ?? player.sessionStatus, lastAttendanceDate: latest ? getAttendanceSession(latest.sessionId)?.displayDate.replace(/^[^,]+, /, '') ?? player.attendance.lastAttendanceDate : player.attendance.lastAttendanceDate };
  }, [state.records]);
  const getPlayerHistory = useCallback((playerId: string): readonly PlayerSubmittedAttendance[] => state.records.flatMap((record) => {
    const entry = record.entries.find((item) => item.playerId === playerId);
    const session = getAttendanceSession(record.sessionId);
    return entry && session && record.savedAt ? [{ session, entry, savedAt: record.savedAt }] : [];
  }).sort((a, b) => b.session.date.localeCompare(a.session.date)), [state.records]);

  const summary = useMemo(() => summarizeAttendance(state.draftEntries), [state.draftEntries]);
  const hasUnsavedChanges = useMemo(() => !entriesMatch(state.draftEntries, state.baselineEntries), [state.baselineEntries, state.draftEntries]);
  const dataValue = useMemo<AttendanceDataContextValue>(() => ({ sessions: attendanceSessions, records: state.records, loadStatus: state.loadStatus, loadError: state.loadError, getSessionEntries, getSessionSummary, getSessionRecord, getPlayerSummary, getPlayerHistory }), [getPlayerHistory, getPlayerSummary, getSessionEntries, getSessionRecord, getSessionSummary, state.loadError, state.loadStatus, state.records]);
  const draftValue = useMemo<AttendanceDraftContextValue>(() => ({ selectedSessionId: state.selectedSessionId, draftEntries: state.draftEntries, summary, hasUnsavedChanges, isSaving: state.isSaving, saveError: state.saveError, selectSession, setStatus, setNote, markAllPresent, resetDraft, discardDraft, saveDraft, retryLoad: load, resetAttendance }), [discardDraft, hasUnsavedChanges, load, markAllPresent, resetAttendance, resetDraft, saveDraft, selectSession, setNote, setStatus, state.draftEntries, state.isSaving, state.saveError, state.selectedSessionId, summary]);
  return <AttendanceDataContext.Provider value={dataValue}><AttendanceDraftContext.Provider value={draftValue}>{children}</AttendanceDraftContext.Provider></AttendanceDataContext.Provider>;
}

export function useAttendanceData() { const value = useContext(AttendanceDataContext); if (!value) throw new Error('useAttendanceData must be used inside AttendanceProvider'); return value; }
export function useAttendanceDraft() { const value = useContext(AttendanceDraftContext); if (!value) throw new Error('useAttendanceDraft must be used inside AttendanceProvider'); return value; }
