import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { adminAuthService, isAdminSession } from '@/services/admin-auth-service';
import { AdminSession, AdminSignInCredentials } from '@/types/admin';
import { adminStorageKeys, readAdminValue, removeAdminValue, writeAdminValue } from '@/utils/admin-storage';

interface AdminSessionContextValue {
  readonly session: AdminSession | null;
  readonly isRestoring: boolean;
  readonly isAuthenticated: boolean;
  signIn: (credentials: AdminSignInCredentials) => Promise<AdminSession | null>;
  logout: () => Promise<void>;
}

const AdminSessionContext = createContext<AdminSessionContextValue | undefined>(undefined);

/**
 * Local Admin session. The Admin module is a frontend-only module: this holds a
 * mock session in memory and on the device, and never contacts a server.
 */
export function AdminSessionProvider({ children }: { readonly children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    void readAdminValue(adminStorageKeys.adminSession, isAdminSession).then((stored) => {
      setSession(stored);
      setIsRestoring(false);
    });
  }, []);

  const signIn = useCallback(async (credentials: AdminSignInCredentials) => {
    const next = await adminAuthService.signIn(credentials);
    if (!next) return null;
    await writeAdminValue(adminStorageKeys.adminSession, next);
    setSession(next);
    return next;
  }, []);

  const logout = useCallback(async () => {
    await removeAdminValue(adminStorageKeys.adminSession);
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, isRestoring, isAuthenticated: session !== null, signIn, logout }), [isRestoring, logout, session, signIn]);
  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
  const value = useContext(AdminSessionContext);
  if (!value) throw new Error('useAdminSession must be used inside AdminSessionProvider');
  return value;
}
