import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { PressableProps, StyleSheet, ViewStyle } from 'react-native';

import { colors, layout, radius } from '@/design/tokens';
import { AnimatedPressable } from './animated-pressable';

interface IconButtonProps extends Omit<PressableProps, 'style'> { icon: keyof typeof MaterialCommunityIcons.glyphMap; size?: number; color?: string; style?: ViewStyle; }

export function IconButton({ icon, size = 22, color = colors.brand.navy, style, ...props }: IconButtonProps) {
  return <AnimatedPressable {...props} accessibilityRole="button" hitSlop={4} pressedScale={0.97} style={[styles.button, style]}><MaterialCommunityIcons name={icon} size={size} color={color} /></AnimatedPressable>;
}

const styles = StyleSheet.create({
  button: { width: layout.headerActionSize, height: layout.headerActionSize, borderRadius: radius.pill, backgroundColor: colors.neutral.white, borderWidth: 1, borderColor: colors.neutral.border, alignItems: 'center', justifyContent: 'center' },
});
