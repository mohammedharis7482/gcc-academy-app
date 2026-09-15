import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { adminDemoConfig } from '@/config/admin';
import { useAdminAnnouncements } from '@/contexts/admin-announcements-context';
import { buildAdminOverview, buildCoachSalaries, buildCollectionSummary, buildExpenseBreakdown, buildMoneySummary, buildSquadReports, seedAdminDirectory } from '@/data/admin';
import { adminService, emptyAdminOperations } from '@/services/admin-service';
import { AdminActivityEntry, AdminAnnouncementInput, AdminAnnouncementRecord, AdminApprovalItem, AdminCoach, AdminCoachInput, AdminDirectory, AdminEnrolmentInput, AdminExpense, AdminExpenseInput, AdminFeeRecord, AdminIncome, AdminIncomeInput, AdminMember, AdminMemberEditInput, AdminOperationsPayload, AdminPaymentInput, AdminSalaryPaymentInput, AdminSquad, AdminSquadOverride, ApprovalState } from '@/types/admin';
import { formatCurrency } from '@/utils/format';

type AdminDataStatus = 'loading' | 'ready' | 'error';
interface SaveResult<T> { readonly value?: T; readonly error?: string }

const currentPeriod = adminDemoConfig.billing.currentPeriod;
/** Records are stamped with the scripted demo date, not the device clock. */
function todayLabel() { return adminDemoConfig.recordDateLabel; }

interface AdminDataContextValue {
  readonly status: AdminDataStatus;
  readonly isSaving: boolean;
  readonly storageWarning: boolean;
  readonly directory: AdminDirectory;
  readonly members: readonly AdminMember[];
  readonly coaches: readonly AdminCoach[];
  readonly squads: readonly AdminSquad[];
  readonly feeRecords: readonly AdminFeeRecord[];
  readonly approvals: readonly AdminApprovalItem[];
  readonly activity: readonly AdminActivityEntry[];
  readonly announcements: readonly AdminAnnouncementRecord[];
  readonly expenses: readonly AdminExpense[];
  readonly incomes: readonly AdminIncome[];
  getMember: (id: string) => AdminMember | undefined;
  getCoach: (id: string) => AdminCoach | undefined;
  getSquad: (id: string) => AdminSquad | undefined;
  getFeeRecord: (id: string) => AdminFeeRecord | undefined;
  getMemberFees: (memberId: string) => readonly AdminFeeRecord[];
  getSquadMembers: (squadId: string) => readonly AdminMember[];
  getCollectionSummary: (period: string) => ReturnType<typeof buildCollectionSummary>;
  getSquadReports: (period: string) => ReturnType<typeof buildSquadReports>;
  getMoneySummary: (period: string) => ReturnType<typeof buildMoneySummary>;
  getExpenseBreakdown: (period: string) => ReturnType<typeof buildExpenseBreakdown>;
  getCoachSalaries: (period: string) => ReturnType<typeof buildCoachSalaries>;
  getExpense: (id: string) => AdminExpense | undefined;
  readonly overview: ReturnType<typeof buildAdminOverview>;
  recordPayment: (input: AdminPaymentInput) => Promise<SaveResult<AdminFeeRecord>>;
  decideApproval: (approvalId: string, state: Exclude<ApprovalState, 'pending'>) => Promise<SaveResult<AdminApprovalItem>>;
  enrolMember: (input: AdminEnrolmentInput) => Promise<SaveResult<AdminMember>>;
  addCoach: (input: AdminCoachInput) => Promise<SaveResult<AdminCoach>>;
  postAnnouncement: (input: AdminAnnouncementInput) => Promise<SaveResult<AdminAnnouncementRecord>>;
  updateSquad: (override: AdminSquadOverride) => Promise<SaveResult<AdminSquad>>;
  updateMember: (input: AdminMemberEditInput) => Promise<SaveResult<AdminMember>>;
  recordExpense: (input: AdminExpenseInput) => Promise<SaveResult<AdminExpense>>;
  recordIncome: (input: AdminIncomeInput) => Promise<SaveResult<AdminIncome>>;
  payCoachSalary: (input: AdminSalaryPaymentInput) => Promise<SaveResult<AdminExpense>>;
  retry: () => void;
}

const AdminDataContext = createContext<AdminDataContextValue | undefined>(undefined);

/**
 * Admin read model. The typed local directory is merged with the operations the
 * Admin has saved on this device, so every screen reads one consistent state
 * without any network layer.
 */
export function AdminDataProvider({ children }: { readonly children: ReactNode }) {
  const { refresh: refreshPlayerAnnouncementFeed } = useAdminAnnouncements();
  const [directory, setDirectory] = useState<AdminDirectory>(seedAdminDirectory);
  const [operations, setOperations] = useState<AdminOperationsPayload>(emptyAdminOperations);
  const operationsRef = useRef(operations);
  const savingRef = useRef(false);
  const [status, setStatus] = useState<AdminDataStatus>('loading');
  const [isSaving, setIsSaving] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);

  useEffect(() => { operationsRef.current = operations; }, [operations]);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [loadedDirectory, loadedOperations] = await Promise.all([adminService.loadDirectory(), adminService.loadOperations()]);
      setDirectory(loadedDirectory);
      setOperations(loadedOperations.payload);
      operationsRef.current = loadedOperations.payload;
      setStorageWarning(loadedOperations.failed);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const persist = useCallback(async (next: AdminOperationsPayload) => {
    if (savingRef.current) return false;
    savingRef.current = true;
    setIsSaving(true);
    const saved = await adminService.saveOperations(next);
    if (saved) {
      setOperations(next);
      operationsRef.current = next;
      setStorageWarning(false);
    } else setStorageWarning(true);
    savingRef.current = false;
    setIsSaving(false);
    return saved;
  }, []);

  const approvedApprovals = useMemo(() => {
    const approvedIds = new Set(operations.decisions.filter((decision) => decision.state === 'approved').map((decision) => decision.approvalId));
    return directory.approvals.filter((approval) => approvedIds.has(approval.id));
  }, [directory.approvals, operations.decisions]);

  const squads = useMemo(() => directory.squads.map<AdminSquad>((squad) => {
    const override = operations.squadOverrides.find((item) => item.squadId === squad.id);
    if (!override) return squad;
    return {
      ...squad,
      headCoachId: override.headCoachId ?? squad.headCoachId,
      batch: override.batch ?? squad.batch,
      ground: override.ground ?? squad.ground,
      monthlyFee: override.monthlyFee ?? squad.monthlyFee,
      status: override.status ?? squad.status,
    };
  }), [directory.squads, operations.squadOverrides]);

  const coaches = useMemo(() => [...operations.coaches, ...directory.coaches], [directory.coaches, operations.coaches]);

  const expenses = useMemo(() => [...operations.expenses, ...directory.expenses], [directory.expenses, operations.expenses]);
  const incomes = useMemo(() => [...operations.incomes, ...directory.incomes], [directory.incomes, operations.incomes]);

  const feeRecords = useMemo(() => {
    const concessions = new Map<string, number>();
    approvedApprovals.forEach((approval) => { if (approval.kind === 'fee-concession' && approval.memberId && approval.amount) concessions.set(approval.memberId, approval.amount); });
    const payments = new Map(operations.payments.map((payment) => [payment.feeId, payment]));
    const created = operations.enrolments.map<AdminFeeRecord>((member) => ({ id: `fee-${member.id}-current`, memberId: member.id, memberName: member.name, playerId: member.playerId, squadId: member.squadId, squadName: member.squadName, period: currentPeriod, amount: member.monthlyFee, status: 'pending', dueDate: member.feeDueDate }));
    return [...created, ...directory.feeRecords].map((record) => {
      const concession = record.period === currentPeriod ? concessions.get(record.memberId) ?? 0 : 0;
      const amount = Math.max(0, record.amount - concession);
      const payment = payments.get(record.id);
      return payment ? { ...record, amount, status: 'paid' as const, paidOn: payment.recordedOn, method: payment.method, reference: payment.reference } : { ...record, amount };
    });
  }, [approvedApprovals, directory.feeRecords, operations.enrolments, operations.payments]);

  const members = useMemo(() => [...operations.enrolments, ...directory.members].map((member) => {
    let next = member;
    approvedApprovals.forEach((approval) => {
      if (approval.memberId !== member.id) return;
      if (approval.kind === 'enrolment') next = { ...next, enrolment: 'active' };
      if (approval.kind === 'squad-transfer' && approval.targetSquadId) {
        const squad = squads.find((item) => item.id === approval.targetSquadId);
        if (squad) next = { ...next, squadId: squad.id, squadName: squad.name, category: squad.ageCategory, monthlyFee: squad.monthlyFee };
      }
    });
    const override = operations.memberOverrides.find((item) => item.memberId === member.id);
    if (override) {
      const squad = squads.find((item) => item.id === override.squadId);
      next = {
        ...next, name: override.name, age: override.age, position: override.position,
        plan: override.plan, enrolment: override.enrolment, guardian: override.guardian,
        ...(squad ? { squadId: squad.id, squadName: squad.name, category: squad.ageCategory, monthlyFee: squad.monthlyFee } : {}),
      };
    }
    const current = feeRecords.find((record) => record.memberId === member.id && record.period === currentPeriod);
    return current ? { ...next, feeStatus: current.status, feeDueDate: current.dueDate, outstandingAmount: current.status === 'paid' ? 0 : current.amount } : next;
  }), [approvedApprovals, directory.members, feeRecords, operations.enrolments, operations.memberOverrides, squads]);

  const approvals = useMemo(() => directory.approvals.map<AdminApprovalItem>((approval) => {
    const decision = operations.decisions.find((item) => item.approvalId === approval.id);
    return { ...approval, state: decision?.state ?? 'pending', decidedOn: decision?.decidedOn };
  }), [directory.approvals, operations.decisions]);

  const activity = useMemo(() => {
    const memberName = (memberId: string) => members.find((member) => member.id === memberId)?.name ?? 'Academy member';
    const generated: AdminActivityEntry[] = [
      ...operations.payments.map<AdminActivityEntry>((payment) => ({ id: `activity-payment-${payment.feeId}`, kind: 'payment', title: 'Fee payment recorded', summary: `${memberName(payment.memberId)} · ${formatCurrency(payment.amount)} by ${payment.method}.`, at: payment.recordedOn })),
      ...operations.decisions.map<AdminActivityEntry>((decision) => ({ id: `activity-approval-${decision.approvalId}`, kind: 'approval', title: decision.state === 'approved' ? 'Request approved' : 'Request declined', summary: directory.approvals.find((approval) => approval.id === decision.approvalId)?.title ?? 'Academy request', at: decision.decidedOn })),
      ...operations.enrolments.map<AdminActivityEntry>((member) => ({ id: `activity-enrolment-${member.id}`, kind: 'enrolment', title: 'New member enrolled', summary: `${member.name} joined the ${member.squadName}.`, at: member.enrolledOn })),
      ...operations.coaches.map<AdminActivityEntry>((coach) => ({ id: `activity-coach-${coach.id}`, kind: 'coach', title: 'Coach added', summary: `${coach.name} joined as ${coach.roleTitle}.`, at: coach.joinedOn })),
      ...operations.announcements.map<AdminActivityEntry>((announcement) => ({ id: `activity-announcement-${announcement.id}`, kind: 'announcement', title: 'Academy announcement published', summary: announcement.title, at: announcement.publishedAt })),
      ...operations.memberOverrides.map<AdminActivityEntry>((override) => ({ id: `activity-member-edit-${override.memberId}`, kind: 'enrolment', title: 'Member record updated', summary: `${override.name}'s details were corrected.`, at: override.updatedOn })),
      ...operations.expenses.map<AdminActivityEntry>((expense) => ({ id: `activity-expense-${expense.id}`, kind: 'expense', title: expense.category === 'Coach Salary' ? 'Coach salary paid' : 'Money out recorded', summary: `${expense.category} · ${formatCurrency(expense.amount)} to ${expense.paidTo}.`, at: expense.date })),
      ...operations.incomes.map<AdminActivityEntry>((income) => ({ id: `activity-income-${income.id}`, kind: 'income', title: 'Money in recorded', summary: `${income.category} · ${formatCurrency(income.amount)} from ${income.receivedFrom}.`, at: income.date })),
      ...operations.squadOverrides.map<AdminActivityEntry>((override) => ({ id: `activity-squad-${override.squadId}`, kind: 'squad', title: 'Squad details updated', summary: `${squads.find((squad) => squad.id === override.squadId)?.name ?? 'Squad'} settings were changed.`, at: todayLabel() })),
    ];
    return [...generated, ...directory.activity];
  }, [directory.activity, directory.approvals, members, operations, squads]);

  const announcements = operations.announcements;

  const overview = useMemo(() => buildAdminOverview(members, coaches, squads, approvals.filter((approval) => approval.state === 'pending').length), [approvals, coaches, members, squads]);

  const getMember = useCallback((id: string) => members.find((member) => member.id === id || member.playerId === id), [members]);
  const getCoach = useCallback((id: string) => coaches.find((coach) => coach.id === id), [coaches]);
  const getSquad = useCallback((id: string) => squads.find((squad) => squad.id === id), [squads]);
  const getFeeRecord = useCallback((id: string) => feeRecords.find((record) => record.id === id), [feeRecords]);
  const getMemberFees = useCallback((memberId: string) => feeRecords.filter((record) => record.memberId === memberId), [feeRecords]);
  const getSquadMembers = useCallback((squadId: string) => members.filter((member) => member.squadId === squadId), [members]);
  const getCollectionSummary = useCallback((period: string) => buildCollectionSummary(feeRecords, period), [feeRecords]);
  const getSquadReports = useCallback((period: string) => buildSquadReports(members, squads, feeRecords, period), [feeRecords, members, squads]);
  const getMoneySummary = useCallback((period: string) => buildMoneySummary(feeRecords, incomes, expenses, period), [expenses, feeRecords, incomes]);
  const getExpenseBreakdown = useCallback((period: string) => buildExpenseBreakdown(expenses, period), [expenses]);
  const getCoachSalaries = useCallback((period: string) => buildCoachSalaries(coaches, expenses, period), [coaches, expenses]);
  const getExpense = useCallback((id: string) => expenses.find((expense) => expense.id === id), [expenses]);

  const recordPayment = useCallback(async (input: AdminPaymentInput): Promise<SaveResult<AdminFeeRecord>> => {
    const record = feeRecords.find((item) => item.id === input.feeId);
    if (!record) return { error: 'This fee record is no longer available.' };
    if (record.status === 'paid') return { error: 'This fee has already been collected.' };
    const recordedOn = todayLabel();
    const next: AdminOperationsPayload = { ...operationsRef.current, payments: [{ feeId: record.id, memberId: record.memberId, amount: record.amount, method: input.method, reference: input.reference.trim() || `GCCP-${Date.now().toString().slice(-6)}`, recordedOn, recordedBy: adminDemoConfig.admin.name }, ...operationsRef.current.payments] };
    return await persist(next) ? { value: { ...record, status: 'paid', paidOn: recordedOn, method: input.method, reference: input.reference } } : { error: 'The payment could not be saved on this device.' };
  }, [feeRecords, persist]);

  const decideApproval = useCallback(async (approvalId: string, state: Exclude<ApprovalState, 'pending'>): Promise<SaveResult<AdminApprovalItem>> => {
    const approval = approvals.find((item) => item.id === approvalId);
    if (!approval) return { error: 'This request is no longer available.' };
    if (approval.state !== 'pending') return { error: 'This request has already been reviewed.' };
    const decidedOn = todayLabel();
    const next: AdminOperationsPayload = { ...operationsRef.current, decisions: [{ approvalId, state, decidedOn, decidedBy: adminDemoConfig.admin.name }, ...operationsRef.current.decisions] };
    return await persist(next) ? { value: { ...approval, state, decidedOn } } : { error: 'The decision could not be saved on this device.' };
  }, [approvals, persist]);

  const enrolMember = useCallback(async (input: AdminEnrolmentInput): Promise<SaveResult<AdminMember>> => {
    const squad = squads.find((item) => item.id === input.squadId);
    if (!squad) return { error: 'Select a squad for this member.' };
    if (getSquadMembers(squad.id).filter((member) => member.enrolment !== 'left').length >= squad.capacity) return { error: `${squad.name} has reached its capacity of ${squad.capacity} players.` };
    const usedJerseys = new Set(getSquadMembers(squad.id).map((member) => member.jerseyNumber));
    let jerseyNumber = 1;
    while (usedJerseys.has(jerseyNumber)) jerseyNumber += 1;
    const sequence = operationsRef.current.enrolments.length + 1;
    const value: AdminMember = {
      id: `admin-member-${Date.now()}`,
      playerId: `GCC-${squad.ageCategory}-${String(900 + sequence).padStart(3, '0')}`,
      name: input.name.trim(),
      category: squad.ageCategory,
      squadId: squad.id,
      squadName: squad.name,
      jerseyNumber,
      age: input.age,
      position: input.position,
      enrolment: input.enrolment,
      enrolledOn: todayLabel(),
      plan: input.plan,
      monthlyFee: input.monthlyFee,
      feeStatus: 'pending',
      feeDueDate: adminDemoConfig.billing.dueDate,
      outstandingAmount: input.monthlyFee,
      attendancePercent: 0,
      coachName: coaches.find((coach) => coach.id === squad.headCoachId)?.name ?? 'Unassigned',
      guardian: input.guardian,
      source: 'admin-created',
    };
    const next: AdminOperationsPayload = { ...operationsRef.current, enrolments: [value, ...operationsRef.current.enrolments] };
    return await persist(next) ? { value } : { error: 'The enrolment could not be saved on this device.' };
  }, [coaches, getSquadMembers, persist, squads]);

  const addCoach = useCallback(async (input: AdminCoachInput): Promise<SaveResult<AdminCoach>> => {
    if (!input.squadIds.length) return { error: 'Assign at least one squad to this coach.' };
    const value: AdminCoach = { ...input, id: `admin-coach-${Date.now()}`, name: input.name.trim(), joinedOn: todayLabel(), sessionsThisMonth: 0, source: 'admin-created' };
    const next: AdminOperationsPayload = { ...operationsRef.current, coaches: [value, ...operationsRef.current.coaches] };
    return await persist(next) ? { value } : { error: 'The coach record could not be saved on this device.' };
  }, [persist]);

  const postAnnouncement = useCallback(async (input: AdminAnnouncementInput): Promise<SaveResult<AdminAnnouncementRecord>> => {
    const value: AdminAnnouncementRecord = { ...input, id: `admin-announcement-${Date.now()}`, publishedBy: adminDemoConfig.admin.name, publishedAt: todayLabel() };
    const next: AdminOperationsPayload = { ...operationsRef.current, announcements: [value, ...operationsRef.current.announcements] };
    if (!await persist(next)) return { error: 'The announcement could not be saved on this device.' };
    // The Player Updates bridge lives in the root layout, so tell it to re-read.
    refreshPlayerAnnouncementFeed();
    return { value };
  }, [persist, refreshPlayerAnnouncementFeed]);

  const updateSquad = useCallback(async (override: AdminSquadOverride): Promise<SaveResult<AdminSquad>> => {
    const squad = squads.find((item) => item.id === override.squadId);
    if (!squad) return { error: 'This squad is no longer available.' };
    const next: AdminOperationsPayload = { ...operationsRef.current, squadOverrides: [override, ...operationsRef.current.squadOverrides.filter((item) => item.squadId !== override.squadId)] };
    const value: AdminSquad = { ...squad, headCoachId: override.headCoachId ?? squad.headCoachId, batch: override.batch ?? squad.batch, ground: override.ground ?? squad.ground, monthlyFee: override.monthlyFee ?? squad.monthlyFee, status: override.status ?? squad.status };
    return await persist(next) ? { value } : { error: 'The squad could not be saved on this device.' };
  }, [persist, squads]);

  const updateMember = useCallback(async (input: AdminMemberEditInput): Promise<SaveResult<AdminMember>> => {
    const member = members.find((item) => item.id === input.memberId);
    if (!member) return { error: 'This member is no longer available.' };
    const squad = squads.find((item) => item.id === input.squadId);
    if (!squad) return { error: 'Select a squad for this member.' };
    if (squad.id !== member.squadId) {
      const occupied = getSquadMembers(squad.id).filter((item) => item.enrolment !== 'left' && item.id !== member.id).length;
      if (occupied >= squad.capacity) return { error: `${squad.name} has reached its capacity of ${squad.capacity} players.` };
    }
    const value: AdminMember = {
      ...member, name: input.name.trim(), age: input.age, position: input.position, plan: input.plan,
      enrolment: input.enrolment, guardian: input.guardian,
      squadId: squad.id, squadName: squad.name, category: squad.ageCategory, monthlyFee: squad.monthlyFee,
    };
    const override = { ...input, name: input.name.trim(), updatedOn: todayLabel(), updatedBy: adminDemoConfig.admin.name };
    const next: AdminOperationsPayload = { ...operationsRef.current, memberOverrides: [override, ...operationsRef.current.memberOverrides.filter((item) => item.memberId !== input.memberId)] };
    return await persist(next) ? { value } : { error: 'The member could not be saved on this device.' };
  }, [getSquadMembers, members, persist, squads]);

  const recordExpense = useCallback(async (input: AdminExpenseInput): Promise<SaveResult<AdminExpense>> => {
    if (!(input.amount > 0)) return { error: 'Enter an amount greater than zero.' };
    if (!input.paidTo.trim()) return { error: 'Enter who this was paid to.' };
    const value: AdminExpense = {
      id: `admin-expense-${Date.now()}`, category: input.category, amount: input.amount, date: todayLabel(), period: currentPeriod,
      paidTo: input.paidTo.trim(), method: input.method, note: input.note.trim(), recordedBy: adminDemoConfig.admin.name, source: 'admin-created',
    };
    const next: AdminOperationsPayload = { ...operationsRef.current, expenses: [value, ...operationsRef.current.expenses] };
    return await persist(next) ? { value } : { error: 'The expense could not be saved on this device.' };
  }, [persist]);

  const recordIncome = useCallback(async (input: AdminIncomeInput): Promise<SaveResult<AdminIncome>> => {
    if (!(input.amount > 0)) return { error: 'Enter an amount greater than zero.' };
    if (!input.receivedFrom.trim()) return { error: 'Enter who this was received from.' };
    const value: AdminIncome = {
      id: `admin-income-${Date.now()}`, category: input.category, amount: input.amount, date: todayLabel(), period: currentPeriod,
      receivedFrom: input.receivedFrom.trim(), method: input.method, note: input.note.trim(), recordedBy: adminDemoConfig.admin.name, source: 'admin-created',
    };
    const next: AdminOperationsPayload = { ...operationsRef.current, incomes: [value, ...operationsRef.current.incomes] };
    return await persist(next) ? { value } : { error: 'The income could not be saved on this device.' };
  }, [persist]);

  /**
   * One action, both records: paying a coach salary writes a single Coach Salary
   * expense. The salary status is read back from that expense, so Money Out and
   * the salary screen can never drift apart.
   */
  const payCoachSalary = useCallback(async (input: AdminSalaryPaymentInput): Promise<SaveResult<AdminExpense>> => {
    const coach = coaches.find((item) => item.id === input.coachId);
    if (!coach) return { error: 'This coach is no longer available.' };
    const alreadyPaid = expenses.some((expense) => expense.category === 'Coach Salary' && expense.coachId === coach.id && expense.period === input.period);
    if (alreadyPaid) return { error: `${coach.name}'s ${input.period} salary has already been paid.` };
    const value: AdminExpense = {
      id: `admin-expense-salary-${coach.id}-${Date.now()}`, category: 'Coach Salary', amount: coach.monthlySalary, date: todayLabel(), period: input.period,
      paidTo: `Coach ${coach.name}`, method: input.method, note: input.note.trim() || `${input.period} salary`, recordedBy: adminDemoConfig.admin.name,
      coachId: coach.id, source: 'admin-created',
    };
    const next: AdminOperationsPayload = { ...operationsRef.current, expenses: [value, ...operationsRef.current.expenses] };
    return await persist(next) ? { value } : { error: 'The salary payment could not be saved on this device.' };
  }, [coaches, expenses, persist]);

  const value = useMemo(() => ({
    status, isSaving, storageWarning, directory, members, coaches, squads, feeRecords, approvals, activity,
    announcements, expenses, incomes, overview,
    getMember, getCoach, getSquad, getFeeRecord, getMemberFees, getSquadMembers, getCollectionSummary, getSquadReports,
    getMoneySummary, getExpenseBreakdown, getCoachSalaries, getExpense,
    recordPayment, decideApproval, enrolMember, addCoach, postAnnouncement, updateSquad, updateMember,
    recordExpense, recordIncome, payCoachSalary, retry: load,
  }), [activity, addCoach, announcements, approvals, coaches, decideApproval, directory, enrolMember, expenses, feeRecords, getCoach, getCoachSalaries, getCollectionSummary, getExpense, getExpenseBreakdown, getFeeRecord, getMember, getMemberFees, getMoneySummary, getSquad, getSquadMembers, getSquadReports, incomes, isSaving, load, members, overview, payCoachSalary, postAnnouncement, recordExpense, recordIncome, recordPayment, squads, status, storageWarning, updateMember, updateSquad]);

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const value = useContext(AdminDataContext);
  if (!value) throw new Error('useAdminData must be used inside AdminDataProvider');
  return value;
}
