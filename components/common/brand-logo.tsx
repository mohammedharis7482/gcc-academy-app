import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { layout } from '@/design/tokens';
import { useImageTransition } from '@/hooks/use-image-transition';

export function BrandLogo({ containerSize, feature = false, onError }: { containerSize: number; feature?: boolean; onError?: () => void }) {
  const imageTransition = useImageTransition();
  const size = feature ? containerSize : containerSize * layout.brandLogoScale;
  return <View style={[styles.viewport, { width: containerSize, height: containerSize }]}><Image source={require('@/assets/branding/gcc-logo.png')} style={[styles.logo, { width: size, height: size, transform: [{ scale: layout.brandLogoVisualScale }] }]} contentFit="contain" transition={imageTransition} onError={onError} /></View>;
}

const styles = StyleSheet.create({ viewport: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }, logo: { flexShrink: 0 } });
