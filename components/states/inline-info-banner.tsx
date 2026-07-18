import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, spacing } from '@/design/tokens';

type BannerTone = 'info' | 'success' | 'warning' | 'error';

const appearance: Readonly<Record<BannerTone, { readonly icon: keyof typeof MaterialCommunityIcons.glyphMap; readonly color: string; readonly surface: string; readonly border: string }>> = {
  info: { icon: 'information-outline', color: colors.status.info, surface: colors.status.infoSoft, border: colors.avatarBorder },
  success: { icon: 'check-circle-outline', color: colors.status.success, surface: colors.status.successSoft, border: colors.status.successSoft },
  warning: { icon: 'alert-outline', color: colors.status.warning, surface: colors.status.warningSoft, border: colors.amberBorder },
  error: { icon: 'alert-circle-outline', color: colors.status.error, surface: colors.status.errorSoft, border: colors.errorBorder },
};

export function InlineInfoBanner({ title, message, tone = 'info', actionLabel, onAction }: { readonly title: string; readonly message?: string; readonly tone?: BannerTone; readonly actionLabel?: string; readonly onAction?: () => void }) {
  const theme = appearance[tone];
  return (
    <View accessibilityRole={tone === 'error' ? 'alert' : 'summary'} accessibilityLabel={`${title}${message ? `. ${message}` : ''}`} style={[styles.banner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.icon, { backgroundColor: colors.neutral.surface }]}><MaterialCommunityIcons name={theme.icon} size={20} color={theme.color} /></View>
      <View style={styles.copy}><AppText variant="bodySmall" weight="bold" color={colors.neutral.text}>{title}</AppText>{message ? <AppText variant="caption" color={colors.neutral.textSecondary}>{message}</AppText> : null}</View>
      {actionLabel && onAction ? <AppButton label={actionLabel} variant="white" onPress={onAction} accessibilityLabel={`${actionLabel}: ${title}`} style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { minHeight: 64, padding: spacing.sm, borderWidth: 1, borderRadius: radius.medium, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { width: layout.compactIconSize, height: layout.compactIconSize, flexShrink: 0, borderRadius: radius.small, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: 2 },
  action: { minHeight: layout.minTouchTarget, minWidth: 88, paddingHorizontal: spacing.sm },
});
