import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, spacing } from '@/design/tokens';

type StateIcon = keyof typeof MaterialCommunityIcons.glyphMap;

interface StateActionProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly accessibilityLabel?: string;
}

interface BaseStateProps {
  readonly title: string;
  readonly message: string;
  readonly icon?: StateIcon;
  readonly compact?: boolean;
  readonly action?: StateActionProps;
}

export function RetryButton({ label = 'Try again', onPress, accessibilityLabel }: { readonly label?: string; readonly onPress: () => void; readonly accessibilityLabel?: string }) {
  return <AppButton label={label} onPress={onPress} accessibilityLabel={accessibilityLabel ?? label} style={styles.button} />;
}

function StateLayout({ title, message, icon, compact = false, action, tone }: BaseStateProps & { readonly tone: 'empty' | 'error' | 'loading' }) {
  const iconName = icon ?? (tone === 'error' ? 'alert-circle-outline' : tone === 'empty' ? 'inbox-outline' : 'progress-clock');
  const iconColor = tone === 'error' ? colors.status.error : colors.brand.blue;
  const iconSurface = tone === 'error' ? colors.status.errorSoft : colors.brand.blueSoft;
  return (
    <View
      accessibilityRole={tone === 'error' ? 'alert' : 'summary'}
      accessibilityLabel={`${title}. ${message}`}
      style={[styles.container, compact && styles.compact]}
    >
      <View style={[styles.icon, compact && styles.compactIcon, { backgroundColor: iconSurface }]}>
        {tone === 'loading' ? <ActivityIndicator color={iconColor} accessibilityLabel={title} /> : <MaterialCommunityIcons name={iconName} size={compact ? 22 : 26} color={iconColor} />}
      </View>
      <View style={styles.copy}>
        <AppText variant={compact ? 'bodySmall' : 'heading'} weight="bold" style={[styles.center, compact && styles.compactText]}>{title}</AppText>
        <AppText variant={compact ? 'caption' : 'body'} color={colors.neutral.textSecondary} style={[styles.center, compact && styles.compactText]}>{message}</AppText>
      </View>
      {action ? <RetryButton label={action.label} onPress={action.onPress} accessibilityLabel={action.accessibilityLabel} /> : null}
    </View>
  );
}

export function LoadingState({ title = 'Loading academy information', message = 'Your latest information will appear shortly.', compact = false }: Partial<Pick<BaseStateProps, 'title' | 'message' | 'compact'>>) {
  return <StateLayout tone="loading" title={title} message={message} compact={compact} />;
}

export function EmptyState({ title = 'Nothing to show yet', message = 'New academy activity will appear here.', icon, compact = false, action }: Partial<BaseStateProps>) {
  return <StateLayout tone="empty" title={title} message={message} icon={icon} compact={compact} action={action} />;
}

export function ErrorState({ title = 'Unable to load this section', message = 'Please try again.', icon, compact = false, onRetry, retryLabel = 'Try again' }: Partial<Omit<BaseStateProps, 'action'>> & { readonly onRetry?: () => void; readonly retryLabel?: string }) {
  const action = onRetry ? { label: retryLabel, onPress: onRetry, accessibilityLabel: `${retryLabel}: ${title}` } : undefined;
  return <StateLayout tone="error" title={title} message={message} icon={icon} compact={compact} action={action} />;
}

interface ContentStateProps {
  readonly type: 'loading' | 'empty' | 'error';
  readonly title?: string;
  readonly message?: string;
  readonly onRetry?: () => void;
  readonly actionLabel?: string;
  readonly compact?: boolean;
  readonly icon?: StateIcon;
}

/** Backwards-compatible state entry point used by existing screens. */
export function ContentState({ type, title, message, onRetry, actionLabel = 'Try again', compact = false, icon }: ContentStateProps) {
  if (type === 'loading') return <LoadingState title={title} message={message} compact={compact} />;
  if (type === 'error') return <ErrorState title={title} message={message} icon={icon} compact={compact} onRetry={onRetry} retryLabel={actionLabel} />;
  const action = onRetry ? { label: actionLabel, onPress: onRetry } : undefined;
  return <EmptyState title={title} message={message} icon={icon} compact={compact} action={action} />;
}

const styles = StyleSheet.create({
  container: {
    minHeight: 190,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: radius.large,
    backgroundColor: colors.neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  compact: { minHeight: 112, padding: layout.cardPadding, flexDirection: 'row', justifyContent: 'flex-start' },
  icon: { width: 48, height: 48, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  compactIcon: { width: layout.compactIconSize, height: layout.compactIconSize, flexShrink: 0 },
  copy: { flexShrink: 1, gap: 2 },
  center: { textAlign: 'center' },
  compactText: { textAlign: 'left' },
  button: { minWidth: 128 },
});
