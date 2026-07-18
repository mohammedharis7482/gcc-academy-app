import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { learningFallbackImage, learningImages } from '@/data/learning-assets';
import { colors, radius, spacing } from '@/design/tokens';
import { LessonThumbnail as ThumbnailKey } from '@/types/learning';

export function LessonThumbnail({ thumbnail, style, showPlay = false }: { thumbnail: ThumbnailKey; style?: ViewStyle; showPlay?: boolean }) {
  const [sourceState, setSourceState] = useState<'primary' | 'fallback' | 'unavailable'>('primary');
  const [loading, setLoading] = useState(true);
  const retry = () => { setSourceState('primary'); setLoading(true); };
  return <View style={[styles.frame, style]}>{sourceState !== 'unavailable' ? <Image source={sourceState === 'fallback' ? learningFallbackImage : learningImages[thumbnail]} contentFit="cover" transition={180} style={StyleSheet.absoluteFill} onLoadStart={() => setLoading(true)} onLoad={() => setLoading(false)} onError={() => { setLoading(false); setSourceState((current) => current === 'primary' ? 'fallback' : 'unavailable'); }} accessibilityIgnoresInvertColors /> : <Pressable accessibilityRole="button" accessibilityLabel="Session image unavailable. Retry." onPress={retry} style={styles.unavailable}><MaterialCommunityIcons name="image-off-outline" size={24} color={colors.neutral.textSecondary} /><MaterialCommunityIcons name="refresh" size={18} color={colors.brand.blue} /></Pressable>}{loading && sourceState !== 'unavailable' ? <ActivityIndicator accessibilityLabel="Loading Session image" color={colors.brand.blue} style={styles.loader} /> : null}{showPlay && sourceState !== 'unavailable' ? <View style={styles.play}><MaterialCommunityIcons name="play" size={23} color={colors.neutral.white} /></View> : null}</View>;
}
const styles = StyleSheet.create({ frame: { overflow: 'hidden', borderRadius: radius.medium, backgroundColor: colors.neutral.border }, loader: { ...StyleSheet.absoluteFillObject }, unavailable: { ...StyleSheet.absoluteFillObject, minHeight: 48, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.xs, backgroundColor: colors.neutral.backgroundRaised }, play: { position: 'absolute', alignSelf: 'center', top: '50%', marginTop: -22, width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mediaControl } });
