import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/app-text';
import { colors, spacing } from '@/design/tokens';

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => NetInfo.addEventListener((state) => setOffline(state.isConnected === false)), []);
  if (!offline) return null;
  return <View accessibilityRole="alert" accessibilityLabel="You are offline. Saved academy data remains available." style={styles.banner}><MaterialCommunityIcons name="cloud-off-outline" size={18} color={colors.neutral.white} /><AppText variant="bodySmall" weight="bold" color={colors.neutral.white}>Offline · showing saved academy data</AppText></View>;
}

const styles = StyleSheet.create({ banner: { minHeight: 36, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: colors.brand.navy } });

