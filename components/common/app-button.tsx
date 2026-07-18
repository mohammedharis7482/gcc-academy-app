import { ActivityIndicator, PressableProps, StyleSheet, ViewStyle } from 'react-native';

import { colors, layout, motion, radius, spacing } from '@/design/tokens';
import { AnimatedPressable } from './animated-pressable';
import { AppText } from './app-text';

type AppButtonVariant = 'primary' | 'secondary' | 'white' | 'ghost' | 'danger';
interface AppButtonProps extends Omit<PressableProps, 'style'> { label: string; variant?: AppButtonVariant; loading?: boolean; style?: ViewStyle; }

const foregrounds: Readonly<Record<AppButtonVariant, string>> = { primary: colors.neutral.white, secondary: colors.brand.navy, white: colors.brand.navy, ghost: colors.brand.blue, danger: colors.neutral.white };

export function AppButton({ label, variant = 'primary', loading = false, style, disabled, accessibilityState, ...props }: AppButtonProps) {
  const isDisabled = Boolean(disabled || loading);
  const foreground = foregrounds[variant];
  return (
    <AnimatedPressable {...props} disabled={isDisabled} accessibilityRole="button" accessibilityState={{ ...accessibilityState, disabled: isDisabled, busy: loading }} pressedScale={motion.scale.pressStrong} style={[styles.base, styles[variant], disabled && styles.disabled, style]}>
      {loading ? <ActivityIndicator size="small" color={foreground} accessibilityElementsHidden /> : null}
      <AppText weight="bold" variant="button" color={foreground} numberOfLines={1}>{label}</AppText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: layout.buttonHeight, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, borderRadius: radius.medium },
  primary: { backgroundColor: colors.brand.navy },
  secondary: { backgroundColor: colors.brand.blueSoft },
  white: { backgroundColor: colors.neutral.white },
  ghost: { backgroundColor: colors.transparent, borderWidth: 1, borderColor: colors.neutral.border },
  danger: { backgroundColor: colors.status.error },
  disabled: { opacity: 0.45 },
});
