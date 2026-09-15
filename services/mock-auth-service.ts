import { adminDemoConfig } from '@/config/admin';
import { demoConfig } from '@/config/demo';
import { MockSession, SignInCredentials } from '@/types/profile';

interface DemoAccount {
  readonly id: string;
  readonly password: string;
  readonly session: Omit<MockSession, 'signedInAt'>;
}

const demoAccounts: readonly DemoAccount[] = [
  {
    id: demoConfig.credentials.player.id,
    password: demoConfig.credentials.player.password,
    session: { schemaVersion: 2, userId: demoConfig.player.playerId, role: 'player', displayName: demoConfig.player.name, academyId: 'gcc-chalissery', categoryIds: ['u13'] },
  },
  {
    id: demoConfig.credentials.coach.id,
    password: demoConfig.credentials.coach.password,
    session: { schemaVersion: 2, userId: demoConfig.credentials.coach.id, role: 'coach', displayName: 'Coach Sandeep', academyId: 'gcc-chalissery', assignedSquadIds: ['u13'] },
  },
  {
    id: adminDemoConfig.credentials.admin.id,
    password: adminDemoConfig.credentials.admin.password,
    session: { schemaVersion: 2, userId: adminDemoConfig.admin.adminId, role: 'admin', displayName: adminDemoConfig.admin.name, academyId: adminDemoConfig.admin.academyId },
  },
] as const;

export const mockAuthService = {
  async signIn(credentials: SignInCredentials): Promise<MockSession | null> {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const identifier = credentials.identifier.trim().toUpperCase();
    const account = demoAccounts.find((item) => item.id === identifier && item.password === credentials.password);
    return account ? { ...account.session, signedInAt: new Date().toISOString() } : null;
  },
};
