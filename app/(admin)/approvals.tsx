import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ApprovalList } from '@/components/admin/admin-dashboard-lists';
import { AdminFilterChips, AdminFilterLabel } from '@/components/admin/admin-filters';
import { AdminDetailSkeleton } from '@/components/admin/admin-states';
import { AppConfirmationDialog } from '@/components/common/app-confirmation-dialog';
import { AppScreen } from '@/components/common/app-screen';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { useToast } from '@/components/states/success-toast';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout } from '@/design/tokens/admin';
import { AdminApprovalItem, ApprovalState } from '@/types/admin';

type ApprovalFilter = 'pending' | 'approved' | 'declined';
const filterOptions = [{ value: 'pending' as const, label: 'Pending' }, { value: 'approved' as const, label: 'Approved' }, { value: 'declined' as const, label: 'Declined' }];

export default function AdminApprovalsScreen() {
  const router = useRouter();
  const admin = useAdminData();
  const { showSuccess } = useToast();
  const [filter, setFilter] = useState<ApprovalFilter>('pending');
  const [decision, setDecision] = useState<{ readonly approval: AdminApprovalItem; readonly state: Exclude<ApprovalState, 'pending'> } | null>(null);
  const [error, setError] = useState<string>();

  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)'); };
  if (admin.status === 'loading') return <AppScreen withTabBarClearance={false}><AdminDetailSkeleton label="Loading approval queue" /></AppScreen>;
  if (admin.status === 'error') return <AppScreen withTabBarClearance={false}><SubpageHeader title="Approvals" onBack={back} /><ContentState type="error" title="Approvals unavailable" message="The approval queue could not be loaded." onRetry={admin.retry} /></AppScreen>;

  const approvals = admin.approvals.filter((approval) => approval.state === filter);
  const confirm = async () => {
    if (!decision) return;
    const result = await admin.decideApproval(decision.approval.id, decision.state);
    if (!result.value) { setDecision(null); setError(result.error ?? 'The decision could not be saved.'); return; }
    setDecision(null); setError(undefined);
    showSuccess(decision.state === 'approved' ? 'Request approved' : 'Request declined', decision.approval.title);
  };

  return <>
    <AppScreen withTabBarClearance={false}>
      <SubpageHeader title="Approvals" subtitle="Enrolments, transfers, concessions, and leave" onBack={back} backDisabled={admin.isSaving} />
      <View style={styles.sections}>
        {admin.storageWarning ? <InlineInfoBanner tone="warning" title="Approval storage unavailable" message="Decisions remain visible for this session only." /> : null}
        {error ? <InlineInfoBanner tone="error" title="Decision not saved" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}
        <View><AdminFilterLabel label="Queue" /><AdminFilterChips options={filterOptions} selected={filter} onSelect={setFilter} label="Approval queue" testIDPrefix="admin-approval-filter" /></View>
        {approvals.length
          ? <ApprovalList approvals={approvals} busy={admin.isSaving} onDecide={(approval, state) => setDecision({ approval, state })} />
          : <ContentState type="empty" icon="clipboard-check-outline" title={filter === 'pending' ? 'Nothing waiting' : `No ${filter} requests`} message={filter === 'pending' ? 'Every academy request has been reviewed.' : 'Reviewed requests appear here once a decision is recorded.'} />}
      </View>
    </AppScreen>
    <AppConfirmationDialog visible={Boolean(decision)} icon={decision?.state === 'approved' ? 'check-decagram-outline' : 'close-octagon-outline'} title={decision?.state === 'approved' ? 'Approve this request?' : 'Decline this request?'} description={decision?.approval.summary ?? ''} cancelLabel="Go Back" confirmLabel={decision?.state === 'approved' ? 'Approve' : 'Decline'} destructive={decision?.state === 'declined'} loading={admin.isSaving} onCancel={() => setDecision(null)} onConfirm={() => { void confirm(); }} />
  </>;
}

const styles = StyleSheet.create({ sections: { gap: adminLayout.sectionGap } });
