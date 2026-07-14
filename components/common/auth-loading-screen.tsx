import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/app-text';
import { BrandLogo } from '@/components/common/brand-logo';
import { colors, spacing } from '@/design/tokens';

export function AuthLoadingScreen() {
  return <SafeAreaView style={styles.safe}><View style={styles.content}><BrandLogo containerSize={84} /><AppText variant="title" weight="extraBold">GCC Football Academy</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Restoring the player account…</AppText><ActivityIndicator color={colors.brand.blue} accessibilityLabel="Loading player account" /></View></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.neutral.background }, content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm } });

