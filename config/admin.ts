import { demoConfig } from '@/config/demo';

/**
 * Admin-only demo configuration. Kept separate from `config/demo.ts` so the
 * Player and Coach demo contract is untouched while the Admin module still
 * shares the same academy timeline facts.
 */
export const adminDemoConfig = {
  credentials: { admin: { id: 'GCC-ADMIN-001', password: 'admin123' } },
  admin: {
    adminId: 'GCC-ADMIN-001',
    name: 'Sreerag Ambadi',
    roleTitle: 'Academy Owner',
    role: 'owner' as const,
    academyId: 'gcc-chalissery',
    email: 'admin@gccacademy.in',
  },
  /**
   * Admin records are stamped with the scripted demo date rather than the device
   * clock, so a payment recorded during a demo stays inside the July 2026 period.
   */
  recordDateLabel: new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${demoConfig.timeline.currentDateIso}T00:00:00`)),
  billing: {
    currentPeriod: 'July 2026',
    periods: ['July 2026', 'June 2026', 'May 2026'] as const,
    dueDate: demoConfig.player.feeDueDate,
    monthlyFeeByCategory: { U10: 1000, U13: demoConfig.player.feeAmount, U15: 1400 },
  },
  squadCapacity: 24,
  /** Monthly coach salary defaults used when an admin adds a new coach. */
  salaryByEngagement: { 'Full-time': 14000, 'Part-time': 7000, Guest: 4000 },
} as const;

export type AdminBillingPeriod = (typeof adminDemoConfig.billing.periods)[number];
