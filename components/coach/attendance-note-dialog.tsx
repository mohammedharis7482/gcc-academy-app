import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { AppTextInput } from '@/components/common/app-text-input';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function AttendanceNoteDialog({ visible, playerName, initialNote, onCancel, onSave }: { readonly visible: boolean; readonly playerName: string; readonly initialNote: string; readonly onCancel: () => void; readonly onSave: (note: string) => void }) {
  const [note, setNote] = useState(initialNote);
  const reducedMotion = useReducedMotion();
  useEffect(() => { if (visible) setNote(initialNote); }, [initialNote, visible]);
  return <Modal visible={visible} transparent animationType={reducedMotion ? 'none' : 'fade'} presentationStyle="overFullScreen" onRequestClose={onCancel} statusBarTranslucent><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}><SafeAreaView edges={['top', 'bottom']} style={styles.overlay}><Pressable accessibilityRole="button" accessibilityLabel="Close attendance note" style={StyleSheet.absoluteFill} onPress={onCancel} /><View accessibilityViewIsModal style={styles.dialog}><View style={styles.icon}><MaterialCommunityIcons name="note-edit-outline" size={25} color={colors.brand.navy} /></View><AppText variant="title" weight="extraBold">Attendance note</AppText><AppText variant="bodySmall" color={colors.neutral.textSecondary}>Optional private note for {playerName}</AppText><AppTextInput testID="attendance-note-input" accessibilityLabel={`Attendance note for ${playerName}`} value={note} onChangeText={(value) => setNote(value.slice(0, 80))} placeholder="Sick, school exam, arrived late…" multiline maxLength={80} autoFocus /><AppText variant="caption" color={colors.neutral.textMuted} style={styles.count}>{note.length}/80</AppText><View style={styles.actions}><AppButton label="Keep Status" variant="secondary" onPress={onCancel} style={styles.action} /><AppButton testID="attendance-note-save" label={note.trim() ? 'Save Note' : 'Clear Note'} onPress={() => onSave(note)} style={styles.action} /></View></View></SafeAreaView></KeyboardAvoidingView></Modal>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, overlay: { flex: 1, padding: spacing.lg, backgroundColor: colors.modalOverlay, alignItems: 'center', justifyContent: 'center' }, dialog: { ...shadows.floating, width: '100%', maxWidth: layout.dialogMaxWidth, padding: spacing.lg, borderRadius: radius.hero, backgroundColor: colors.neutral.surface, gap: spacing.sm }, icon: { width: layout.dialogIconSize, height: layout.dialogIconSize, borderRadius: radius.medium, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' }, count: { alignSelf: 'flex-end' }, actions: { flexDirection: 'row', gap: spacing.xs }, action: { flex: 1, minHeight: layout.minTouchTarget } });
