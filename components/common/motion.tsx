import { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

import { motion } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface FadeInViewProps extends PropsWithChildren {
  readonly delay?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly translate?: boolean;
}

export function FadeInView({ children, delay = 0, style, translate = true }: FadeInViewProps) {
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(motion.opacity.enterFrom)).current;
  const translateY = useRef(new Animated.Value(translate ? motion.translation.sectionEnterY : 0)).current;

  useEffect(() => {
    opacity.stopAnimation();
    translateY.stopAnimation();
    if (reducedMotion) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: motion.duration.standard, delay, easing: motion.easing.out, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: motion.duration.standard, delay, easing: motion.easing.out, useNativeDriver: true }),
    ]).start();
  }, [delay, opacity, reducedMotion, translateY]);

  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}
