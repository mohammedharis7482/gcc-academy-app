import { PressableProps, StyleSheet, ViewStyle } from 'react-native';

import { colors, layout, radius, spacing } from '@/design/tokens';
import { AnimatedPressable } from './animated-pressable';
import { AppText } from './app-text';

interface AppButtonProps extends Omit<PressableProps, 'style'> { label: string; variant?: 'primary' | 'secondary' | 'white'; style?: ViewStyle; }

export function AppButton({ label, variant = 'primary', style, disabled, ...props }: AppButtonProps) {
  return (
    <AnimatedPressable {...props} disabled={disabled} accessibilityRole="button" pressedScale={0.97} style={[styles.base, styles[variant], disabled && styles.disabled, style]}>
      <AppText weight="bold" variant="bodySmall" color={variant === 'primary' ? colors.neutral.white : colors.brand.navy} numberOfLines={1}>{label}</AppText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: layout.buttonHeight, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radius.medium },
  primary: { backgroundColor: colors.brand.navy },
  secondary: { backgroundColor: colors.brand.blueSoft },
  white: { backgroundColor: colors.neutral.white },
  disabled: { opacity: 0.45 },
});
