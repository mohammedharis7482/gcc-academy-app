import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdminFilterChips, AdminFilterLabel, AdminSearch } from '@/components/admin/admin-filters';
import { AdminPageHeader } from '@/components/admin/admin-header';
import { MemberListCard } from '@/components/admin/admin-member-cards';
import { AdminListSkeleton } from '@/components/admin/admin-states';
import { AppText } from '@/components/common/app-text';
import { ContentState } from '@/components/states/content-state';
import { searchAdminMembers } from '@/data/admin';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout, adminTabBarMetrics } from '@/design/tokens/admin';
import { colors, layout, spacing } from '@/design/tokens';
import { AdminMember, EnrolmentStatus } from '@/types/admin';
import { AgeCategory } from '@/types/academy';
import { formatCurrency } from '@/utils/format';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

type CategoryFilter = 'all' | AgeCategory;
type EnrolmentFilter = 'all' | EnrolmentStatus;

const categoryOptions = [{ value: 'all' as const, label: 'All' }, { value: 'U10' as const, label: 'U10' }, { value: 'U13' as const, label: 'U13' }, { value: 'U15' as const, label: 'U15' }];
const enrolmentOptions = [{ value: 'all' as const, label: 'All' }, { value: 'active' as const, label: 'Active' }, { value: 'trial' as const, label: 'Trial' }, { value: 'paused' as const, label: 'Paused' }, { value: 'left' as const, label: 'Left' }];

export default function AdminMembersScreen() {
  const admin = useAdminData();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const navigateOnce = useSingleNavigation();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [enrolment, setEnrolment] = useState<EnrolmentFilter>('all');

  const categoryMembers = useMemo(() => category === 'all' ? admin.members : admin.members.filter((member) => member.category === category), [admin.members, category]);
  const filteredMembers = useMemo(() => {
    const searched = searchAdminMembers(categoryMembers, query);
    const scoped = enrolment === 'all' ? searched : searched.filter((member) => member.enrolment === enrolment);
    return [...scoped].sort((a, b) => a.name.localeCompare(b.name));
  }, [categoryMembers, enrolment, query]);
  const outstanding = useMemo(() => categoryMembers.reduce((total, member) => total + member.outstandingAmount, 0), [categoryMembers]);

  const openMember = useCallback((member: AdminMember) => { Keyboard.dismiss(); navigateOnce(() => router.push({ pathname: '/(admin)/members/[memberId]', params: { memberId: member.id } })); }, [navigateOnce, router]);

  if (admin.status === 'loading') return <SafeAreaView style={styles.safe} edges={['top']}><AdminListSkeleton label="Loading academy members" /></SafeAreaView>;
  if (admin.status === 'error') return <SafeAreaView style={styles.safe} edges={['top']}><View style={styles.state}><ContentState type="error" title="Members unavailable" message="The academy member directory could not be loaded." onRetry={admin.retry} /></View></SafeAreaView>;

  const emptyMessage = query ? `No members match “${query}” with the selected filters.` : enrolment !== 'all' ? 'No members match the selected enrolment status.' : 'No members are recorded for this category.';
  const header = <View>
    <AdminPageHeader title="Members" subtitle="Every player registered with the academy" actionLabel="Enrol" actionTestID="admin-members-enrol" onAction={() => navigateOnce(() => router.push('/(admin)/members/new'))} />
    <View style={styles.controls}>
      <AdminSearch testID="admin-member-search" query={query} onChange={setQuery} placeholder="Search name, ID, guardian or squad" accessibilityLabel="Search academy members by name, ID, guardian, or squad" />
      <View><AdminFilterLabel label="Category" /><AdminFilterChips options={categoryOptions} selected={category} onSelect={setCategory} label="Category" testIDPrefix="admin-member-category" /></View>
      <View><AdminFilterLabel label="Enrolment" /><AdminFilterChips options={enrolmentOptions} selected={enrolment} onSelect={setEnrolment} label="Enrolment" testIDPrefix="admin-member-enrolment" /></View>
      <View style={styles.summary}><View style={styles.grow}><AppText variant="heading" weight="extraBold">{category === 'all' ? 'All academy squads' : `${category} squad`}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{filteredMembers.length} of {categoryMembers.length} members shown</AppText></View><View style={styles.summaryEnd}><AppText variant="caption" color={colors.neutral.textSecondary}>Outstanding</AppText><AppText variant="bodySmall" weight="extraBold" color={outstanding ? colors.status.warning : colors.status.success}>{formatCurrency(outstanding)}</AppText></View></View>
    </View>
  </View>;

  return <SafeAreaView style={styles.safe} edges={['top']}><FlatList data={filteredMembers} keyExtractor={(member) => member.id} renderItem={({ item }) => <MemberListCard member={item} onPress={openMember} />} ListHeaderComponent={header} ListEmptyComponent={<ContentState type="empty" icon="account-search-outline" title="No members found" message={emptyMessage} />} ItemSeparatorComponent={Separator} contentContainerStyle={[styles.content, { paddingBottom: adminTabBarMetrics.height + insets.bottom + adminTabBarMetrics.contentClearance }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" initialNumToRender={10} maxToRenderPerBatch={10} windowSize={7} /></SafeAreaView>;
}

function Separator() { return <View style={styles.separator} />; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.background },
  state: { padding: adminLayout.pageHorizontal, paddingTop: adminLayout.pageTop },
  content: { width: '100%', maxWidth: layout.contentMaxWidth, alignSelf: 'center', paddingHorizontal: adminLayout.pageHorizontal },
  controls: { gap: spacing.sm, paddingBottom: spacing.sm },
  summary: { minHeight: 52, paddingHorizontal: spacing.xs, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  grow: { flex: 1, minWidth: 0 }, summaryEnd: { alignItems: 'flex-end' },
  separator: { height: adminLayout.cardGap },
});
