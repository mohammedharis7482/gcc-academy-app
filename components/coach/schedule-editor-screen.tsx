import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { OperationsField } from '@/components/coach/operations-controls';
import { AppBottomSheet } from '@/components/common/app-bottom-sheet';
import { AppButton } from '@/components/common/app-button';
import { AppScreen } from '@/components/common/app-screen';
import { AppSelectRow } from '@/components/common/app-select-row';
import { AppTextInput } from '@/components/common/app-text-input';
import { ContentState } from '@/components/states/content-state';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { useToast } from '@/components/states/success-toast';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { demoConfig } from '@/config/demo';
import { useAcademyOperations } from '@/contexts/academy-operations-context';
import { coachLayout } from '@/design/tokens';

const categories = ['U10', 'U13', 'U15'] as const;
const dates = ['21 July 2026', '23 July 2026', '25 July 2026'] as const;
const times = ['5:00 PM–6:30 PM', '4:30 PM–6:00 PM', '6:00 PM–7:30 PM'] as const;
const pitches = ['GCC Football Ground', 'GCC Training Pitch 2'] as const;
type ScheduleSheet = 'category' | 'date' | 'time' | 'pitch' | null;

export function ScheduleEditorScreen({ scheduleId }: { readonly scheduleId?: string }) {
  const router = useRouter(); const operations = useAcademyOperations(); const { showSuccess } = useToast();
  const existing = scheduleId ? operations.getSchedule(scheduleId) : undefined;
  const [category, setCategory] = useState<(typeof categories)[number]>(existing?.categoryName.startsWith('U10') ? 'U10' : existing?.categoryName.startsWith('U15') ? 'U15' : 'U13');
  const [dateLabel, setDateLabel] = useState<(typeof dates)[number]>(dates.includes(existing?.dateLabel as (typeof dates)[number]) ? existing!.dateLabel as (typeof dates)[number] : dates[0]);
  const [time, setTime] = useState<(typeof times)[number]>(times.includes(existing?.time as (typeof times)[number]) ? existing!.time as (typeof times)[number] : times[0]);
  const [pitch, setPitch] = useState<(typeof pitches)[number]>(pitches.includes(existing?.pitch as (typeof pitches)[number]) ? existing!.pitch as (typeof pitches)[number] : pitches[0]);
  const [note, setNote] = useState(existing?.note ?? 'First touch and passing'); const [error, setError] = useState<string>(); const [sheet, setSheet] = useState<ScheduleSheet>(null);
  const date = useMemo(() => ({ '21 July 2026': '2026-07-21', '23 July 2026': '2026-07-23', '25 July 2026': '2026-07-25' }[dateLabel]), [dateLabel]);
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)/schedule'); };
  if (scheduleId && operations.status === 'ready' && !existing) return <AppScreen><ContentState type="error" icon="calendar-remove-outline" title="Schedule not found" message="This schedule is no longer available." actionLabel="Back to Schedule" onRetry={() => router.replace('/(coach)/(tabs)/schedule')} /></AppScreen>;
  const publish = async () => {
    setError(undefined); const categoryName = category === 'U13' ? demoConfig.player.category : `${category} ${category === 'U10' ? 'Foundation' : 'Performance'} Squad`;
    const result = await operations.publishSchedule({ id: existing?.id, categoryId: category.toLowerCase(), categoryName, date, dateLabel, time, pitch, coachId: 'coach-sandeep', coachName: 'Sandeep', playerCount: 20, note: note.trim() || undefined, status: existing?.status === 'cancelled' ? 'upcoming' : existing?.status ?? 'upcoming' });
    if (!result.value) { setError(result.error ?? 'Unable to save schedule.'); return; }
    showSuccess(existing ? 'Schedule updated' : 'Schedule published', `${categoryName} players can now see this training time.`); router.replace('/(coach)/(tabs)/schedule');
  };
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><AppScreen keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}><SubpageHeader title={existing ? 'Edit Schedule' : 'Add Schedule'} subtitle="Publish a clear training time" onBack={back} backDisabled={operations.isSaving} /><View style={styles.form}>{error ? <InlineInfoBanner tone="error" title="Unable to save schedule" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}<AppSelectRow label="Category" value={category} icon="account-group-outline" disabled={operations.isSaving} onPress={() => setSheet('category')} /><AppSelectRow label="Date" value={dateLabel} icon="calendar-outline" disabled={operations.isSaving} onPress={() => setSheet('date')} /><AppSelectRow label="Time" value={time} icon="clock-outline" disabled={operations.isSaving} onPress={() => setSheet('time')} /><AppSelectRow label="Pitch" value={pitch} icon="map-marker-outline" disabled={operations.isSaving} onPress={() => setSheet('pitch')} /><OperationsField title="Assigned Coach" supporting="Confirmed from your Coach account"><AppTextInput value="Sandeep" editable={false} accessibilityLabel="Assigned Coach Sandeep" /></OperationsField><OperationsField title="Optional note" supporting={`${note.length}/160 characters`}><AppTextInput value={note} onChangeText={(value) => setNote(value.slice(0, 160))} multiline maxLength={160} placeholder="Add the session focus" accessibilityLabel="Optional schedule note" returnKeyType="done" /></OperationsField><AppButton label={existing ? 'Save Changes' : 'Publish Schedule'} onPress={() => void publish()} loading={operations.isSaving} disabled={operations.isSaving} /></View></AppScreen><AppBottomSheet visible={sheet === 'category'} title="Select category" description="Choose the squad that should receive this schedule." options={categories.map((value) => ({ id: value, label: value, supportingText: value === 'U13' ? 'Your primary assigned squad' : 'Assigned academy category' }))} selectedIds={[category]} loading={operations.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = categories.find((item) => item === id); if (value) { setCategory(value); setSheet(null); } }} /><AppBottomSheet visible={sheet === 'date'} title="Select training date" options={dates.map((value) => ({ id: value, label: value, icon: 'calendar-outline' as const }))} selectedIds={[dateLabel]} loading={operations.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = dates.find((item) => item === id); if (value) { setDateLabel(value); setSheet(null); } }} /><AppBottomSheet visible={sheet === 'time'} title="Select training time" options={times.map((value) => ({ id: value, label: value, icon: 'clock-outline' as const }))} selectedIds={[time]} loading={operations.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = times.find((item) => item === id); if (value) { setTime(value); setSheet(null); } }} /><AppBottomSheet visible={sheet === 'pitch'} title="Select training pitch" options={pitches.map((value) => ({ id: value, label: value, icon: 'map-marker-outline' as const }))} selectedIds={[pitch]} loading={operations.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = pitches.find((item) => item === id); if (value) { setPitch(value); setSheet(null); } }} /></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { paddingBottom: 32 }, form: { gap: coachLayout.sectionGap } });
