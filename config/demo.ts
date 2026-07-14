export const demoConfig = {
  storageVersion: 1,
  resetEnabled: __DEV__,
  credentials: {
    playerId: 'GCC-U13-024',
    password: 'demo123',
  },
  player: {
    name: 'Ayaan Mohammed',
    playerId: 'GCC-U13-024',
    category: 'U13 Development Squad',
    jerseyNumber: 10,
    headCoach: 'Sandeep',
    attendancePercent: 94,
    coachRating: 4.3,
    currentGoal: 'Weak-foot Passing',
    feeAmount: 1200,
    feeAmountDisplay: '₹1,200',
    feeDueDate: '15 July 2026',
    feeDueDateShort: '15 July',
  },
} as const;
