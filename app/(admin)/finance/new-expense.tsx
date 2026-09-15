import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { AdminField } from '@/components/admin/admin-form';
import { expenseCategoryIcons } from '@/components/admin/admin-finance';
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
import { ExpenseCategory, PaymentMethod } from '@/types/admin';
import { formatCurrency } from '@/utils/format';

const categories = ['Coach Salary', 'Ground Rent', 'Equipment', 'Transportation', 'Tournament', 'Events', 'Marketing', 'Maintenance', 'Office', 'Other'] as const satisfies readonly ExpenseCategory[];
const methods = ['Cash', 'Bank Transfer', 'UPI'] as const satisfies readonly PaymentMethod[];
type ExpenseSheet = 'category' | 'method' | null;

export default function NewExpenseRoute() {
  const router = useRouter();
  const admin = useAdminData();
  const { showSuccess } = useToast();
  const savingRef = useRef(false);
  const [category, setCategory] = useState<ExpenseCategory>('Equipment');
  const [amount, setAmount] = useState('');
  const [paidTo, setPaidTo] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('Cash');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string>();
  const [sheet, setSheet] = useState<ExpenseSheet>(null);

  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(admin)/finance/money-out'); };

  const save = async () => {
    if (savingRef.current) return;
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) { setError('Enter an amount greater than zero.'); return; }
    if (!paidTo.trim()) { setError('Enter who this was paid to.'); return; }
    savingRef.current = true;
    try {
      const result = await admin.recordExpense({ category, amount: parsedAmount, paidTo, method, note });
      if (!result.value) { setError(result.error ?? 'Unable to record this expense.'); return; }
      showSuccess('Money Out recorded', `${formatCurrency(result.value.amount)} to ${result.value.paidTo}.`);
      back();
    } finally { savingRef.current = false; }
  };

  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <AppScreen keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}>
      <SubpageHeader title="Add Expense" subtitle={`Recorded against ${adminDemoConfig.billing.currentPeriod}`} onBack={back} backDisabled={admin.isSaving} />
      <View style={styles.form}>
        {error ? <InlineInfoBanner tone="error" title="Check the expense" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}
        {category === 'Coach Salary' ? <InlineInfoBanner tone="info" title="Paying a coach?" message="Use the Coach Salaries screen so the salary status updates with the expense." /> : null}
        <AppSelectRow label="Category" value={category} icon={expenseCategoryIcons[category]} disabled={admin.isSaving} onPress={() => setSheet('category')} />
        <AdminField title="Amount" supporting={amount ? formatCurrency(Number(amount) || 0) : 'Amount in rupees'}><AppTextInput testID="admin-expense-amount" value={amount} onChangeText={(value) => { setAmount(value.replace(/\D/g, '').slice(0, 7)); setError(undefined); }} keyboardType="number-pad" maxLength={7} placeholder="0" accessibilityLabel="Expense amount" error={error === 'Enter an amount greater than zero.'} /></AdminField>
        <AdminField title="Paid to"><AppTextInput testID="admin-expense-paid-to" value={paidTo} onChangeText={(value) => { setPaidTo(value.slice(0, 60)); setError(undefined); }} maxLength={60} placeholder="Supplier, coach, or service" accessibilityLabel="Paid to" error={error === 'Enter who this was paid to.'} /></AdminField>
        <AppSelectRow label="Payment method" value={method} icon="bank-outline" disabled={admin.isSaving} onPress={() => setSheet('method')} />
        <AdminField title="Note" supporting={`${note.length}/120 characters`}><AppTextInput testID="admin-expense-note" value={note} onChangeText={(value) => setNote(value.slice(0, 120))} maxLength={120} multiline placeholder="What was this for?" accessibilityLabel="Expense note" /></AdminField>
        <AppButton testID="admin-expense-save" label="Record Expense" onPress={() => void save()} loading={admin.isSaving} disabled={admin.isSaving} />
      </View>
    </AppScreen>
    <AppBottomSheet visible={sheet === 'category'} title="Expense category" description="Money Out is grouped by category in Reports." options={categories.map((value) => ({ id: value, label: value, icon: expenseCategoryIcons[value] }))} selectedIds={[category]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = categories.find((item) => item === id); if (value) { setCategory(value); setSheet(null); setError(undefined); } }} />
    <AppBottomSheet visible={sheet === 'method'} title="Payment method" options={methods.map((value) => ({ id: value, label: value, icon: value === 'Cash' ? 'cash' as const : value === 'UPI' ? 'cellphone' as const : 'bank-outline' as const }))} selectedIds={[method]} loading={admin.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = methods.find((item) => item === id); if (value) { setMethod(value); setSheet(null); } }} />
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { paddingBottom: 32 }, form: { gap: adminLayout.sectionGap } });
