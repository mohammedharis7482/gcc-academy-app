import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { sharedAcademyData } from '@/data/academy';
import { SharedAcademyData } from '@/types/academy';

type RosterStatus = 'loading' | 'ready' | 'error';
interface AcademyDataContextValue extends SharedAcademyData { readonly rosterStatus: RosterStatus; retryRoster: () => void }
const AcademyDataContext = createContext<AcademyDataContextValue | undefined>(undefined);

export function AcademyDataProvider({ children }: { readonly children: ReactNode }) {
  const [rosterStatus, setRosterStatus] = useState<RosterStatus>('loading');
  const loadRoster = useCallback(() => { setRosterStatus('loading'); void Promise.resolve().then(() => setRosterStatus('ready')).catch(() => setRosterStatus('error')); }, []);
  useEffect(() => { loadRoster(); }, [loadRoster]);
  const value = useMemo(() => ({ ...sharedAcademyData, rosterStatus, retryRoster: loadRoster }), [loadRoster, rosterStatus]);
  return <AcademyDataContext.Provider value={value}>{children}</AcademyDataContext.Provider>;
}

export function useAcademyData() {
  const value = useContext(AcademyDataContext);
  if (!value) throw new Error('useAcademyData must be used inside AcademyDataProvider');
  return value;
}
