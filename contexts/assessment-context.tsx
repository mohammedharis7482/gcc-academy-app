import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { getPlayerById } from '@/data/academy';
import { assessmentSkills } from '@/data/assessments';
import { assessmentService } from '@/services/assessment-service';
import { AssessmentDraft, CoachAssessment } from '@/types/assessment';
import { AcademyCommunicationUpdate } from '@/types/updates';
import { useUpdates } from '@/contexts/updates-context';

type AssessmentLoadStatus = 'loading' | 'ready' | 'error';
interface PublishResult { readonly record?: CoachAssessment; readonly error?: string }
interface AssessmentContextValue {
  readonly records: readonly CoachAssessment[];
  readonly status: AssessmentLoadStatus;
  readonly isSaving: boolean;
  readonly storageWarning: boolean;
  getAssessmentById: (id: string) => CoachAssessment | undefined;
  getPlayerAssessments: (playerId: string) => readonly CoachAssessment[];
  getLatestAssessment: (playerId: string) => CoachAssessment | undefined;
  getLatestFullAssessment: (playerId: string) => CoachAssessment | undefined;
  getRecommendedLessonIds: (playerId: string) => readonly string[];
  publish: (draft: AssessmentDraft) => Promise<PublishResult>;
  retry: () => void;
  resetAssessments: () => Promise<void>;
}

const AssessmentContext = createContext<AssessmentContextValue | undefined>(undefined);
const skillCount = 7;

function validateDraft(draft: AssessmentDraft): string | undefined {
  const strength = draft.strength === 'Custom' ? draft.customStrength.trim() : draft.strength;
  const improvement = draft.improvementArea === 'Custom' ? draft.customImprovement.trim() : draft.improvementArea;
  if (!getPlayerById(draft.playerId)) return 'Select a valid player.';
  if (!strength) return 'Select a strength.';
  if (!improvement) return 'Select an improvement area.';
  if (!draft.comment.trim()) return 'Add a short coach comment.';
  if (draft.comment.trim().length > 240) return 'Keep the coach comment within 240 characters.';
  if (draft.mode === 'full-assessment' && Object.keys(draft.skillRatings).length !== skillCount) return 'Rate all seven skills before publishing.';
  return undefined;
}

function toUpdate(record: CoachAssessment): AcademyCommunicationUpdate | null {
  if (record.playerId !== 'player-ayaan' || record.source !== 'coach-created') return null;
  const full = record.mode === 'full-assessment';
  return {
    id: `coach-assessment-update-${record.id}`, category: 'General Notice', priority: 'important', title: full ? 'New Assessment Available' : 'New Coach Feedback',
    preview: record.comment, message: record.comment, publishedAt: 'Today', relativeTime: 'Just now', dateGroup: 'Today', senderName: 'Coach Sandeep', senderRole: 'Technical Coach',
    audienceLabel: getPlayerById(record.playerId)?.name ?? 'Assigned player', actionType: full ? 'progress' : 'feedback', actionLabel: full ? 'View assessment' : 'View feedback', targetId: record.id,
    metadata: { coach: 'Sandeep', assessmentPeriod: record.periodLabel, audience: getPlayerById(record.playerId)?.name ?? 'Assigned player' }, initiallyRead: false,
  };
}

export function AssessmentProvider({ children }: { readonly children: ReactNode }) {
  const { syncAssessmentUpdates } = useUpdates();
  const [records, setRecords] = useState<readonly CoachAssessment[]>([]);
  const recordsRef = useRef(records);
  const savingRef = useRef(false);
  const [status, setStatus] = useState<AssessmentLoadStatus>('loading');
  const [isSaving, setIsSaving] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => { recordsRef.current = records; }, [records]);

  const load = useCallback(async () => {
    setStatus('loading');
    const result = await assessmentService.load();
    setRecords(result.records); setStorageWarning(result.failed); setStatus(result.failed ? 'error' : 'ready');
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { syncAssessmentUpdates(records.flatMap((record) => { const update = toUpdate(record); return update ? [update] : []; })); }, [records, syncAssessmentUpdates]);

  const getPlayerAssessments = useCallback((playerId: string) => records.filter((item) => item.playerId === playerId), [records]);
  const getAssessmentById = useCallback((id: string) => records.find((item) => item.id === id), [records]);
  const getLatestAssessment = useCallback((playerId: string) => records.find((item) => item.playerId === playerId), [records]);
  const getLatestFullAssessment = useCallback((playerId: string) => records.find((item) => item.playerId === playerId && item.mode === 'full-assessment'), [records]);
  const getRecommendedLessonIdsForPlayer = useCallback((playerId: string) => [...new Set(records.filter((item) => item.playerId === playerId).flatMap((item) => item.recommendedLessonIds))], [records]);

  const publish = useCallback(async (draft: AssessmentDraft): Promise<PublishResult> => {
    const error = validateDraft(draft); if (error) return { error };
    if (savingRef.current) return { error: 'Feedback is already being saved.' };
    const player = getPlayerById(draft.playerId); if (!player) return { error: 'Player not found.' };
    savingRef.current = true; setIsSaving(true);
    const strength = draft.strength === 'Custom' ? draft.customStrength.trim() : draft.strength;
    const improvementArea = draft.improvementArea === 'Custom' ? draft.customImprovement.trim() : draft.improvementArea;
    const createdAt = new Date().toISOString();
    const record: CoachAssessment = {
      id: `assessment-${player.id}-${Date.now()}`, playerId: player.id, coachId: 'coach-sandeep', squadId: player.squadId, mode: draft.mode,
      periodLabel: draft.periodLabel, createdAt, skillRatings: draft.mode === 'full-assessment' ? assessmentSkills.flatMap(({ key }) => { const rating = draft.skillRatings[key]; return rating ? [{ skill: key, rating }] : []; }) : [],
      strength, improvementArea, comment: draft.comment.trim(), developmentGoal: draft.developmentGoal ?? (draft.mode === 'quick-feedback' ? { title: improvementArea, progressValue: 0, dueLabel: 'Before the next review' } : undefined),
      recommendedLessonIds: draft.recommendedLessonIds.slice(0, 2), sessionId: 'training-1', status: 'published', source: 'coach-created',
    };
    const next = [record, ...recordsRef.current.filter((item) => item.id !== record.id)];
    setRecords(next); recordsRef.current = next;
    const saved = await assessmentService.save(next);
    setStorageWarning(!saved); savingRef.current = false; setIsSaving(false);
    return saved ? { record } : { record, error: 'Saved for this session, but device persistence is unavailable.' };
  }, []);

  const resetAssessments = useCallback(async () => { const result = await assessmentService.load(); const seeds = result.records.filter((item) => item.source === 'seed'); setRecords(seeds); recordsRef.current = seeds; await assessmentService.save(seeds); }, []);
  const value = useMemo(() => ({ records, status, isSaving, storageWarning, getAssessmentById, getPlayerAssessments, getLatestAssessment, getLatestFullAssessment, getRecommendedLessonIds: getRecommendedLessonIdsForPlayer, publish, retry: load, resetAssessments }), [getAssessmentById, getLatestAssessment, getLatestFullAssessment, getPlayerAssessments, getRecommendedLessonIdsForPlayer, isSaving, load, publish, records, resetAssessments, status, storageWarning]);
  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessments() {
  const value = useContext(AssessmentContext);
  if (!value) throw new Error('useAssessments must be used inside AssessmentProvider');
  return value;
}
