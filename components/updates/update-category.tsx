import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ViewStyle } from 'react-native';

import { colors } from '@/design/tokens';
import { AcademyUpdateCategory, UpdatePriority } from '@/types/updates';

export type UpdateIconName = keyof typeof MaterialCommunityIcons.glyphMap;
export const updateCategoryUI: Readonly<Record<AcademyUpdateCategory, { icon: UpdateIconName; color: string; surface: string }>> = {
  Training: { icon: 'calendar-clock-outline', color: colors.brand.blue, surface: colors.brand.blueSoft },
  Progress: { icon: 'chart-line', color: colors.status.info, surface: colors.status.infoSoft },
  Fees: { icon: 'wallet-outline', color: colors.status.warning, surface: colors.status.warningSoft },
  Learning: { icon: 'school-outline', color: colors.brand.navy, surface: colors.brand.blueSoft },
  Academy: { icon: 'bullhorn-outline', color: colors.brand.navySoft, surface: colors.neutral.backgroundRaised },
};

export const priorityUI: Readonly<Record<Exclude<UpdatePriority, 'normal'>, { label: string; color: string; surface: string; border: string }>> = {
  important: { label: 'IMPORTANT', color: colors.status.warning, surface: colors.status.warningSoft, border: colors.amberBorder },
  urgent: { label: 'URGENT', color: colors.status.error, surface: colors.status.errorSoft, border: colors.errorBorder },
};

export function categorySurface(category: AcademyUpdateCategory): ViewStyle { return { backgroundColor: updateCategoryUI[category].surface }; }
