import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';

export function LogoutDialog({ visible, onCancel, onConfirm }: { visible: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent><View style={styles.overlay}><Pressable accessibilityLabel="Cancel logout" style={StyleSheet.absoluteFill} onPress={onCancel} /><View accessibilityViewIsModal accessibilityRole="alert" style={styles.dialog}><View style={styles.icon}><MaterialCommunityIcons name="logout" size={25} color={colors.status.error} /></View><AppText variant="title" weight="extraBold">Log out?</AppText><AppText color={colors.neutral.textSecondary} style={styles.center}>You will need to sign in again to access the player account.</AppText><View style={styles.actions}><AppButton testID="logout-cancel" label="Cancel" variant="secondary" onPress={onCancel} accessibilityLabel="Cancel logout" style={styles.action} /><AppButton testID="logout-confirm" label="Log out" onPress={onConfirm} accessibilityLabel="Confirm logout" style={styles.action} /></View></View></View></Modal>;
}

const styles = StyleSheet.create({
  overlay: { flex: 1, padding: spacing.lg, backgroundColor: colors.modalOverlay, alignItems: 'center', justifyContent: 'center' },
  dialog: { ...shadows.floating, width: '100%', maxWidth: 420, padding: spacing.lg, borderRadius: radius.hero, backgroundColor: colors.neutral.surface, alignItems: 'center', gap: spacing.sm },
  icon: { width: 52, height: 52, borderRadius: radius.medium, backgroundColor: colors.status.errorSoft, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
  actions: { width: '100%', marginTop: spacing.sm, flexDirection: 'row', gap: spacing.sm },
  action: { flex: 1, minHeight: layout.minTouchTarget },
});
