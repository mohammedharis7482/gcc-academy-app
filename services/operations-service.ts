import { seedAcademyOperations } from '@/data/operations';
import { AcademyOperationsPayload, AcademySchedule, AcademySessionAssignment, CoachAnnouncement } from '@/types/operations';
import { readStoredValueResult, storageKeys, writeStoredValue } from '@/utils/app-storage';

function isStringArray(value: unknown): value is readonly string[] { return Array.isArray(value) && value.every((item) => typeof item === 'string'); }
function isSchedule(value: unknown): value is AcademySchedule {
  return typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string' && 'categoryId' in value && typeof value.categoryId === 'string' && 'date' in value && typeof value.date === 'string' && 'status' in value && ['upcoming', 'completed', 'cancelled'].includes(String(value.status));
}
function isAnnouncement(value: unknown): value is CoachAnnouncement {
  return typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string' && 'title' in value && typeof value.title === 'string' && 'message' in value && typeof value.message === 'string' && 'categoryIds' in value && isStringArray(value.categoryIds);
}
function isAssignment(value: unknown): value is AcademySessionAssignment {
  return typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string' && 'sessionId' in value && typeof value.sessionId === 'string' && 'targetIds' in value && isStringArray(value.targetIds);
}
function isPayload(value: unknown): value is AcademyOperationsPayload {
  return typeof value === 'object' && value !== null && 'schedules' in value && Array.isArray(value.schedules) && value.schedules.every(isSchedule) && 'announcements' in value && Array.isArray(value.announcements) && value.announcements.every(isAnnouncement) && 'assignments' in value && Array.isArray(value.assignments) && value.assignments.every(isAssignment);
}

export const operationsService = {
  async load(): Promise<{ readonly payload: AcademyOperationsPayload; readonly failed: boolean }> {
    const result = await readStoredValueResult(storageKeys.academyOperations, isPayload);
    return { payload: result.value ?? seedAcademyOperations, failed: result.failed };
  },
  save(payload: AcademyOperationsPayload) { return writeStoredValue(storageKeys.academyOperations, payload); },
};
