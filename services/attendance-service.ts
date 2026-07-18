import { attendanceSessions, initialSubmittedAttendance } from '@/data/attendance';
import { getPlayersBySquad } from '@/data/academy';
import { AttendanceStatus, AttendanceStoragePayload, PlayerAttendanceEntry, SessionAttendance } from '@/types/attendance';
import { readStoredValueResult, storageKeys, writeStoredValue } from '@/utils/app-storage';

const statuses: readonly AttendanceStatus[] = ['present', 'absent', 'late', 'not-marked'];
function isEntry(value: unknown): value is PlayerAttendanceEntry {
  return typeof value === 'object' && value !== null && 'playerId' in value && typeof value.playerId === 'string' && 'status' in value && statuses.includes(value.status as AttendanceStatus) && (!('note' in value) || value.note === undefined || typeof value.note === 'string') && (!('markedAt' in value) || value.markedAt === undefined || typeof value.markedAt === 'string');
}
function isRecord(value: unknown): value is SessionAttendance {
  return typeof value === 'object' && value !== null && 'sessionId' in value && typeof value.sessionId === 'string' && 'squadId' in value && typeof value.squadId === 'string' && 'date' in value && typeof value.date === 'string' && 'startTime' in value && typeof value.startTime === 'string' && 'endTime' in value && typeof value.endTime === 'string' && 'coachId' in value && typeof value.coachId === 'string' && 'entries' in value && Array.isArray(value.entries) && value.entries.every(isEntry) && 'isSubmitted' in value && value.isSubmitted === true && (!('savedAt' in value) || value.savedAt === undefined || typeof value.savedAt === 'string');
}
function isPayload(value: unknown): value is AttendanceStoragePayload {
  return typeof value === 'object' && value !== null && 'schemaVersion' in value && value.schemaVersion === 1 && 'records' in value && Array.isArray(value.records) && value.records.every(isRecord);
}

function sanitizeRecord(record: SessionAttendance): SessionAttendance | null {
  const session = attendanceSessions.find((item) => item.id === record.sessionId && item.squadId === record.squadId);
  if (!session) return null;
  const players = getPlayersBySquad(session.squadId);
  const entryMap = new Map(record.entries.filter((entry) => players.some((player) => player.id === entry.playerId)).map((entry) => [entry.playerId, entry]));
  const entries = players.map((player) => entryMap.get(player.id) ?? { playerId: player.id, status: 'not-marked' as const });
  return { ...record, date: session.date, startTime: session.startTime, endTime: session.endTime, coachId: session.coachId, entries, isSubmitted: true };
}

export interface AttendanceLoadResult { readonly records: readonly SessionAttendance[]; readonly failed: boolean }
export const attendanceService = {
  async load(): Promise<AttendanceLoadResult> {
    const stored = await readStoredValueResult(storageKeys.attendanceRecords, isPayload);
    const validStored = stored.value?.records.flatMap((record) => { const safe = sanitizeRecord(record); return safe ? [safe] : []; }) ?? [];
    const byId = new Map(initialSubmittedAttendance.map((record) => [record.sessionId, record]));
    validStored.forEach((record) => byId.set(record.sessionId, record));
    return { records: [...byId.values()], failed: stored.failed };
  },
  async save(records: readonly SessionAttendance[]): Promise<boolean> {
    return writeStoredValue(storageKeys.attendanceRecords, { schemaVersion: 1, records } satisfies AttendanceStoragePayload);
  },
};
