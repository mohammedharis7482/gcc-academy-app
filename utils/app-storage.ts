import AsyncStorage from '@react-native-async-storage/async-storage';

import { demoConfig } from '@/config/demo';
import { clearAdminStorage } from '@/utils/admin-storage';

export const storageKeys = {
  authSession: 'samp.auth.session',
  learnProgress: 'samp.learn.progress',
  updatesReadState: 'samp.updates.readState',
  notificationSettings: 'samp.settings.notifications',
  language: 'samp.settings.language',
  attendanceRecords: 'samp.attendance.records',
  assessmentRecords: 'samp.assessments.records',
  trainingPlans: 'samp.training.plans',
  academyOperations: 'samp.academy.operations',
  demoVersion: 'samp.demo.version',
} as const;

type StorageKey = typeof storageKeys[keyof typeof storageKeys];

interface StoredEnvelope {
  readonly version: number;
  readonly value: unknown;
}

function isEnvelope(value: unknown): value is StoredEnvelope {
  return typeof value === 'object' && value !== null && 'version' in value && 'value' in value && typeof value.version === 'number';
}

export interface StorageReadResult<T> { readonly value: T | null; readonly failed: boolean }

export async function readStoredValueResult<T>(key: StorageKey, validate: (value: unknown) => value is T): Promise<StorageReadResult<T>> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return { value: null, failed: false };
    const parsed: unknown = JSON.parse(raw);
    if (!isEnvelope(parsed) || parsed.version !== demoConfig.storageVersion || !validate(parsed.value)) {
      await AsyncStorage.removeItem(key);
      return { value: null, failed: false };
    }
    return { value: parsed.value, failed: false };
  } catch {
    await AsyncStorage.removeItem(key).catch(() => undefined);
    return { value: null, failed: true };
  }
}

export async function readStoredValue<T>(key: StorageKey, validate: (value: unknown) => value is T): Promise<T | null> {
  return (await readStoredValueResult(key, validate)).value;
}

export async function writeStoredValue<T>(key: StorageKey, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ version: demoConfig.storageVersion, value }));
    await AsyncStorage.setItem(storageKeys.demoVersion, String(demoConfig.storageVersion));
    return true;
  } catch {
    // The in-memory experience remains usable if device storage is unavailable.
    return false;
  }
}

export async function removeStoredValue(key: StorageKey): Promise<void> {
  await AsyncStorage.removeItem(key).catch(() => undefined);
}

export async function clearDemoStorage(preserveAuth = true): Promise<void> {
  const keys: StorageKey[] = [storageKeys.learnProgress, storageKeys.updatesReadState, storageKeys.notificationSettings, storageKeys.language, storageKeys.attendanceRecords, storageKeys.assessmentRecords, storageKeys.trainingPlans, storageKeys.academyOperations, storageKeys.demoVersion];
  if (!preserveAuth) keys.push(storageKeys.authSession);
  // Admin operations live under their own key, so reset them through the Admin helper
  // rather than repeating the key here.
  await Promise.all([AsyncStorage.multiRemove(keys).catch(() => undefined), clearAdminStorage()]);
}
