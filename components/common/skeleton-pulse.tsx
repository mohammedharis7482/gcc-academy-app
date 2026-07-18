import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { motion } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function SkeletonPulse({ children, style }: PropsWithChildren<{ readonly style?: StyleProp<ViewStyle> }>) {
  const reducedMotion = useReducedMotion();
  const shimmer = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    shimmer.stopAnimation();
    if (reducedMotion) {
      shimmer.setValue(0);
      return;
    }
    const animation = Animated.loop(Animated.timing(shimmer, { toValue: 1, duration: motion.duration.skeleton, easing: motion.easing.out, useNativeDriver: true }));
    animation.start();
    return () => animation.stop();
  }, [reducedMotion, shimmer]);

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);
  const translateX = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-Math.max(width, 1), Math.max(width, 1)] });

  return <Animated.View accessible accessibilityLabel="Loading content" onLayout={onLayout} style={[styles.container, style]}>{children}{!reducedMotion && width > 0 ? <Animated.View pointerEvents="none" style={[styles.shimmer, { width: Math.max(72, width * 0.34), transform: [{ translateX }] }]}><LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.46)', 'rgba(255,255,255,0)']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} /></Animated.View> : null}</Animated.View>;
}

const styles = StyleSheet.create({ container: { position: 'relative', overflow: 'hidden' }, shimmer: { position: 'absolute', top: 0, bottom: 0, left: 0 } });
