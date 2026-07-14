import { useEffect, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, motion, radius } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface ProgressBarProps {
  readonly progress: number;
  readonly color?: string;
  readonly accessibilityLabel?: string;
  readonly trackStyle?: StyleProp<ViewStyle>;
  readonly fillStyle?: StyleProp<ViewStyle>;
}

export function ProgressBar({ progress, color = colors.brand.blue, accessibilityLabel, trackStyle, fillStyle }: ProgressBarProps) {
  const reducedMotion = useReducedMotion();
  const value = Math.min(1, Math.max(0, progress));
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animated.stopAnimation();
    Animated.timing(animated, {
      toValue: value,
      duration: reducedMotion ? motion.duration.instant : motion.duration.standard,
      easing: motion.easing.out,
      useNativeDriver: false,
    }).start();
  }, [animated, reducedMotion, value]);

  const width = animated.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={[styles.track, trackStyle]}>
      <Animated.View style={[styles.fill, fillStyle, { width, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 7, borderRadius: radius.pill, backgroundColor: colors.neutral.divider, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});
