import { getPlayersBySquad, sharedAcademyData } from '@/data/academy';
import { demoConfig } from '@/config/demo';
import { AttendanceSessionDefinition, AttendanceStatus, PlayerAttendanceEntry, SessionAttendance } from '@/types/attendance';

export const attendanceSessions: readonly AttendanceSessionDefinition[] = [
  { id: 'training-1', squadId: 'u13', date: demoConfig.timeline.currentDateIso, displayDate: demoConfig.timeline.currentDateLabel, shortDate: '11 Jul', startTime: demoConfig.timeline.currentSessionStart, endTime: demoConfig.timeline.currentSessionEnd, timeLabel: demoConfig.timeline.currentSessionTime, ground: demoConfig.academy.primaryTrainingGround, coachId: 'coach-sandeep', focus: 'First touch and passing', timing: 'current' },
  { id: 'training-u10-12-jul', squadId: 'u10', date: '2026-07-12', displayDate: 'Sunday, 12 July 2026', shortDate: '12 Jul', startTime: '08:00', endTime: '09:15', timeLabel: '8:00 AM–9:15 AM', ground: demoConfig.academy.primaryTrainingGround, coachId: 'coach-sandeep', focus: 'Ball mastery and coordination', timing: 'upcoming' },
  { id: 'training-u15-13-jul', squadId: 'u15', date: '2026-07-13', displayDate: 'Monday, 13 July 2026', shortDate: '13 Jul', startTime: '18:30', endTime: '20:00', timeLabel: '6:30 PM–8:00 PM', ground: demoConfig.academy.primaryTrainingGround, coachId: 'coach-sandeep', focus: 'Pressing and transition', timing: 'upcoming' },
  { id: 'attendance-07-jul', squadId: 'u13', date: '2026-07-07', displayDate: 'Tuesday, 7 July 2026', shortDate: '7 Jul', startTime: '17:00', endTime: '18:30', timeLabel: '5:00 PM–6:30 PM', ground: demoConfig.academy.primaryTrainingGround, coachId: 'coach-sandeep', focus: 'Receiving under pressure', timing: 'recent' },
  { id: 'attendance-u10-08-jul', squadId: 'u10', date: '2026-07-08', displayDate: 'Wednesday, 8 July 2026', shortDate: '8 Jul', startTime: '08:00', endTime: '09:15', timeLabel: '8:00 AM–9:15 AM', ground: demoConfig.academy.primaryTrainingGround, coachId: 'coach-sandeep', focus: 'First touch and movement', timing: 'recent' },
  { id: 'attendance-u15-08-jul', squadId: 'u15', date: '2026-07-08', displayDate: 'Wednesday, 8 July 2026', shortDate: '8 Jul', startTime: '18:30', endTime: '20:00', timeLabel: '6:30 PM–8:00 PM', ground: demoConfig.academy.primaryTrainingGround, coachId: 'coach-sandeep', focus: 'Compact defending', timing: 'recent' },
];

const statusLabels: Readonly<Record<AttendanceStatus, string>> = { present: 'Present', absent: 'Absent', late: 'Late', 'not-marked': 'Not Marked' };
export function getAttendanceStatusLabel(status: AttendanceStatus) { return statusLabels[status]; }
export function getAttendanceSession(sessionId: string) { return attendanceSessions.find((session) => session.id === sessionId); }
export function getDefaultAttendanceSessionForSquad(squadId: string) { return attendanceSessions.find((session) => session.squadId === squadId && session.timing !== 'recent') ?? attendanceSessions.find((session) => session.squadId === squadId); }

function entriesForSquad(squadId: string, offset = 0): readonly PlayerAttendanceEntry[] {
  const statuses: readonly AttendanceStatus[] = [...Array.from({ length: 17 }, () => 'present' as const), 'absent', 'absent', 'late'];
  return getPlayersBySquad(squadId).map((player, index) => ({ playerId: player.id, status: statuses[(index + offset) % statuses.length], markedAt: '2026-07-10T12:30:00.000Z' }));
}

function submittedRecord(sessionId: string, offset: number, savedAt: string): SessionAttendance {
  const session = getAttendanceSession(sessionId);
  if (!session) throw new Error(`Missing attendance session ${sessionId}`);
  return { sessionId: session.id, squadId: session.squadId, date: session.date, startTime: session.startTime, endTime: session.endTime, coachId: session.coachId, entries: entriesForSquad(session.squadId, offset), savedAt, isSubmitted: true };
}

export const initialSubmittedAttendance: readonly SessionAttendance[] = [
  submittedRecord('attendance-07-jul', 0, '2026-07-07T18:42:00.000Z'),
  submittedRecord('attendance-u10-08-jul', 1, '2026-07-08T09:22:00.000Z'),
  submittedRecord('attendance-u15-08-jul', 2, '2026-07-08T20:08:00.000Z'),
];

export function createInitialDraft(sessionId: string, records: readonly SessionAttendance[]): readonly PlayerAttendanceEntry[] {
  const saved = records.find((record) => record.sessionId === sessionId && record.isSubmitted);
  if (saved) return saved.entries.map((entry) => ({ ...entry }));
  const session = getAttendanceSession(sessionId);
  if (!session) return [];
  if (session.id === sharedAcademyData.todaySession.id) {
    return getPlayersBySquad(session.squadId).map((player) => {
      const seed = sharedAcademyData.attendance.find((entry) => entry.sessionId === session.id && entry.playerId === player.id);
      return { playerId: player.id, status: seed?.status ?? 'not-marked' };
    });
  }
  return getPlayersBySquad(session.squadId).map((player) => ({ playerId: player.id, status: 'not-marked' }));
}

export function summarizeAttendance(entries: readonly PlayerAttendanceEntry[]): import('@/types/attendance').AttendanceSummary {
  const count = (status: AttendanceStatus) => entries.filter((entry) => entry.status === status).length;
  const present = count('present');
  const absent = count('absent');
  const late = count('late');
  const notMarked = count('not-marked');
  return { total: entries.length, present, absent, late, notMarked, marked: entries.length - notMarked };
}
