import { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

import { motion } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function SkeletonPulse({ children, style }: PropsWithChildren<{ readonly style?: StyleProp<ViewStyle> }>) {
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(0.58)).current;

  useEffect(() => {
    opacity.stopAnimation();
    if (reducedMotion) {
      opacity.setValue(0.68);
      return;
    }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 0.74, duration: motion.duration.slow, easing: motion.easing.out, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.58, duration: motion.duration.slow, easing: motion.easing.out, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [opacity, reducedMotion]);

  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
}
