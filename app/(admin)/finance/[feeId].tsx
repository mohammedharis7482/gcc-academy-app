import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { AdminField } from '@/components/admin/admin-form';
import { FeeDetailCard } from '@/components/admin/admin-finance';
import { AdminDetailSkeleton } from '@/components/admin/admin-states';
import { AppBottomSheet } from '@/components/common/app-bottom-sheet';
import { AppButton } from '@/components/common/app-button';
import { AppScreen } from '@/components/common/app-screen';
import { AppSelectRow } from '@/components/common/app-select-row';
import { AppTextInput } from '@/components/common/app-text-input';
import { ProfileSection, SubpageHeader } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { useToast } from '@/components/states/success-toast';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout } from '@/design/tokens/admin';
import { PaymentMethod } from '@/types/admin';
import { paymentMethodOptions, toPaymentMethod } from '@/utils/admin-display';
import { formatCurrency } from '@/utils/format';
import { useSingleNavigation } from '@/hooks/use-single-navigation';

function normalize(value: string | string[] | undefined) { const item = Array.isArray(value) ? value[0] : value; return item?.trim() || undefined; }

export default function AdminFeeDetailScreen() {
  const params = useLocalSearchParams<{ feeId?: string | string[] }>();
  const router = useRouter();
  const admin = useAdminData();
  const { showSuccess } = useToast();
  const navigateOnce = useSingleNavigation();
  const savingRef = useRef(false);
  const [method, setMethod] = useState<PaymentMethod>('Cash');
  const [reference, setReference] = useState('');
  const [error, setError] = useState<string>();
  const [sheetVisible, setSheetVisible] = useState(false);

  const feeId = normalize(params.feeId);
  const record = feeId ? admin.getFeeRecord(feeId) : undefined;
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/(tabs)/finance'); };

  if (admin.status === 'loading') return <AppScreen withTabBarClearance={false}><AdminDetailSkeleton label="Loading fee record" /></AppScreen>;
  if (admin.status === 'error') return <AppScreen withTabBarClearance={false}><SubpageHeader title="Fee Record" onBack={back} /><ContentState type="error" title="Fee record unavailable" message="This fee record could not be loaded." onRetry={admin.retry} /></AppScreen>;
  if (!record) return <AppScreen withTabBarClearance={false}><SubpageHeader title="Fee Record" onBack={back} /><ContentState type="error" title="Fee record not found" message="This fee reference is invalid or is no longer available." actionLabel="Back to finance" onRetry={back} /></AppScreen>;

  const collect = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    try {
      const result = await admin.recordPayment({ feeId: record.id, method, reference });
      if (!result.value) { setError(result.error ?? 'Unable to record this payment.'); return; }
      setError(undefined);
      showSuccess('Payment recorded', `${formatCurrency(record.amount)} collected from ${record.memberName}.`);
    } finally { savingRef.current = false; }
  };

  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <AppScreen keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}>
      <SubpageHeader title="Fee Record" subtitle={`${record.memberName} · ${record.period}`} onBack={back} backDisabled={admin.isSaving} />
      <View style={styles.sections}>
        {error ? <InlineInfoBanner tone="error" title="Payment not recorded" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}
        <FeeDetailCard record={record} />
        {record.status === 'paid'
          ? <InlineInfoBanner tone="success" title="Fee collected" message={`Recorded on ${record.paidOn ?? 'this device'}${record.reference ? ` · ${record.reference}` : ''}.`} />
          : <ProfileSection title="Record Payment"><View style={styles.form}><AppSelectRow label="Payment method" value={method} icon="bank-outline" disabled={admin.isSaving} onPress={() => setSheetVisible(true)} /><AdminField title="Receipt reference" supporting="Optional — a reference is generated when left blank"><AppTextInput testID="admin-payment-reference" value={reference} onChangeText={(value) => setReference(value.slice(0, 24))} maxLength={24} autoCapitalize="characters" placeholder="GCCP-0000" accessibilityLabel="Receipt reference" /></AdminField><AppButton testID="admin-payment-save" label={`Collect ${formatCurrency(record.amount)}`} onPress={() => void collect()} loading={admin.isSaving} disabled={admin.isSaving} /></View></ProfileSection>}
        <AppButton label="Open Member" variant="secondary" onPress={() => navigateOnce(() => router.push({ pathname: '/(admin)/members/[memberId]', params: { memberId: record.memberId } }))} accessibilityLabel={`Open ${record.memberName}`} />
      </View>
    </AppScreen>
    <AppBottomSheet visible={sheetVisible} title="Payment method" description="How was this academy fee collected?" options={paymentMethodOptions} selectedIds={[method]} loading={admin.isSaving} onClose={() => setSheetVisible(false)} onSelect={(id) => { const value = toPaymentMethod(id); if (value) { setMethod(value); setSheetVisible(false); } }} />
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { paddingBottom: 32 }, sections: { gap: adminLayout.sectionGap }, form: { gap: adminLayout.sectionGap } });
