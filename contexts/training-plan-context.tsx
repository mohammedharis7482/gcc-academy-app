import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { seedTrainingPlan } from '@/data/coach-training';
import { trainingPlanService } from '@/services/training-plan-service';
import { CoachTrainingPlan } from '@/types/training';
import { AcademyCommunicationUpdate } from '@/types/updates';
import { useUpdates } from '@/contexts/updates-context';

type TrainingPlanStatus = 'loading' | 'ready' | 'error';
interface SaveTrainingResult { readonly plan?: CoachTrainingPlan; readonly error?: string }
interface TrainingPlanContextValue {
  readonly plans: readonly CoachTrainingPlan[];
  readonly status: TrainingPlanStatus;
  readonly isSaving: boolean;
  readonly storageWarning: boolean;
  getPlan: (sessionId: string) => CoachTrainingPlan | undefined;
  getAssignedLessonIds: (squadId: string) => readonly string[];
  savePlan: (plan: CoachTrainingPlan) => Promise<SaveTrainingResult>;
  retry: () => void;
  resetTrainingPlans: () => Promise<void>;
}

const TrainingPlanContext = createContext<TrainingPlanContextValue | undefined>(undefined);
function toUpdate(plan: CoachTrainingPlan): AcademyCommunicationUpdate | null {
  if (plan.source !== 'coach-saved' || !plan.savedAt) return null;
  const focus = plan.focusAreaIds.map((id) => id.replace(/-/g, ' ')).join(', ');
  const completed = plan.status === 'completed';
  return { id: `coach-training-update-${Date.parse(plan.savedAt)}`, category: 'General Notice', priority: 'important', title: completed ? 'Academy Session Completed' : 'Session Plan Updated', preview: completed ? `${plan.dateLabel}: training completed.` : `${plan.dateLabel}: ${focus}.`, message: completed ? `Coach ${plan.coachName} completed the ${plan.squadName} training session. ${plan.notes || 'The latest session plan and assigned Academy Sessions remain available.'}` : `Coach ${plan.coachName} updated the ${plan.squadName} session plan. Focus areas: ${focus}. ${plan.assignedLessonIds.length} Academy Session${plan.assignedLessonIds.length === 1 ? '' : 's'} assigned.`, publishedAt: 'Today', relativeTime: 'Just now', dateGroup: 'Today', senderName: `Coach ${plan.coachName}`, senderRole: 'Technical Coach', audienceLabel: plan.squadName, actionType: 'schedule', actionLabel: 'View schedule', targetId: plan.sessionId, metadata: { date: plan.dateLabel, time: plan.time, ground: plan.ground, coach: plan.coachName, audience: plan.squadName }, initiallyRead: false };
}

export function TrainingPlanProvider({ children }: { readonly children: ReactNode }) {
  const { syncTrainingUpdates } = useUpdates(); const [plans, setPlans] = useState<readonly CoachTrainingPlan[]>([]); const plansRef = useRef(plans); const savingRef = useRef(false); const [status, setStatus] = useState<TrainingPlanStatus>('loading'); const [isSaving, setIsSaving] = useState(false); const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => { plansRef.current = plans; }, [plans]);
  const load = useCallback(async () => { setStatus('loading'); const result = await trainingPlanService.load(); setPlans(result.plans); setStorageWarning(result.failed); setStatus(result.failed ? 'error' : 'ready'); }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { syncTrainingUpdates(plans.flatMap((plan) => { const update = toUpdate(plan); return update ? [update] : []; })); }, [plans, syncTrainingUpdates]);
  const getPlan = useCallback((sessionId: string) => plans.find((plan) => plan.sessionId === sessionId), [plans]);
  const getAssignedLessonIds = useCallback((squadId: string) => plans.find((plan) => plan.squadId === squadId)?.assignedLessonIds ?? [], [plans]);
  const savePlan = useCallback(async (input: CoachTrainingPlan): Promise<SaveTrainingResult> => {
    if (savingRef.current) return { error: 'The session is already being saved.' };
    if (input.focusAreaIds.length > 3) return { error: 'Choose no more than three focus areas.' };
    if (input.assignedLessonIds.length > 2) return { error: 'Choose no more than two lessons.' };
    if (input.notes.length > 200) return { error: 'Keep Coach notes within 200 characters.' };
    savingRef.current = true; setIsSaving(true); const plan: CoachTrainingPlan = { ...input, savedAt: new Date().toISOString(), source: 'coach-saved' }; const next = [plan, ...plansRef.current.filter((item) => item.sessionId !== plan.sessionId)]; const saved = await trainingPlanService.save(next);
    if (saved) { setPlans(next); plansRef.current = next; setStorageWarning(false); }
    else setStorageWarning(true);
    savingRef.current = false; setIsSaving(false); return saved ? { plan } : { error: 'The session could not be saved to this device. Your draft remains available.' };
  }, []);
  const resetTrainingPlans = useCallback(async () => { const seeds = [seedTrainingPlan]; setPlans(seeds); plansRef.current = seeds; await trainingPlanService.save(seeds); }, []);
  const value = useMemo(() => ({ plans, status, isSaving, storageWarning, getPlan, getAssignedLessonIds, savePlan, retry: load, resetTrainingPlans }), [getAssignedLessonIds, getPlan, isSaving, load, plans, resetTrainingPlans, savePlan, status, storageWarning]);
  return <TrainingPlanContext.Provider value={value}>{children}</TrainingPlanContext.Provider>;
}

export function useTrainingPlans() { const value = useContext(TrainingPlanContext); if (!value) throw new Error('useTrainingPlans must be used inside TrainingPlanProvider'); return value; }
