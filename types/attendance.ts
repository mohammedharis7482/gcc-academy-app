import { AttendanceMark } from '@/types/academy';

export type AttendanceStatus = AttendanceMark;

export interface PlayerAttendanceEntry {
  readonly playerId: string;
  readonly status: AttendanceStatus;
  readonly note?: string;
  readonly markedAt?: string;
}

export interface SessionAttendance {
  readonly sessionId: string;
  readonly squadId: string;
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly coachId: string;
  readonly entries: readonly PlayerAttendanceEntry[];
  readonly savedAt?: string;
  readonly isSubmitted: boolean;
}

export interface AttendanceSummary {
  readonly total: number;
  readonly present: number;
  readonly absent: number;
  readonly late: number;
  readonly notMarked: number;
  readonly marked: number;
}

export interface AttendanceSessionDefinition {
  readonly id: string;
  readonly squadId: string;
  readonly date: string;
  readonly displayDate: string;
  readonly shortDate: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly timeLabel: string;
  readonly ground: string;
  readonly coachId: string;
  readonly focus: string;
  readonly timing: 'recent' | 'current' | 'upcoming';
}

export interface PlayerAttendanceComputed {
  readonly percentage: number;
  readonly present: number;
  readonly absent: number;
  readonly late: number;
  readonly total: number;
  readonly currentStatus: AttendanceStatus;
  readonly lastAttendanceDate: string;
}

export interface PlayerSubmittedAttendance {
  readonly session: AttendanceSessionDefinition;
  readonly entry: PlayerAttendanceEntry;
  readonly savedAt: string;
}

export interface AttendanceStoragePayload {
  readonly schemaVersion: 1;
  readonly records: readonly SessionAttendance[];
}

export type AttendanceLoadStatus = 'loading' | 'ready' | 'error';
export type AttendanceFilter = 'all' | AttendanceStatus;
