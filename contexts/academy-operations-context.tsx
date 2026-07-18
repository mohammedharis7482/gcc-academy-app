import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useUpdates } from '@/contexts/updates-context';
import { getLessonById } from '@/data/learning';
import { operationsService } from '@/services/operations-service';
import { AcademyCommunicationUpdate } from '@/types/updates';
import { AcademyOperationsPayload, AcademySchedule, AcademySessionAssignment, CoachAnnouncement } from '@/types/operations';

type OperationsStatus = 'loading' | 'ready' | 'error';
type ScheduleInput = Omit<AcademySchedule, 'id' | 'publishedAt' | 'source' | 'notifiedAt'> & { readonly id?: string };
type AnnouncementInput = Omit<CoachAnnouncement, 'id' | 'publishedAt' | 'source'>;
type AssignmentInput = Omit<AcademySessionAssignment, 'id' | 'assignedAt' | 'source'>;
interface SaveResult<T> { readonly value?: T; readonly error?: string }

interface AcademyOperationsContextValue extends AcademyOperationsPayload {
  readonly status: OperationsStatus;
  readonly isSaving: boolean;
  readonly storageWarning: boolean;
  getSchedule: (id: string) => AcademySchedule | undefined;
  getSchedulesForCategory: (categoryId: string) => readonly AcademySchedule[];
  getAssignmentsForPlayer: (playerId: string, categoryId: string) => readonly AcademySessionAssignment[];
  publishSchedule: (input: ScheduleInput) => Promise<SaveResult<AcademySchedule>>;
  cancelSchedule: (id: string) => Promise<boolean>;
  notifySchedule: (id: string) => Promise<boolean>;
  postAnnouncement: (input: AnnouncementInput) => Promise<SaveResult<CoachAnnouncement>>;
  assignSession: (input: AssignmentInput) => Promise<SaveResult<AcademySessionAssignment>>;
  retry: () => void;
}

const AcademyOperationsContext = createContext<AcademyOperationsContextValue | undefined>(undefined);
const audienceLabels: Readonly<Record<CoachAnnouncement['audience'], string>> = { 'my-category': 'U13 Development Squad', 'selected-categories': 'Selected categories', 'all-players': 'All players' };

function toUpdateType(type: CoachAnnouncement['type']): AcademyCommunicationUpdate['category'] { return type; }
function operationUpdates(payload: AcademyOperationsPayload): readonly AcademyCommunicationUpdate[] {
  const announcements = payload.announcements.filter((item) => item.audience === 'all-players' || item.categoryIds.includes('u13')).map<AcademyCommunicationUpdate>((item) => ({
    id: `coach-operation-update-announcement-${item.id}`, category: toUpdateType(item.type), priority: item.priority,
    title: item.title, preview: item.message, message: item.message, publishedAt: 'Today', relativeTime: 'Just now', dateGroup: 'Today',
    senderName: item.creatorName, senderRole: 'Coach', audienceLabel: audienceLabels[item.audience], actionType: 'none',
    metadata: { audience: audienceLabels[item.audience] }, initiallyRead: false,
  }));
  const assignments = payload.assignments.filter((item) => item.source === 'coach-created' && (item.targetIds.includes('player-ayaan') || item.targetIds.includes('u13'))).flatMap<AcademyCommunicationUpdate>((item) => {
    const session = getLessonById(item.sessionId); if (!session) return [];
    const audience = item.targetType === 'category' ? 'U13 Development Squad' : item.targetType === 'player' ? 'Assigned player' : 'Selected players';
    return [{ id: `coach-operation-update-assignment-${item.id}`, category: 'General Notice', priority: 'normal', title: 'Academy Session Assigned', preview: `${session.title} has been assigned by Coach ${item.assignedByName}.`, message: item.message || `Coach ${item.assignedByName} assigned ${session.title}. Watch the Session Video before your next training review.`, publishedAt: 'Today', relativeTime: 'Just now', dateGroup: 'Today', senderName: `Coach ${item.assignedByName}`, senderRole: 'Technical Coach', audienceLabel: audience, actionType: 'session', actionLabel: 'Watch session', targetId: session.id, metadata: { sessionDuration: `${session.durationMinutes} minutes`, coach: `Coach ${item.assignedByName}`, dueDate: item.dueDate, audience }, initiallyRead: false }];
  });
  const schedules = payload.schedules.filter((item) => item.categoryId === 'u13' && (item.source === 'coach-created' || item.notifiedAt)).map<AcademyCommunicationUpdate>((item) => ({
    id: `coach-operation-update-schedule-${item.id}-${item.notifiedAt ?? item.publishedAt}`, category: 'Schedule Change', priority: item.status === 'cancelled' ? 'important' : 'normal',
    title: item.status === 'cancelled' ? 'Training Schedule Cancelled' : 'Training Schedule Published', preview: `${item.dateLabel} · ${item.time} · ${item.pitch}.`, message: item.status === 'cancelled' ? `${item.categoryName} training on ${item.dateLabel} has been cancelled. The academy will publish a replacement when confirmed.` : `${item.categoryName} training is scheduled for ${item.dateLabel} from ${item.time} at ${item.pitch}. ${item.note ?? ''}`.trim(),
    publishedAt: 'Today', relativeTime: 'Just now', dateGroup: 'Today', senderName: `Coach ${item.coachName}`, senderRole: 'Technical Coach', audienceLabel: item.categoryName,
    actionType: 'schedule', actionLabel: 'View schedule', targetId: item.id, metadata: { date: item.dateLabel, time: item.time, ground: item.pitch, coach: `Coach ${item.coachName}`, audience: item.categoryName }, initiallyRead: false,
  }));
  return [...announcements, ...assignments, ...schedules];
}

export function AcademyOperationsProvider({ children }: { readonly children: ReactNode }) {
  const { syncOperationUpdates } = useUpdates();
  const [payload, setPayload] = useState<AcademyOperationsPayload>({ schedules: [], announcements: [], assignments: [] });
  const payloadRef = useRef(payload); const savingRef = useRef(false);
  const [status, setStatus] = useState<OperationsStatus>('loading'); const [isSaving, setIsSaving] = useState(false); const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => { payloadRef.current = payload; }, [payload]);
  const load = useCallback(async () => { setStatus('loading'); const result = await operationsService.load(); setPayload(result.payload); payloadRef.current = result.payload; setStorageWarning(result.failed); setStatus(result.failed ? 'error' : 'ready'); }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { syncOperationUpdates(operationUpdates(payload)); }, [payload, syncOperationUpdates]);
  const persist = useCallback(async (next: AcademyOperationsPayload) => { if (savingRef.current) return false; savingRef.current = true; setIsSaving(true); const saved = await operationsService.save(next); if (saved) { setPayload(next); payloadRef.current = next; setStorageWarning(false); } else setStorageWarning(true); savingRef.current = false; setIsSaving(false); return saved; }, []);
  const getSchedule = useCallback((id: string) => payload.schedules.find((item) => item.id === id), [payload.schedules]);
  const getSchedulesForCategory = useCallback((categoryId: string) => payload.schedules.filter((item) => item.categoryId === categoryId).sort((a, b) => b.date.localeCompare(a.date)), [payload.schedules]);
  const getAssignmentsForPlayer = useCallback((playerId: string, categoryId: string) => payload.assignments.filter((item) => item.targetIds.includes(playerId) || item.targetIds.includes(categoryId)).sort((a, b) => b.assignedAt.localeCompare(a.assignedAt)), [payload.assignments]);
  const publishSchedule = useCallback(async (input: ScheduleInput): Promise<SaveResult<AcademySchedule>> => { const now = new Date().toISOString(); const value: AcademySchedule = { ...input, id: input.id ?? `schedule-${Date.now()}`, publishedAt: now, source: 'coach-created' }; const next = { ...payloadRef.current, schedules: [value, ...payloadRef.current.schedules.filter((item) => item.id !== value.id)] }; return await persist(next) ? { value } : { error: 'The schedule could not be saved on this device.' }; }, [persist]);
  const updateSchedule = useCallback(async (id: string, change: Partial<Pick<AcademySchedule, 'status' | 'notifiedAt'>>) => { const next = { ...payloadRef.current, schedules: payloadRef.current.schedules.map((item) => item.id === id ? { ...item, ...change } : item) }; return persist(next); }, [persist]);
  const cancelSchedule = useCallback((id: string) => updateSchedule(id, { status: 'cancelled', notifiedAt: new Date().toISOString() }), [updateSchedule]);
  const notifySchedule = useCallback((id: string) => updateSchedule(id, { notifiedAt: new Date().toISOString() }), [updateSchedule]);
  const postAnnouncement = useCallback(async (input: AnnouncementInput): Promise<SaveResult<CoachAnnouncement>> => { const value: CoachAnnouncement = { ...input, id: `announcement-${Date.now()}`, publishedAt: new Date().toISOString(), source: 'coach-created' }; const next = { ...payloadRef.current, announcements: [value, ...payloadRef.current.announcements] }; return await persist(next) ? { value } : { error: 'The announcement could not be saved on this device.' }; }, [persist]);
  const assignSession = useCallback(async (input: AssignmentInput): Promise<SaveResult<AcademySessionAssignment>> => { if (!getLessonById(input.sessionId)) return { error: 'Select a valid Academy Session.' }; const value: AcademySessionAssignment = { ...input, id: `assignment-${Date.now()}`, assignedAt: new Date().toISOString(), source: 'coach-created' }; const next = { ...payloadRef.current, assignments: [value, ...payloadRef.current.assignments] }; return await persist(next) ? { value } : { error: 'The Session assignment could not be saved on this device.' }; }, [persist]);
  const value = useMemo(() => ({ ...payload, status, isSaving, storageWarning, getSchedule, getSchedulesForCategory, getAssignmentsForPlayer, publishSchedule, cancelSchedule, notifySchedule, postAnnouncement, assignSession, retry: load }), [assignSession, cancelSchedule, getAssignmentsForPlayer, getSchedule, getSchedulesForCategory, isSaving, load, notifySchedule, payload, postAnnouncement, publishSchedule, status, storageWarning]);
  return <AcademyOperationsContext.Provider value={value}>{children}</AcademyOperationsContext.Provider>;
}

export function useAcademyOperations() { const value = useContext(AcademyOperationsContext); if (!value) throw new Error('useAcademyOperations must be used inside AcademyOperationsProvider'); return value; }
