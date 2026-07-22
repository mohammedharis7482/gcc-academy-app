import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/common/app-screen';
import { AppText } from '@/components/common/app-text';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { useAcademyData } from '@/contexts/academy-data-context';
import { colors, layout, radius, spacing } from '@/design/tokens';

export default function CoachUpdateScreen() {
  const router = useRouter(); const { latestUpdate } = useAcademyData();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)'); };
  return <AppScreen withTabBarClearance={false}><SubpageHeader title="Academy Update" subtitle={latestUpdate.publishedAt} onBack={back} /><View style={styles.card}><AppText variant="caption" weight="extraBold" color={colors.brand.blue}>SCHEDULE UPDATE</AppText><AppText variant="title" weight="extraBold">{latestUpdate.title}</AppText><AppText color={colors.neutral.textSecondary}>{latestUpdate.summary}</AppText><View style={styles.note}><AppText variant="bodySmall" weight="semibold">The updated time applies to the U13 squad. Review Schedule before Saturday’s session.</AppText></View></View></AppScreen>;
}
const styles = StyleSheet.create({ card: { padding: layout.largeCardPadding, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.standard, backgroundColor: colors.neutral.surface, gap: spacing.sm }, note: { marginTop: spacing.xs, padding: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.brand.blueSoft } });
