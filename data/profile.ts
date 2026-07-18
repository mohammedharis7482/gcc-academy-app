import { NotificationPreferences, PlayerProfile } from '@/types/profile';
import { demoConfig } from '@/config/demo';

export const playerProfileMock: PlayerProfile = {
  identity: {
    name: demoConfig.player.name,
    category: demoConfig.player.category,
    jerseyNumber: demoConfig.player.jerseyNumber,
    playerId: demoConfig.player.playerId,
    joinedYear: 2024,
    photo: require('@/assets/images/home/training-hero.png'),
  },
  academy: {
    category: demoConfig.player.category,
    batch: 'Evening Batch',
    headCoach: demoConfig.player.headCoach,
    assistantCoaches: ['Junaid', 'Ashil'],
    trainingGround: demoConfig.academy.primaryTrainingGround,
    trainingDays: ['Tuesday', 'Thursday', 'Saturday'],
    joiningDate: '10 June 2024',
  },
  membership: {
    status: 'active',
    plan: 'Monthly Academy Membership',
    membershipId: demoConfig.player.playerId,
    currentPeriod: 'July 2026',
    renewalDate: '1 August 2026',
  },
  guardian: {
    name: 'Mohammed Shafi',
    relationship: 'Father',
    primaryPhone: '+91 98XXXXXX12',
    emergencyPhone: '+91 97XXXXXX45',
  },
  currentFee: {
    id: 'fee-july-2026',
    period: 'July 2026',
    amount: demoConfig.player.feeAmount,
    status: 'pending',
    dueDate: demoConfig.player.feeDueDate,
  },
  feeHistory: [
    { id: 'fee-june-2026', period: 'June 2026', amount: demoConfig.player.feeAmount, status: 'paid', paidDate: '8 June 2026', receiptNumber: 'GCC-R-260608' },
    { id: 'fee-may-2026', period: 'May 2026', amount: demoConfig.player.feeAmount, status: 'paid', paidDate: '6 May 2026', receiptNumber: 'GCC-R-260506' },
    { id: 'fee-april-2026', period: 'April 2026', amount: demoConfig.player.feeAmount, status: 'paid', paidDate: '9 April 2026', receiptNumber: 'GCC-R-260409' },
    { id: 'fee-march-2026', period: 'March 2026', amount: demoConfig.player.feeAmount, status: 'paid', paidDate: '7 March 2026', receiptNumber: 'GCC-R-260307' },
  ],
};

export const defaultNotificationPreferences: NotificationPreferences = {
  trainingUpdates: true,
  progressFeedback: true,
  feeReminders: true,
  learningRecommendations: true,
  academyAnnouncements: true,
};
