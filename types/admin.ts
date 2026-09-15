import { AgeCategory } from '@/types/academy';
import { AcademyUpdateCategory } from '@/types/updates';

export type AdminRole = 'owner' | 'manager' | 'front-desk';
export type EnrolmentStatus = 'active' | 'trial' | 'paused' | 'left';
export type AdminFeeStatus = 'paid' | 'pending' | 'overdue';
export type CoachEngagement = 'Full-time' | 'Part-time' | 'Guest';
export type CoachAvailability = 'available' | 'on-leave';
export type SquadStatus = 'open' | 'full' | 'paused';
export type ApprovalKind = 'enrolment' | 'squad-transfer' | 'fee-concession' | 'coach-leave';
export type ApprovalState = 'pending' | 'approved' | 'declined';
export type AdminActivityKind = 'payment' | 'enrolment' | 'approval' | 'announcement' | 'coach' | 'squad' | 'expense' | 'income';
export type AdminAnnouncementAudience = 'all-players' | 'selected-categories' | 'coaches';
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'UPI';
export type ExpenseCategory = 'Coach Salary' | 'Ground Rent' | 'Equipment' | 'Transportation' | 'Tournament' | 'Events' | 'Marketing' | 'Maintenance' | 'Office' | 'Other';
export type IncomeCategory = 'Camp Fees' | 'Tournament Fees' | 'Sponsorship' | 'Merchandise' | 'Other';
export type SalaryStatus = 'pending' | 'paid';

export interface AdminSession {
  readonly schemaVersion: 1;
  readonly adminId: string;
  readonly displayName: string;
  readonly role: AdminRole;
  readonly academyId: string;
  readonly signedInAt: string;
}

export interface AdminSignInCredentials {
  readonly identifier: string;
  readonly password: string;
}

export interface AdminGuardian {
  readonly name: string;
  readonly relationship: string;
  readonly phone: string;
  readonly email: string;
}

export interface AdminMember {
  readonly id: string;
  readonly playerId: string;
  readonly name: string;
  readonly category: AgeCategory;
  readonly squadId: string;
  readonly squadName: string;
  readonly jerseyNumber: number;
  readonly age: number;
  readonly position: string;
  readonly enrolment: EnrolmentStatus;
  readonly enrolledOn: string;
  readonly plan: string;
  readonly monthlyFee: number;
  readonly feeStatus: AdminFeeStatus;
  readonly feeDueDate: string;
  readonly outstandingAmount: number;
  readonly attendancePercent: number;
  readonly coachName: string;
  readonly guardian: AdminGuardian;
  readonly source: 'seed' | 'admin-created';
}

export interface AdminCoach {
  readonly id: string;
  readonly name: string;
  readonly roleTitle: string;
  readonly engagement: CoachEngagement;
  readonly availability: CoachAvailability;
  readonly squadIds: readonly string[];
  readonly phoneMasked: string;
  readonly email: string;
  readonly certification: string;
  readonly joinedOn: string;
  readonly sessionsThisMonth: number;
  readonly monthlySalary: number;
  readonly source: 'seed' | 'admin-created';
}

export interface AdminSquad {
  readonly id: string;
  readonly name: string;
  readonly ageCategory: AgeCategory;
  readonly batch: string;
  readonly trainingDays: readonly string[];
  readonly ground: string;
  readonly headCoachId: string;
  readonly assistantCoachIds: readonly string[];
  readonly capacity: number;
  readonly monthlyFee: number;
  readonly status: SquadStatus;
}

export interface AdminFeeRecord {
  readonly id: string;
  readonly memberId: string;
  readonly memberName: string;
  readonly playerId: string;
  readonly squadId: string;
  readonly squadName: string;
  readonly period: string;
  readonly amount: number;
  readonly status: AdminFeeStatus;
  readonly dueDate: string;
  readonly paidOn?: string;
  readonly method?: PaymentMethod;
  readonly reference?: string;
}

/** Money out. A Coach Salary expense carries the `coachId` it paid. */
export interface AdminExpense {
  readonly id: string;
  readonly category: ExpenseCategory;
  readonly amount: number;
  readonly date: string;
  readonly period: string;
  readonly paidTo: string;
  readonly method: PaymentMethod;
  readonly note: string;
  readonly recordedBy: string;
  readonly coachId?: string;
  readonly source: 'seed' | 'admin-created';
}

/** Money in that is not a player fee. */
export interface AdminIncome {
  readonly id: string;
  readonly category: IncomeCategory;
  readonly amount: number;
  readonly date: string;
  readonly period: string;
  readonly receivedFrom: string;
  readonly method: PaymentMethod;
  readonly note: string;
  readonly recordedBy: string;
  readonly source: 'seed' | 'admin-created';
}

/**
 * A coach's salary for one period. Status is derived: a salary counts as paid
 * when a Coach Salary expense exists for that coach and period, so the salary
 * screen and Money Out can never disagree.
 */
export interface AdminCoachSalary {
  readonly coachId: string;
  readonly coachName: string;
  readonly roleTitle: string;
  readonly engagement: CoachEngagement;
  readonly period: string;
  readonly amount: number;
  readonly status: SalaryStatus;
  readonly paidOn?: string;
  readonly method?: PaymentMethod;
  readonly expenseId?: string;
}

export interface AdminApproval {
  readonly id: string;
  readonly kind: ApprovalKind;
  readonly title: string;
  readonly summary: string;
  readonly requestedBy: string;
  readonly requestedOn: string;
  readonly memberId?: string;
  readonly targetSquadId?: string;
  readonly amount?: number;
}

export interface AdminApprovalItem extends AdminApproval {
  readonly state: ApprovalState;
  readonly decidedOn?: string;
}

export interface AdminActivityEntry {
  readonly id: string;
  readonly kind: AdminActivityKind;
  readonly title: string;
  readonly summary: string;
  readonly at: string;
}

export interface AdminAnnouncementRecord {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  /** Category the Player Updates feed files this under. Optional so saves made before it existed still load. */
  readonly category?: AcademyUpdateCategory;
  readonly audience: AdminAnnouncementAudience;
  readonly categoryIds: readonly string[];
  readonly priority: 'normal' | 'important';
  readonly publishedBy: string;
  readonly publishedAt: string;
}

export interface AdminAcademyProfile {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly registrationId: string;
  readonly establishedYear: number;
  readonly address: string;
  readonly phone: string;
  readonly email: string;
  readonly grounds: readonly string[];
}

export interface AdminDirectory {
  readonly profile: AdminAcademyProfile;
  readonly members: readonly AdminMember[];
  readonly coaches: readonly AdminCoach[];
  readonly squads: readonly AdminSquad[];
  readonly feeRecords: readonly AdminFeeRecord[];
  readonly expenses: readonly AdminExpense[];
  readonly incomes: readonly AdminIncome[];
  readonly approvals: readonly AdminApproval[];
  readonly activity: readonly AdminActivityEntry[];
}

export interface AdminPayment {
  readonly feeId: string;
  readonly memberId: string;
  readonly amount: number;
  readonly method: PaymentMethod;
  readonly reference: string;
  readonly recordedOn: string;
  readonly recordedBy: string;
}

export interface AdminApprovalDecision {
  readonly approvalId: string;
  readonly state: Exclude<ApprovalState, 'pending'>;
  readonly decidedOn: string;
  readonly decidedBy: string;
}

/** An admin correction to an enrolled member's own details. Replaces the seed values. */
export interface AdminMemberOverride {
  readonly memberId: string;
  readonly name: string;
  readonly age: number;
  readonly position: string;
  readonly plan: string;
  readonly enrolment: EnrolmentStatus;
  readonly squadId: string;
  readonly guardian: AdminGuardian;
  readonly updatedOn: string;
  readonly updatedBy: string;
}

export type AdminMemberEditInput = Omit<AdminMemberOverride, 'updatedOn' | 'updatedBy'>;

export interface AdminSquadOverride {
  readonly squadId: string;
  readonly headCoachId?: string;
  readonly batch?: string;
  readonly ground?: string;
  readonly monthlyFee?: number;
  readonly status?: SquadStatus;
}

export interface AdminOperationsPayload {
  readonly payments: readonly AdminPayment[];
  readonly decisions: readonly AdminApprovalDecision[];
  readonly enrolments: readonly AdminMember[];
  readonly coaches: readonly AdminCoach[];
  readonly announcements: readonly AdminAnnouncementRecord[];
  readonly squadOverrides: readonly AdminSquadOverride[];
  readonly expenses: readonly AdminExpense[];
  readonly incomes: readonly AdminIncome[];
  readonly memberOverrides: readonly AdminMemberOverride[];
}

export interface AdminOverview {
  readonly totalMembers: number;
  readonly activeMembers: number;
  readonly trialMembers: number;
  readonly pausedMembers: number;
  readonly totalCoaches: number;
  readonly availableCoaches: number;
  readonly totalSquads: number;
  readonly capacityUsedPercent: number;
  readonly averageAttendance: number;
  readonly pendingApprovals: number;
}

export interface AdminCollectionSummary {
  readonly period: string;
  readonly billed: number;
  readonly collected: number;
  readonly pending: number;
  readonly overdue: number;
  readonly collectionRate: number;
  readonly paidCount: number;
  readonly pendingCount: number;
  readonly overdueCount: number;
}

/** Money In, Money Out, and Net for one period, in plain language. */
export interface AdminMoneySummary {
  readonly period: string;
  readonly moneyIn: number;
  readonly feeIncome: number;
  readonly otherIncome: number;
  readonly moneyOut: number;
  readonly net: number;
  readonly incomeCount: number;
  readonly expenseCount: number;
}

export interface AdminExpenseBreakdownRow {
  readonly category: ExpenseCategory;
  readonly amount: number;
  readonly share: number;
  readonly count: number;
}

export interface AdminSquadReport {
  readonly squadId: string;
  readonly squadName: string;
  readonly memberCount: number;
  readonly capacity: number;
  readonly averageAttendance: number;
  readonly collectionRate: number;
  readonly outstandingAmount: number;
}

export interface AdminEnrolmentInput {
  readonly name: string;
  readonly category: AgeCategory;
  readonly squadId: string;
  readonly age: number;
  readonly position: string;
  readonly plan: string;
  readonly monthlyFee: number;
  readonly enrolment: EnrolmentStatus;
  readonly guardian: AdminGuardian;
}

export interface AdminCoachInput {
  readonly name: string;
  readonly roleTitle: string;
  readonly engagement: CoachEngagement;
  readonly monthlySalary: number;
  readonly availability: CoachAvailability;
  readonly squadIds: readonly string[];
  readonly phoneMasked: string;
  readonly email: string;
  readonly certification: string;
}

export interface AdminPaymentInput {
  readonly feeId: string;
  readonly method: PaymentMethod;
  readonly reference: string;
}

export interface AdminExpenseInput {
  readonly category: ExpenseCategory;
  readonly amount: number;
  readonly paidTo: string;
  readonly method: PaymentMethod;
  readonly note: string;
}

export interface AdminIncomeInput {
  readonly category: IncomeCategory;
  readonly amount: number;
  readonly receivedFrom: string;
  readonly method: PaymentMethod;
  readonly note: string;
}

export interface AdminSalaryPaymentInput {
  readonly coachId: string;
  readonly period: string;
  readonly method: PaymentMethod;
  readonly note: string;
}

export interface AdminAnnouncementInput {
  readonly title: string;
  readonly message: string;
  readonly category: AcademyUpdateCategory;
  readonly audience: AdminAnnouncementAudience;
  readonly categoryIds: readonly string[];
  readonly priority: 'normal' | 'important';
}
