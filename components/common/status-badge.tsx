import { StyleSheet, View } from 'react-native';
import { AppText } from './app-text';
import { colors, radius, spacing } from '@/design/tokens';

type StatusTone = 'info' | 'success' | 'warning' | 'error' | 'neutral';
const tones = {
  info: { background: colors.status.infoSoft, foreground: colors.status.info },
  success: { background: colors.status.successSoft, foreground: colors.status.success },
  warning: { background: colors.status.warningSoft, foreground: colors.status.warning },
  error: { background: colors.status.errorSoft, foreground: colors.status.error },
  neutral: { background: colors.neutral.background, foreground: colors.neutral.textSecondary },
};
export function StatusBadge({ label, tone = 'info' }: { label: string; tone?: StatusTone }) {
  const selected = tones[tone];
  return <View style={[styles.badge, { backgroundColor: selected.background }]}><AppText variant="caption" weight="bold" color={selected.foreground}>{label.toUpperCase()}</AppText></View>;
}
const styles = StyleSheet.create({ badge: { alignSelf: 'flex-start', minHeight: spacing.lg, paddingHorizontal: spacing.sm, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' } });
