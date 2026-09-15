import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { AdminField } from '@/components/admin/admin-form';
import { AppBottomSheet } from '@/components/common/app-bottom-sheet';
import { AppButton } from '@/components/common/app-button';
import { AppScreen } from '@/components/common/app-screen';
import { AppSelectRow } from '@/components/common/app-select-row';
import { AppTextInput } from '@/components/common/app-text-input';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { useToast } from '@/components/states/success-toast';
import { adminDemoConfig } from '@/config/admin';
import { useAdminData } from '@/contexts/admin-data-context';
import { adminLayout } from '@/design/tokens/admin';
import { IncomeCategory, PaymentMethod } from '@/types/admin';
import { formatCurrency } from '@/utils/format';

const categories = ['Camp Fees', 'Tournament Fees', 'Sponsorship', 'Merchandise', 'Other'] as const satisfies readonly IncomeCategory[];
const categoryIcons: Readonly<Record<(typeof categories)[number], 'tent' | 'trophy-outline' | 'handshake-outline' | 'tshirt-crew-outline' | 'dots-horizontal-circle-outline'>> = {
  'Camp Fees': 'tent', 'Tournament Fees': 'trophy-outline', Sponsorship: 'handshake-outline', Merchandise: 'tshirt-crew-outline', Other: 'dots-horizontal-circle-outline',
};
const methods = ['Cash', 'Bank Transfer', 'UPI'] as const satisfies readonly PaymentMethod[];
type IncomeSheet = 'category' | 'method' | null;

export default function NewIncomeRoute() {
  const router = useRouter();
  const admin = useAdminData();
  const { showSuccess } = useToast();
  const savingRef = useRef(false);
  const [category, setCategory] = useState<IncomeCategory>('Camp Fees');
  const [amount, setAmount] = useState('');
  const [receivedFrom, setReceivedFrom] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('Cash');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string>();
  const [sheet, setSheet] = useState<IncomeSheet>(null);

  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/finance/money-in'); };

  const save = async () => {
    if (savingRef.current) return;
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) { setError('Enter an amount greater than zero.'); return; }
    if (!receivedFrom.trim()) { setError('Enter who this was received from.'); return; }
    savingRef.current = true;
    try {
      const result = await admin.recordIncome({ category, amount: parsedAmount, receivedFrom, method, note });
      if (!result.value) { setError(result.error ?? 'Unable to record this income.'); return; }
      showSuccess('Money In recorded', `${formatCurrency(result.value.amount)} from ${result.value.receivedFrom}.`);
      back();
    } finally { savingRef.current = false; }
  };

  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <AppScreen keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}>
      <SubpageHeader title="Add Income" subtitle={`Recorded against ${adminDemoConfig.billing.currentPeriod}`} onBack={back} backDisabled={admin.isSaving} />
      <View style={styles.form}>
        {error ? <InlineInfoBanner tone="error" title="Check the income" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}
        <InlineInfoBanner tone="info" title="Player fees are separate" message="Player fees are collected from a member's fee record. Use this for camps, tournaments, sponsorship, and merchandise." />
        <AppSelectRow label="Category" value={category} icon={categoryIcons[category]} disabled={admin.isSaving} onPress={() => setSheet('category')} />
        <AdminField title="Amount" supporting={amount ? formatCurrency(Number(amount) || 0) : 'Amount in rupees'}><AppTextInput testID="admin-income-amount" value={amount} onChangeText={(value) => { setAmount(value.replace(/\D/g, '').slice(0, 7)); setError(undefined); }} keyboardType="number-pad" maxLength={7} placeholder="0" accessibilityLabel="Income amount" error={error === 'Enter an amount greater than zero.'} /></AdminField>
        <AdminField title="Received from"><AppTextInput testID="admin-income-received-from" value={receivedFrom} onChangeText={(value) => { setReceivedFrom(value.slice(0, 60)); setError(undefined); }} maxLength={60} placeholder="Sponsor, camp batch, or buyer" accessibilityLabel="Received from" error={error === 'Enter who this was received from.'} /></AdminField>
        <AppSelectRow label="Payment method" value={method} icon="bank-outline" disabled={admin.isSaving} onPress={() => setSheet('method')} />
        <AdminField title="Note" supporting={`${note.length}/120 characters`}><AppTextInput testID="admin-income-note" value={note} onChangeText={(value) => setNote(value.slice(0, 120))} maxLength={120} multiline placeholder="What was this for?" accessibilityLabel="Income note" /></AdminField>
        <AppButton testID="admin-income-save" label="Record Income" onPress={() => void save()} loading={admin.isSaving} disabled={admin.isSaving} />
      </View>
    </AppScreen>
    <AppBottomSheet visible={sheet === 'category'} title="Income category" description="Money In is grouped by category alongside player fees." options={categories.map((value) => ({ id: value, label: value, icon: categoryIcons[value] }))} selectedIds={[category]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = categories.find((item) => item === id); if (value) { setCategory(value); setSheet(null); setError(undefined); } }} />
    <AppBottomSheet visible={sheet === 'method'} title="Payment method" options={methods.map((value) => ({ id: value, label: value, icon: value === 'Cash' ? 'cash' as const : value === 'UPI' ? 'cellphone' as const : 'bank-outline' as const }))} selectedIds={[method]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = methods.find((item) => item === id); if (value) { setMethod(value); setSheet(null); } }} />
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { paddingBottom: 32 }, form: { gap: adminLayout.sectionGap } });
