import AsyncStorage from '@react-native-async-storage/async-storage';

import { demoConfig } from '@/config/demo';

export const storageKeys = {
  authSession: 'samp.auth.session',
  learnProgress: 'samp.learn.progress',
  updatesReadState: 'samp.updates.readState',
  notificationSettings: 'samp.settings.notifications',
  language: 'samp.settings.language',
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

export async function readStoredValue<T>(key: StorageKey, validate: (value: unknown) => value is T): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isEnvelope(parsed) || parsed.version !== demoConfig.storageVersion || !validate(parsed.value)) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    await AsyncStorage.removeItem(key).catch(() => undefined);
    return null;
  }
}

export async function writeStoredValue<T>(key: StorageKey, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ version: demoConfig.storageVersion, value }));
    await AsyncStorage.setItem(storageKeys.demoVersion, String(demoConfig.storageVersion));
  } catch {
    // The in-memory experience remains usable if device storage is unavailable.
  }
}

export async function removeStoredValue(key: StorageKey): Promise<void> {
  await AsyncStorage.removeItem(key).catch(() => undefined);
}

export async function clearDemoStorage(preserveAuth = true): Promise<void> {
  const keys: StorageKey[] = [storageKeys.learnProgress, storageKeys.updatesReadState, storageKeys.notificationSettings, storageKeys.language, storageKeys.demoVersion];
  if (!preserveAuth) keys.push(storageKeys.authSession);
  await AsyncStorage.multiRemove(keys).catch(() => undefined);
}

