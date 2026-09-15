import AsyncStorage from '@react-native-async-storage/async-storage';

import { demoConfig } from '@/config/demo';

/**
 * The Admin module keeps its own operations storage so it can persist academy
 * changes without altering the shared Player/Coach storage contract. The
 * envelope shape and version gate match `utils/app-storage.ts` exactly, so a
 * demo reset of one module behaves the same way as the other.
 *
 * The admin session is not stored here: sign-in is owned by `ProfileProvider`
 * and lives under the shared `samp.auth.session` key alongside Player and Coach.
 */
export const adminStorageKeys = {
  adminOperations: 'samp.admin.operations',
} as const;

type AdminStorageKey = typeof adminStorageKeys[keyof typeof adminStorageKeys];

interface StoredEnvelope {
  readonly version: number;
  readonly value: unknown;
}

function isEnvelope(value: unknown): value is StoredEnvelope {
  return typeof value === 'object' && value !== null && 'version' in value && 'value' in value && typeof value.version === 'number';
}

export interface AdminStorageResult<T> { readonly value: T | null; readonly failed: boolean }

export async function readAdminValueResult<T>(key: AdminStorageKey, validate: (value: unknown) => value is T): Promise<AdminStorageResult<T>> {
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

export async function writeAdminValue<T>(key: AdminStorageKey, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ version: demoConfig.storageVersion, value }));
    return true;
  } catch {
    // The in-memory experience remains usable if device storage is unavailable.
    return false;
  }
}

export async function clearAdminStorage(): Promise<void> {
  await AsyncStorage.multiRemove([adminStorageKeys.adminOperations]).catch(() => undefined);
}
