import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { colors, radius, spacing } from '@/design/tokens';

interface ContentStateProps { type: 'loading' | 'empty' | 'error'; title?: string; message?: string; onRetry?: () => void; actionLabel?: string; }
const defaults = { loading: ['Loading your academy dashboard', 'Your latest information will appear shortly.'], empty: ['Nothing to show yet', 'New academy activity will appear here.'], error: ['We could not load this section', 'Check your connection and try again.'] } as const;
export function ContentState({ type, title, message, onRetry, actionLabel = 'Try again' }: ContentStateProps) {
  const icon = type === 'error' ? 'alert-circle-outline' : type === 'empty' ? 'inbox-outline' : 'progress-clock';
  return <View style={styles.container} accessibilityRole="summary"><View style={styles.icon}><MaterialCommunityIcons name={icon} size={26} color={colors.brand.blue} /></View><AppText variant="heading" weight="bold" style={styles.center}>{title ?? defaults[type][0]}</AppText><AppText color={colors.neutral.textSecondary} style={styles.center}>{message ?? defaults[type][1]}</AppText>{type === 'error' && onRetry ? <AppButton label={actionLabel} onPress={onRetry} style={styles.button} /> : null}</View>;
}
const styles = StyleSheet.create({ container: { backgroundColor: colors.neutral.surface, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.large, padding: spacing.lg, alignItems: 'center', gap: spacing.xs }, icon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brand.blueSoft, marginBottom: spacing.xs }, center: { textAlign: 'center' }, button: { marginTop: spacing.sm, minWidth: 128 } });
