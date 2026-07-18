import { getLessonById } from '@/data/learning';
import { seedTrainingPlan, trainingFocusAreas } from '@/data/coach-training';
import { CoachTrainingPlan, CoachTrainingStatus, TrainingPlanStoragePayload } from '@/types/training';
import { readStoredValueResult, storageKeys, writeStoredValue } from '@/utils/app-storage';

const statuses: readonly CoachTrainingStatus[] = ['upcoming', 'in-progress', 'completed', 'cancelled'];
function isDrill(value: unknown) { return typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string' && 'name' in value && typeof value.name === 'string' && 'durationMinutes' in value && typeof value.durationMinutes === 'number' && value.durationMinutes > 0 && 'description' in value && typeof value.description === 'string' && 'completed' in value && typeof value.completed === 'boolean'; }
function isObjective(value: unknown) { return typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string' && 'label' in value && typeof value.label === 'string' && 'completed' in value && typeof value.completed === 'boolean'; }
function isPlan(value: unknown): value is CoachTrainingPlan {
  if (typeof value !== 'object' || value === null) return false; const plan = value as Partial<CoachTrainingPlan>;
  const focusValid = Array.isArray(plan.focusAreaIds) && plan.focusAreaIds.length <= 3 && plan.focusAreaIds.every((id) => typeof id === 'string' && trainingFocusAreas.some((item) => item.id === id)) && new Set(plan.focusAreaIds).size === plan.focusAreaIds.length;
  const lessonsValid = Array.isArray(plan.assignedLessonIds) && plan.assignedLessonIds.length <= 3 && plan.assignedLessonIds.every((id) => typeof id === 'string' && Boolean(getLessonById(id))) && new Set(plan.assignedLessonIds).size === plan.assignedLessonIds.length;
  return plan.sessionId === 'training-1' && plan.squadId === 'u13' && typeof plan.squadName === 'string' && plan.coachId === 'coach-sandeep' && typeof plan.coachName === 'string' && typeof plan.date === 'string' && !Number.isNaN(Date.parse(plan.date)) && typeof plan.dateLabel === 'string' && typeof plan.time === 'string' && typeof plan.ground === 'string' && plan.playerCount === 20 && focusValid && Array.isArray(plan.drills) && plan.drills.length === 5 && plan.drills.every(isDrill) && Array.isArray(plan.objectives) && plan.objectives.length === 4 && plan.objectives.every(isObjective) && lessonsValid && typeof plan.notes === 'string' && plan.notes.length <= 200 && statuses.includes(plan.status as CoachTrainingStatus) && (plan.savedAt === undefined || typeof plan.savedAt === 'string') && (plan.completedAt === undefined || typeof plan.completedAt === 'string') && (plan.source === 'seed' || plan.source === 'coach-saved');
}
function isPayload(value: unknown): value is TrainingPlanStoragePayload { return typeof value === 'object' && value !== null && 'plans' in value && Array.isArray(value.plans) && value.plans.every(isPlan); }

function normalizePlan(plan: CoachTrainingPlan): CoachTrainingPlan {
  const completedById = new Map(plan.drills.map((drill) => [drill.id, drill.completed]));
  const status = plan.status === 'cancelled' ? 'upcoming' : plan.status;
  return {
    ...plan,
    dateLabel: seedTrainingPlan.dateLabel,
    status,
    focusAreaIds: plan.focusAreaIds.slice(0, 3),
    drills: seedTrainingPlan.drills.map((drill) => ({ ...drill, completed: completedById.get(drill.id) ?? false })),
    assignedLessonIds: plan.assignedLessonIds.slice(0, 2),
    completedAt: status === 'completed' ? plan.completedAt : undefined,
  };
}

export const trainingPlanService = {
  async load() { const result = await readStoredValueResult(storageKeys.trainingPlans, isPayload); return { plans: result.value?.plans.length ? result.value.plans.map(normalizePlan) : [seedTrainingPlan], failed: result.failed }; },
  async save(plans: readonly CoachTrainingPlan[]) { return writeStoredValue(storageKeys.trainingPlans, { plans } satisfies TrainingPlanStoragePayload); },
};
