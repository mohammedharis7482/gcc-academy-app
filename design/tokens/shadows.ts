import { Platform } from 'react-native';
import { colors } from './colors';

export const shadows = {
  card: Platform.select({
    android: { elevation: 1 },
    web: { boxShadow: '0 5px 14px rgba(8, 29, 77, 0.055)' },
    default: { shadowColor: colors.brand.navy, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.055, shadowRadius: 14 },
  }),
  floating: Platform.select({
    android: { elevation: 2 },
    web: { boxShadow: '0 4px 12px rgba(8, 29, 77, 0.065)' },
    default: { shadowColor: colors.brand.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.065, shadowRadius: 12 },
  }),
  hero: Platform.select({
    android: { elevation: 3 },
    web: { boxShadow: '0 7px 18px rgba(8, 29, 77, 0.1)' },
    default: { shadowColor: colors.brand.navy, shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.1, shadowRadius: 18 },
  }),
  tabBar: Platform.select({
    android: { elevation: 6 },
    web: { boxShadow: '0 -3px 10px rgba(8, 29, 77, 0.045)' },
    default: { shadowColor: colors.brand.navy, shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.045, shadowRadius: 10 },
  }),
} as const;
