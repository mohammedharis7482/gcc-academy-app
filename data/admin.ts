import { adminDemoConfig } from '@/config/admin';
import { demoConfig } from '@/config/demo';
import { sharedAcademyData } from '@/data/academy';
import { AcademyPlayer, AgeCategory } from '@/types/academy';
import { AdminAcademyProfile, AdminActivityEntry, AdminApproval, AdminCoach, AdminCollectionSummary, AdminDirectory, AdminFeeRecord, AdminFeeStatus, AdminMember, AdminOverview, AdminSquad, AdminSquadReport, EnrolmentStatus } from '@/types/admin';

const guardianFirstNames = ['Mohammed', 'Suresh', 'Ranjith', 'Fathima', 'Anil', 'Shiny', 'Basheer', 'Latha', 'Noushad', 'Geetha'] as const;
const relationships = ['Father', 'Mother', 'Father', 'Guardian', 'Mother'] as const;
const enrolmentPlans = ['Annual Development', 'Quarterly Development', 'Monthly Foundation'] as const;

function enrolmentForIndex(index: number, player: AcademyPlayer): EnrolmentStatus {
  if (player.membershipStatus === 'inactive') return 'left';
  if (player.membershipStatus === 'paused') return 'paused';
  if (index % 19 === 5) return 'trial';
  if (index % 23 === 11) return 'paused';
  if (index % 29 === 17) return 'left';
  return 'active';
}

/** FNV-1a with a final avalanche, so neighbouring player IDs do not land in neighbouring buckets. */
function stableBucket(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 15;
  return Math.abs(hash) % 100;
}

function feeStatusFor(player: AcademyPlayer, enrolment: EnrolmentStatus): AdminFeeStatus {
  if (enrolment === 'left') return 'paid';
  // Ayaan keeps the pending July fee the Player module already demonstrates.
  if (player.id === 'player-ayaan') return 'pending';
  const bucket = stableBucket(player.id);
  if (bucket < 10) return 'overdue';
  if (bucket < 28) return 'pending';
  return 'paid';
}

function guardianFor(player: AcademyPlayer, index: number) {
  const surname = player.name.split(' ').slice(-1)[0];
  return {
    name: `${guardianFirstNames[index % guardianFirstNames.length]} ${surname}`,
    relationship: relationships[index % relationships.length],
    phone: `+91 9${String(40000000 + index * 137791).slice(0, 9)}`,
    email: `${player.playerId.toLowerCase()}@guardian.gccacademy.in`,
  };
}

function monthlyFeeFor(category: AgeCategory) {
  return adminDemoConfig.billing.monthlyFeeByCategory[category];
}

function buildMember(player: AcademyPlayer, index: number): AdminMember {
  const squad = sharedAcademyData.squads.find((item) => item.id === player.squadId);
  const enrolment = enrolmentForIndex(index, player);
  const feeStatus = feeStatusFor(player, enrolment);
  const monthlyFee = monthlyFeeFor(player.category);
  const headCoach = sharedAcademyData.coach.id === squad?.headCoachId ? sharedAcademyData.coach.name : squad?.headCoachId.replace('coach-', '') ?? 'Unassigned';
  return {
    id: player.id,
    playerId: player.playerId,
    name: player.name,
    category: player.category,
    squadId: player.squadId,
    squadName: squad?.name ?? 'Unassigned squad',
    jerseyNumber: player.jerseyNumber,
    age: player.age,
    position: player.position,
    enrolment,
    enrolledOn: player.joiningDate,
    plan: enrolmentPlans[index % enrolmentPlans.length],
    monthlyFee,
    feeStatus,
    feeDueDate: adminDemoConfig.billing.dueDate,
    outstandingAmount: feeStatus === 'paid' ? 0 : monthlyFee,
    attendancePercent: player.attendance.percentage,
    coachName: headCoach.charAt(0).toUpperCase() + headCoach.slice(1),
    guardian: guardianFor(player, index),
    source: 'seed',
  };
}

const seedMembers: readonly AdminMember[] = sharedAcademyData.players.map(buildMember);

function buildFeeRecords(members: readonly AdminMember[]): readonly AdminFeeRecord[] {
  const historyPeriods = adminDemoConfig.billing.periods.filter((period) => period !== adminDemoConfig.billing.currentPeriod);
  return members.flatMap((member, index) => {
    const current: AdminFeeRecord = {
      id: `fee-${member.id}-current`, memberId: member.id, memberName: member.name, playerId: member.playerId,
      squadId: member.squadId, squadName: member.squadName, period: adminDemoConfig.billing.currentPeriod,
      amount: member.monthlyFee, status: member.feeStatus, dueDate: member.feeDueDate,
      ...(member.feeStatus === 'paid' ? { paidOn: '5 July 2026', method: 'Bank Transfer' as const, reference: `GCCP-${7000 + index}` } : {}),
    };
    const history = historyPeriods.map<AdminFeeRecord>((period, periodIndex) => ({
      id: `fee-${member.id}-${period.split(' ')[0].toLowerCase()}`, memberId: member.id, memberName: member.name, playerId: member.playerId,
      squadId: member.squadId, squadName: member.squadName, period, amount: member.monthlyFee, status: 'paid',
      dueDate: `15 ${period}`, paidOn: `${8 + (index % 6)} ${period}`, method: index % 3 === 0 ? 'Cash' : index % 3 === 1 ? 'UPI' : 'Bank Transfer',
      reference: `GCCP-${5000 + index * 3 + periodIndex}`,
    }));
    return [current, ...history];
  });
}

const seedCoaches: readonly AdminCoach[] = [
  { id: 'coach-sandeep', name: 'Sandeep', roleTitle: 'Technical Coach', engagement: 'Full-time', availability: 'available', squadIds: ['u13'], phoneMasked: '+91 98XXXXXX10', email: 'sandeep@gccacademy.in', certification: 'AIFF D Licence', joinedOn: '12 January 2022', sessionsThisMonth: 14, source: 'seed' },
  { id: 'coach-junaid', name: 'Junaid', roleTitle: 'Foundation Coach', engagement: 'Full-time', availability: 'available', squadIds: ['u10', 'u13'], phoneMasked: '+91 97XXXXXX44', email: 'junaid@gccacademy.in', certification: 'AIFF D Licence', joinedOn: '3 June 2022', sessionsThisMonth: 16, source: 'seed' },
  { id: 'coach-ramshad', name: 'Ramshad', roleTitle: 'Performance Coach', engagement: 'Full-time', availability: 'available', squadIds: ['u15'], phoneMasked: '+91 95XXXXXX21', email: 'ramshad@gccacademy.in', certification: 'AIFF C Licence', joinedOn: '20 August 2021', sessionsThisMonth: 13, source: 'seed' },
  { id: 'coach-ashil', name: 'Ashil', roleTitle: 'Assistant Coach', engagement: 'Part-time', availability: 'available', squadIds: ['u13'], phoneMasked: '+91 99XXXXXX07', email: 'ashil@gccacademy.in', certification: 'Grassroots Leader', joinedOn: '14 February 2024', sessionsThisMonth: 8, source: 'seed' },
  { id: 'coach-nithin', name: 'Nithin', roleTitle: 'Goalkeeping Coach', engagement: 'Guest', availability: 'on-leave', squadIds: ['u13', 'u15'], phoneMasked: '+91 90XXXXXX63', email: 'nithin@gccacademy.in', certification: 'Goalkeeping Level 1', joinedOn: '9 September 2025', sessionsThisMonth: 4, source: 'seed' },
];

const seedSquads: readonly AdminSquad[] = sharedAcademyData.squads.map((squad) => ({
  id: squad.id,
  name: squad.name,
  ageCategory: squad.ageCategory,
  batch: squad.batch,
  trainingDays: squad.trainingDays,
  ground: demoConfig.academy.primaryTrainingGround,
  headCoachId: squad.headCoachId,
  assistantCoachIds: squad.assistantCoachIds,
  capacity: adminDemoConfig.squadCapacity,
  monthlyFee: monthlyFeeFor(squad.ageCategory),
  status: squad.playerCount >= adminDemoConfig.squadCapacity ? 'full' : 'open',
}));

const seedApprovals: readonly AdminApproval[] = [
  { id: 'approval-enrolment-noel', kind: 'enrolment', title: 'Confirm U10 enrolment', summary: 'Noel James has completed the two-week trial and requests a full Foundation membership.', requestedBy: 'Coach Junaid', requestedOn: '10 July 2026', memberId: 'player-u10-19', amount: monthlyFeeFor('U10') },
  { id: 'approval-transfer-gokul', kind: 'squad-transfer', title: 'Squad transfer to U15', summary: 'Gokul Das is above the U13 age band from August and should move to the Performance Squad.', requestedBy: 'Coach Sandeep', requestedOn: '9 July 2026', memberId: 'player-u13-17', targetSquadId: 'u15' },
  { id: 'approval-concession-mazin', kind: 'fee-concession', title: 'Sibling fee concession', summary: 'A 20% sibling concession has been requested for the July billing cycle.', requestedBy: 'Front desk', requestedOn: '8 July 2026', memberId: 'player-u13-20', amount: 240 },
  { id: 'approval-leave-nithin', kind: 'coach-leave', title: 'Coach leave request', summary: 'Nithin has requested leave from 18 to 26 July; goalkeeping cover is required for U13 and U15.', requestedBy: 'Coach Nithin', requestedOn: '7 July 2026' },
];

const seedActivity: readonly AdminActivityEntry[] = [
  { id: 'activity-payment-farhan', kind: 'payment', title: 'Fee payment recorded', summary: 'Farhan Ali · July 2026 · ₹1,200 by bank transfer.', at: 'Today, 9:40 AM' },
  { id: 'activity-announcement-holiday', kind: 'announcement', title: 'Academy announcement published', summary: 'Ground maintenance notice sent to all squads.', at: 'Yesterday, 6:15 PM' },
  { id: 'activity-enrolment-aarav', kind: 'enrolment', title: 'New member enrolled', summary: 'Aarav B. joined the U10 Foundation Squad.', at: 'Yesterday, 11:02 AM' },
  { id: 'activity-coach-ashil', kind: 'coach', title: 'Coach assignment updated', summary: 'Ashil added as assistant coach for the U13 squad.', at: '9 July 2026' },
  { id: 'activity-squad-u15', kind: 'squad', title: 'Squad schedule changed', summary: 'U15 Performance Squad moved to the evening batch.', at: '8 July 2026' },
];

export const adminAcademyProfile: AdminAcademyProfile = {
  id: sharedAcademyData.academy.id,
  name: sharedAcademyData.academy.name,
  shortName: sharedAcademyData.academy.shortName,
  registrationId: 'GCC/KL/2021/0184',
  establishedYear: 2021,
  address: 'Chalissery, Palakkad, Kerala 679536',
  phone: '+91 95392 67730',
  email: 'info@gccacademy.in',
  grounds: [demoConfig.academy.primaryTrainingGround, 'Chalissery Turf Arena'],
};

export const seedAdminDirectory: AdminDirectory = {
  profile: adminAcademyProfile,
  members: seedMembers,
  coaches: seedCoaches,
  squads: seedSquads,
  feeRecords: buildFeeRecords(seedMembers),
  approvals: seedApprovals,
  activity: seedActivity,
};

export function searchAdminMembers(members: readonly AdminMember[], query: string): readonly AdminMember[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return members;
  return members.filter((member) => member.name.toLowerCase().includes(normalized) || member.playerId.toLowerCase().includes(normalized) || member.guardian.name.toLowerCase().includes(normalized) || member.squadName.toLowerCase().includes(normalized) || String(member.jerseyNumber) === normalized);
}

export function searchAdminCoaches(coaches: readonly AdminCoach[], query: string): readonly AdminCoach[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return coaches;
  return coaches.filter((coach) => coach.name.toLowerCase().includes(normalized) || coach.roleTitle.toLowerCase().includes(normalized) || coach.certification.toLowerCase().includes(normalized));
}

export function buildAdminOverview(members: readonly AdminMember[], coaches: readonly AdminCoach[], squads: readonly AdminSquad[], pendingApprovals: number): AdminOverview {
  const enrolled = members.filter((member) => member.enrolment !== 'left');
  const capacity = squads.reduce((total, squad) => total + squad.capacity, 0);
  const attendanceTotal = enrolled.reduce((total, member) => total + member.attendancePercent, 0);
  return {
    totalMembers: enrolled.length,
    activeMembers: members.filter((member) => member.enrolment === 'active').length,
    trialMembers: members.filter((member) => member.enrolment === 'trial').length,
    pausedMembers: members.filter((member) => member.enrolment === 'paused').length,
    totalCoaches: coaches.length,
    availableCoaches: coaches.filter((coach) => coach.availability === 'available').length,
    totalSquads: squads.length,
    capacityUsedPercent: capacity ? Math.round((enrolled.length / capacity) * 100) : 0,
    averageAttendance: enrolled.length ? Math.round(attendanceTotal / enrolled.length) : 0,
    pendingApprovals,
  };
}

export function buildCollectionSummary(feeRecords: readonly AdminFeeRecord[], period: string): AdminCollectionSummary {
  const scoped = feeRecords.filter((record) => record.period === period);
  const sum = (status: AdminFeeStatus) => scoped.filter((record) => record.status === status).reduce((total, record) => total + record.amount, 0);
  const collected = sum('paid');
  const pending = sum('pending');
  const overdue = sum('overdue');
  const billed = collected + pending + overdue;
  return {
    period,
    billed,
    collected,
    pending,
    overdue,
    collectionRate: billed ? Math.round((collected / billed) * 100) : 0,
    paidCount: scoped.filter((record) => record.status === 'paid').length,
    pendingCount: scoped.filter((record) => record.status === 'pending').length,
    overdueCount: scoped.filter((record) => record.status === 'overdue').length,
  };
}

export function buildSquadReports(members: readonly AdminMember[], squads: readonly AdminSquad[], feeRecords: readonly AdminFeeRecord[], period: string): readonly AdminSquadReport[] {
  return squads.map((squad) => {
    const squadMembers = members.filter((member) => member.squadId === squad.id && member.enrolment !== 'left');
    const squadFees = feeRecords.filter((record) => record.squadId === squad.id && record.period === period);
    const billed = squadFees.reduce((total, record) => total + record.amount, 0);
    const collected = squadFees.filter((record) => record.status === 'paid').reduce((total, record) => total + record.amount, 0);
    const attendanceTotal = squadMembers.reduce((total, member) => total + member.attendancePercent, 0);
    return {
      squadId: squad.id,
      squadName: squad.name,
      memberCount: squadMembers.length,
      capacity: squad.capacity,
      averageAttendance: squadMembers.length ? Math.round(attendanceTotal / squadMembers.length) : 0,
      collectionRate: billed ? Math.round((collected / billed) * 100) : 0,
      outstandingAmount: billed - collected,
    };
  });
}
