import { seedAdminDirectory } from '@/data/admin';
import { AdminDirectory, AdminOperationsPayload } from '@/types/admin';
import { adminStorageKeys, readAdminValueResult, writeAdminValue } from '@/utils/admin-storage';

export const emptyAdminOperations: AdminOperationsPayload = { payments: [], decisions: [], enrolments: [], coaches: [], announcements: [], squadOverrides: [] };

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
function hasString(value: Record<string, unknown>, key: string) { return typeof value[key] === 'string'; }
function isStringArray(value: unknown): value is readonly string[] { return Array.isArray(value) && value.every((item) => typeof item === 'string'); }

function isPayment(value: unknown) { return isRecord(value) && hasString(value, 'feeId') && hasString(value, 'memberId') && typeof value.amount === 'number' && hasString(value, 'method') && hasString(value, 'recordedOn'); }
function isDecision(value: unknown) { return isRecord(value) && hasString(value, 'approvalId') && (value.state === 'approved' || value.state === 'declined') && hasString(value, 'decidedOn'); }
function isEnrolment(value: unknown) { return isRecord(value) && hasString(value, 'id') && hasString(value, 'name') && hasString(value, 'playerId') && hasString(value, 'squadId') && typeof value.monthlyFee === 'number'; }
function isCoach(value: unknown) { return isRecord(value) && hasString(value, 'id') && hasString(value, 'name') && hasString(value, 'roleTitle') && isStringArray(value.squadIds); }
function isAnnouncement(value: unknown) { return isRecord(value) && hasString(value, 'id') && hasString(value, 'title') && hasString(value, 'message') && isStringArray(value.categoryIds); }
function isSquadOverride(value: unknown) { return isRecord(value) && hasString(value, 'squadId'); }

function isOperationsPayload(value: unknown): value is AdminOperationsPayload {
  return isRecord(value)
    && Array.isArray(value.payments) && value.payments.every(isPayment)
    && Array.isArray(value.decisions) && value.decisions.every(isDecision)
    && Array.isArray(value.enrolments) && value.enrolments.every(isEnrolment)
    && Array.isArray(value.coaches) && value.coaches.every(isCoach)
    && Array.isArray(value.announcements) && value.announcements.every(isAnnouncement)
    && Array.isArray(value.squadOverrides) && value.squadOverrides.every(isSquadOverride);
}

export const adminService = {
  /** Typed local directory. The Admin module has no API layer in this MVP. */
  async loadDirectory(): Promise<AdminDirectory> {
    await new Promise((resolve) => setTimeout(resolve, 260));
    return seedAdminDirectory;
  },
  async loadOperations(): Promise<{ readonly payload: AdminOperationsPayload; readonly failed: boolean }> {
    const result = await readAdminValueResult(adminStorageKeys.adminOperations, isOperationsPayload);
    return { payload: result.value ?? emptyAdminOperations, failed: result.failed };
  },
  saveOperations(payload: AdminOperationsPayload) {
    return writeAdminValue(adminStorageKeys.adminOperations, payload);
  },
};
