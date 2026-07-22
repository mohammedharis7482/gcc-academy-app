import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
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
import { getPlayersByCategory } from '@/data/academy';
import { getSessionTopic, learningLessons } from '@/data/learning';
import { coachLayout } from '@/design/tokens';
import { SessionAssignmentTarget } from '@/types/operations';

const targetLabels = ['Category', 'One Player', 'Selected Players'] as const;
type AssignmentSheet = 'session' | 'target' | 'category' | 'players' | null;

export default function NewSessionAssignmentRoute() {
  const router = useRouter(); const params = useLocalSearchParams<{ playerId?: string | string[] }>(); const initialPlayerId = Array.isArray(params.playerId) ? params.playerId[0] : params.playerId; const operations = useAcademyOperations(); const { showSuccess } = useToast(); const players = useMemo(() => getPlayersByCategory('U13'), []); const validInitialPlayerId = players.some((player) => player.id === initialPlayerId) ? initialPlayerId : undefined;
  const assigningRef = useRef(false);
  const [sessionId, setSessionId] = useState(learningLessons[0].id); const [targetLabel, setTargetLabel] = useState<(typeof targetLabels)[number]>(validInitialPlayerId ? 'One Player' : 'Category'); const [selectedPlayerIds, setSelectedPlayerIds] = useState<readonly string[]>(validInitialPlayerId ? [validInitialPlayerId] : []); const [message, setMessage] = useState('Watch this Academy Session before your next training.'); const [error, setError] = useState<string>(); const [sheet, setSheet] = useState<AssignmentSheet>(null);
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)'); };
  const togglePlayer = (id: string) => setSelectedPlayerIds((current) => current.includes(id) ? current.filter((item) => item !== id) : targetLabel === 'One Player' ? [id] : [...current, id]);
  const assign = async () => {
    if (assigningRef.current) return;
    const targetType: SessionAssignmentTarget = targetLabel === 'Category' ? 'category' : targetLabel === 'One Player' ? 'player' : 'players'; const targetIds = targetType === 'category' ? ['u13'] : targetType === 'player' ? selectedPlayerIds.slice(0, 1) : selectedPlayerIds;
    if (!targetIds.length) { setError('Select at least one player.'); return; }
    assigningRef.current = true;
    try {
      const result = await operations.assignSession({ sessionId, targetType, targetIds, assignedById: 'coach-sandeep', assignedByName: 'Sandeep', message: message.trim() || undefined });
      if (!result.value) { setError(result.error ?? 'Unable to assign this Session.'); return; }
      showSuccess('Session assigned', 'It now appears on Player Home, Sessions, and Updates.'); back();
    } finally { assigningRef.current = false; }
  };
  const selectedSession = learningLessons.find((session) => session.id === sessionId) ?? learningLessons[0];
  const selectedPlayersLabel = selectedPlayerIds.length ? targetLabel === 'One Player' ? players.find((player) => player.id === selectedPlayerIds[0])?.name ?? 'Select player' : `${selectedPlayerIds.length} players selected` : 'Select players';
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><AppScreen keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}><SubpageHeader title="Assign Session" subtitle="Choose an existing Academy Session video" onBack={back} backDisabled={operations.isSaving} /><View style={styles.form}>{error ? <InlineInfoBanner tone="error" title="Unable to assign Session" message={error} actionLabel="Dismiss" onAction={() => setError(undefined)} /> : null}<AppSelectRow label="Session video" value={selectedSession.title} supportingText={`${getSessionTopic(selectedSession)} · ${selectedSession.durationMinutes} min`} icon="play-box-outline" disabled={operations.isSaving} onPress={() => setSheet('session')} /><AppSelectRow label="Assign to" value={targetLabel} icon="account-multiple-outline" disabled={operations.isSaving} onPress={() => setSheet('target')} />{targetLabel === 'Category' ? <AppSelectRow label="Category" value="U13 Development Squad" icon="account-group-outline" disabled={operations.isSaving} onPress={() => setSheet('category')} /> : <AppSelectRow label={targetLabel === 'One Player' ? 'Player' : 'Players'} value={selectedPlayersLabel} supportingText={targetLabel === 'Selected Players' ? 'Select one or more U13 players' : undefined} icon="account-search-outline" error={Boolean(error && !selectedPlayerIds.length)} disabled={operations.isSaving} onPress={() => setSheet('players')} />}<OperationsField title="Optional message" supporting={`${message.length}/160 characters`}><AppTextInput value={message} onChangeText={(value) => setMessage(value.slice(0, 160))} maxLength={160} multiline accessibilityLabel="Optional assignment message" /></OperationsField><AppButton label="Assign Session" onPress={() => void assign()} loading={operations.isSaving} disabled={operations.isSaving} /></View></AppScreen><AppBottomSheet visible={sheet === 'session'} title="Select Session video" description="Choose an existing academy-approved Session." options={learningLessons.map((session) => ({ id: session.id, label: session.title, supportingText: `${getSessionTopic(session)} · ${session.durationMinutes} min`, icon: 'play-box-outline' as const }))} selectedIds={[sessionId]} loading={operations.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { if (learningLessons.some((session) => session.id === id)) { setSessionId(id); setSheet(null); } }} /><AppBottomSheet visible={sheet === 'target'} title="Assign Session to" options={targetLabels.map((value) => ({ id: value, label: value, supportingText: value === 'Category' ? 'Assign to the full U13 squad' : value === 'One Player' ? 'Choose one player' : 'Choose several players', icon: 'account-multiple-outline' as const }))} selectedIds={[targetLabel]} loading={operations.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { const value = targetLabels.find((item) => item === id); if (value) { setTargetLabel(value); setSheet(null); } }} /><AppBottomSheet visible={sheet === 'category'} title="Select category" description="Coach Sandeep is currently assigned to U13." options={[{ id: 'u13', label: 'U13 Development Squad', supportingText: '20 assigned players', icon: 'account-group-outline' }]} selectedIds={['u13']} loading={operations.isSaving} onClose={() => setSheet(null)} onSelect={() => setSheet(null)} /><AppBottomSheet visible={sheet === 'players'} title={targetLabel === 'One Player' ? 'Select player' : 'Select players'} description={targetLabel === 'Selected Players' ? 'Tap players to add or remove them, then close this sheet.' : undefined} options={players.map((player) => ({ id: player.id, label: player.name, supportingText: `${player.playerId} · #${player.jerseyNumber} · ${player.position}`, icon: 'account-outline' as const }))} selectedIds={targetLabel === 'One Player' ? selectedPlayerIds.slice(0, 1) : selectedPlayerIds} multiple={targetLabel === 'Selected Players'} loading={operations.isSaving} onClose={() => setSheet(null)} onSelect={(id) => { togglePlayer(id); if (targetLabel === 'One Player') setSheet(null); }} /></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { paddingBottom: 32 }, form: { gap: coachLayout.sectionGap } });
