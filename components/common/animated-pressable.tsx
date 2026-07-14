import { ReactNode, useRef } from 'react';
import { Animated, GestureResponderEvent, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

import { motion } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const NativeAnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends Omit<PressableProps, 'children' | 'style'> {
  readonly children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly pressedScale?: number;
}

export function AnimatedPressable({ children, style, pressedScale = motion.scale.pressSmall, onPressIn, onPressOut, disabled, ...props }: AnimatedPressableProps) {
  const reducedMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const animate = (pressed: boolean) => {
    const scaleTarget = pressed ? (reducedMotion ? 0.995 : pressedScale) : 1;
    Animated.parallel([
      Animated.timing(scale, { toValue: scaleTarget, duration: motion.duration.press, easing: motion.easing.out, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: pressed ? motion.opacity.pressed : 1, duration: motion.duration.press, easing: motion.easing.out, useNativeDriver: true }),
    ]).start();
  };

  const handlePressIn = (event: GestureResponderEvent) => {
    if (!disabled) animate(true);
    onPressIn?.(event);
  };
  const handlePressOut = (event: GestureResponderEvent) => {
    if (!disabled) animate(false);
    onPressOut?.(event);
  };

  return (
    <NativeAnimatedPressable
      {...props}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, { opacity, transform: [{ scale }] }]}>
      {children}
    </NativeAnimatedPressable>
  );
}
