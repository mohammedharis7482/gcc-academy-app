import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

import { demoConfig } from '@/config/demo';
import { defaultNotificationPreferences } from '@/data/profile';
import { profileService } from '@/services/profile-service';
import { AppLanguage, MockSession, NotificationPreferenceKey, NotificationPreferences, PlayerProfile, SignInCredentials } from '@/types/profile';
import { readStoredValue, removeStoredValue, storageKeys, writeStoredValue } from '@/utils/app-storage';

type ProfileLoadStatus = 'loading' | 'ready' | 'error';

interface ProfileState {
  readonly profile: PlayerProfile | null;
  readonly status: ProfileLoadStatus;
  readonly preferences: NotificationPreferences;
  readonly session: MockSession | null;
  readonly isAuthLoading: boolean;
  readonly selectedLanguage: AppLanguage;
}

type ProfileAction =
  | { readonly type: 'loading' }
  | { readonly type: 'load-success'; readonly profile: PlayerProfile | null }
  | { readonly type: 'load-error' }
  | { readonly type: 'toggle-preference'; readonly key: NotificationPreferenceKey }
  | { readonly type: 'restore-settings'; readonly preferences: NotificationPreferences; readonly language: AppLanguage }
  | { readonly type: 'set-language'; readonly language: AppLanguage }
  | { readonly type: 'restore-session'; readonly session: MockSession | null }
  | { readonly type: 'sign-in'; readonly session: MockSession }
  | { readonly type: 'logout' }
  | { readonly type: 'reset-settings' };

interface ProfileContextValue extends ProfileState {
  togglePreference: (key: NotificationPreferenceKey) => void;
  setLanguage: (language: AppLanguage) => void;
  resetSettings: () => void;
  retry: () => void;
  signIn: (credentials: SignInCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  readonly isAuthenticated: boolean;
}

const initialState: ProfileState = {
  profile: null,
  status: 'loading',
  preferences: defaultNotificationPreferences,
  session: null,
  isAuthLoading: true,
  selectedLanguage: 'en',
};

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'loading': return { ...state, status: 'loading' };
    case 'load-success': return { ...state, profile: action.profile, status: 'ready' };
    case 'load-error': return { ...state, status: 'error' };
    case 'toggle-preference': return { ...state, preferences: { ...state.preferences, [action.key]: !state.preferences[action.key] } };
    case 'restore-settings': return { ...state, preferences: action.preferences, selectedLanguage: action.language };
    case 'set-language': return { ...state, selectedLanguage: action.language };
    case 'restore-session': return { ...state, session: action.session, isAuthLoading: false };
    case 'sign-in': return { ...state, session: action.session };
    case 'logout': return { ...state, session: null };
    case 'reset-settings': return { ...state, preferences: defaultNotificationPreferences, selectedLanguage: 'en' };
  }
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

function isSession(value: unknown): value is MockSession { return typeof value === 'object' && value !== null && 'playerId' in value && 'signedInAt' in value && typeof value.playerId === 'string' && typeof value.signedInAt === 'string'; }
function isPreferences(value: unknown): value is NotificationPreferences { return typeof value === 'object' && value !== null && ['trainingUpdates', 'progressFeedback', 'feeReminders', 'learningRecommendations', 'academyAnnouncements'].every((key) => key in value && typeof value[key as keyof typeof value] === 'boolean'); }
function isLanguage(value: unknown): value is AppLanguage { return value === 'en'; }

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const loadProfile = useCallback(async () => {
    dispatch({ type: 'loading' });
    try { dispatch({ type: 'load-success', profile: await profileService.getProfile() }); }
    catch { dispatch({ type: 'load-error' }); }
  }, []);
  useEffect(() => { void loadProfile(); }, [loadProfile]);
  useEffect(() => {
    void Promise.all([
      readStoredValue(storageKeys.authSession, isSession),
      readStoredValue(storageKeys.notificationSettings, isPreferences),
      readStoredValue(storageKeys.language, isLanguage),
    ]).then(([session, preferences, language]) => {
      dispatch({ type: 'restore-settings', preferences: preferences ?? defaultNotificationPreferences, language: language ?? 'en' });
      dispatch({ type: 'restore-session', session });
    });
  }, []);
  const togglePreference = useCallback((key: NotificationPreferenceKey) => {
    const next = { ...state.preferences, [key]: !state.preferences[key] };
    dispatch({ type: 'toggle-preference', key });
    void writeStoredValue(storageKeys.notificationSettings, next);
  }, [state.preferences]);
  const setLanguage = useCallback((language: AppLanguage) => { dispatch({ type: 'set-language', language }); void writeStoredValue(storageKeys.language, language); }, []);
  const resetSettings = useCallback(() => {
    dispatch({ type: 'reset-settings' });
    void writeStoredValue(storageKeys.notificationSettings, defaultNotificationPreferences);
    void writeStoredValue(storageKeys.language, 'en');
  }, []);
  const signIn = useCallback(async (credentials: SignInCredentials) => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    if (credentials.identifier.trim().toUpperCase() !== demoConfig.credentials.playerId || credentials.password !== demoConfig.credentials.password) return false;
    const session: MockSession = { playerId: demoConfig.player.playerId, signedInAt: new Date().toISOString() };
    await writeStoredValue(storageKeys.authSession, session);
    dispatch({ type: 'sign-in', session });
    return true;
  }, []);
  const logout = useCallback(async () => { await removeStoredValue(storageKeys.authSession); dispatch({ type: 'logout' }); }, []);
  const isAuthenticated = state.session !== null;
  const value = useMemo(() => ({ ...state, isAuthenticated, togglePreference, setLanguage, resetSettings, retry: loadProfile, signIn, logout }), [isAuthenticated, loadProfile, logout, resetSettings, setLanguage, signIn, state, togglePreference]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used inside ProfileProvider');
  return context;
}
