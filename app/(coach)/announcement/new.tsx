import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { OperationsField } from '@/components/coach/operations-controls';
import { AppBottomSheet } from '@/components/common/app-bottom-sheet';
import { AppButton } from '@/components/common/app-button';
import { AppScreen } from '@/components/common/app-screen';
import { AppSelectRow } from '@/components/common/app-select-row';
import { AppTextInput } from '@/components/common/app-text-input';
import { InlineInfoBanner } from '@/components/states/inline-info-banner';
import { useToast } from '@/components/states/success-toast';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { useAcademyOperations } from '@/contexts/academy-operations-context';
import { coachLayout } from '@/design/tokens';
import { AnnouncementAudience, AnnouncementType } from '@/types/operations';

const types = ['Match', 'Camp', 'Holiday', 'Schedule Change', 'Academy Event', 'General Notice'] as const;
const audienceLabels = ['My Category', 'Selected Categories', 'All Players'] as const;
type AnnouncementSheet = 'type' | 'audience' | null;

export default function NewAnnouncementRoute() {
  const router = useRouter(); const operations = useAcademyOperations(); const { showSuccess } = useToast();
  const [type, setType] = useState<AnnouncementType>('General Notice'); const [audienceLabel, setAudienceLabel] = useState<(typeof audienceLabels)[number]>('My Category'); const [title, setTitle] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState<string>(); const [sheet, setSheet] = useState<AnnouncementSheet>(null);
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)'); };
  const publish = async () => {
    if (!title.trim()) { setError('Enter an announcement title.'); return; }
    if (!message.trim()) { setError('Enter a short announcement message.'); return; }
    const audience: AnnouncementAudience = audienceLabel === 'My Category' ? 'my-category' : audienceLabel === 'Selected Categories' ? 'selected-categories' : 'all-players';
    const result = await operations.postAnnouncement({ type, audience, categoryIds: audience === 'all-players' ? ['u10', 'u13', 'u15'] : audience === 'selected-categories' ? ['u13', 'u15'] : ['u13'], title: title.trim(), message: message.trim(), creatorId: 'coach-sandeep', creatorName: 'Sandeep', priority: type === 'Holiday' || type === 'Schedule Change' ? 'important' : 'normal' });
    if (!result.value) { setError(result.error ?? 'Unable to post announcement.'); return; }
    showSuccess('Announcement posted', 'The Player Updates feed has been refreshed.'); router.back();
  };
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><AppScreen keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}><SubpageHeader title="Post Update" subtitle="Share a short academy announcement" onBack={back} backDisabled={operations.isSaving} /><View style={styles.form}>{error ? <InlineInfoBanner tone="error" title="Check the update" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}<AppSelectRow label="Announcement type" value={type} icon="bullhorn-outline" disabled={operations.isSaving} onPress={() => setSheet('type')} /><AppSelectRow label="Audience" value={audienceLabel} supportingText="Standard Coaches may post only to assigned categories" icon="account-multiple-outline" disabled={operations.isSaving} onPress={() => setSheet('audience')} /><OperationsField title="Title"><AppTextInput value={title} onChangeText={(value) => { setTitle(value.slice(0, 70)); setError(undefined); }} maxLength={70} placeholder="Short update title" accessibilityLabel="Announcement title" returnKeyType="next" error={error === 'Enter an announcement title.'} /></OperationsField><OperationsField title="Message" supporting={`${message.length}/240 characters`}><AppTextInput value={message} onChangeText={(value) => { setMessage(value.slice(0, 240)); setError(undefined); }} maxLength={240} multiline placeholder="What do players and parents need to know?" accessibilityLabel="Announcement message" error={error === 'Enter a short announcement message.'} /></OperationsField><AppButton label="Publish Update" onPress={() => void publish()} loading={operations.isSaving} disabled={operations.isSaving} /></View></AppScreen><AppBottomSheet visible={sheet === 'type'} title="Announcement type" description="Choose the label players will see in Updates." options={types.map((value) => ({ id: value, label: value, icon: 'bullhorn-outline' as const }))} selectedIds={[type]} loading={operations.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = types.find((item) => item === id); if (value) { setType(value); setSheet(null); } }} /><AppBottomSheet visible={sheet === 'audience'} title="Select audience" description="Only your assigned academy categories are available." options={audienceLabels.map((value) => ({ id: value, label: value, supportingText: value === 'My Category' ? 'U13 Development Squad' : value === 'Selected Categories' ? 'U13 and U15 squads' : 'Admin permission required', icon: 'account-multiple-outline' as const, disabled: value === 'All Players' }))} selectedIds={[audienceLabel]} loading={operations.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = audienceLabels.find((item) => item === id); if (value && value !== 'All Players') { setAudienceLabel(value); setSheet(null); } }} /></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { paddingBottom: 32 }, form: { gap: coachLayout.sectionGap } });
