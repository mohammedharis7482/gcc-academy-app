import { adminDemoConfig } from '@/config/admin';
import { AdminSession, AdminSignInCredentials } from '@/types/admin';

/**
 * Mock Admin authentication. There is no backend and no real credential check:
 * the module compares against the local demo account so the Admin experience
 * can be reviewed on a device without a server.
 */
export const adminAuthService = {
  async signIn(credentials: AdminSignInCredentials): Promise<AdminSession | null> {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const identifier = credentials.identifier.trim().toUpperCase();
    const matches = identifier === adminDemoConfig.credentials.admin.id && credentials.password === adminDemoConfig.credentials.admin.password;
    if (!matches) return null;
    return {
      schemaVersion: 1,
      adminId: adminDemoConfig.admin.adminId,
      displayName: adminDemoConfig.admin.name,
      role: adminDemoConfig.admin.role,
      academyId: adminDemoConfig.admin.academyId,
      signedInAt: new Date().toISOString(),
    };
  },
};

export function isAdminSession(value: unknown): value is AdminSession {
  return typeof value === 'object' && value !== null
    && 'schemaVersion' in value && value.schemaVersion === 1
    && 'adminId' in value && typeof value.adminId === 'string'
    && 'displayName' in value && typeof value.displayName === 'string'
    && 'role' in value && (value.role === 'owner' || value.role === 'manager' || value.role === 'front-desk')
    && 'academyId' in value && typeof value.academyId === 'string'
    && 'signedInAt' in value && typeof value.signedInAt === 'string';
}
