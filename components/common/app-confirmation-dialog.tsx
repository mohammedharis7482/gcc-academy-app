import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface AppConfirmationDialogProps {
  readonly visible: boolean;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly destructive?: boolean;
  readonly icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  readonly loading?: boolean;
  readonly alternateLabel?: string;
  readonly confirmTestID?: string;
  readonly cancelTestID?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly onAlternate?: () => void;
}

export function AppConfirmationDialog({ visible, title, description, confirmLabel, cancelLabel, destructive = false, icon, loading = false, alternateLabel, confirmTestID, cancelTestID, onConfirm, onCancel, onAlternate }: AppConfirmationDialogProps) {
  const reducedMotion = useReducedMotion();
  const close = () => { if (!loading) onCancel(); };
  const iconName = icon ?? (destructive ? 'alert-outline' : 'check-decagram-outline');
  const accent = destructive ? colors.status.error : colors.brand.blue;
  const surface = destructive ? colors.status.errorSoft : colors.brand.blueSoft;
  return (
    <Modal visible={visible} transparent animationType={reducedMotion ? 'none' : 'fade'} presentationStyle="overFullScreen" statusBarTranslucent onRequestClose={close}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.overlay}>
        <Pressable accessibilityRole="button" accessibilityLabel={cancelLabel} disabled={loading} onPress={close} style={StyleSheet.absoluteFill} />
        <View accessibilityViewIsModal accessibilityRole="alert" accessibilityLabel={`${title}. ${description}`} style={styles.dialog}>
          <View style={[styles.icon, { backgroundColor: surface }]}><MaterialCommunityIcons name={iconName} size={25} color={accent} /></View>
          <AppText variant="title" weight="extraBold" style={styles.center}>{title}</AppText>
          <AppText variant="bodySmall" color={colors.neutral.textSecondary} style={styles.center}>{description}</AppText>
          <View style={styles.actions}>
            {alternateLabel && onAlternate ? <AppButton label={alternateLabel} variant="secondary" disabled={loading} onPress={onAlternate} /> : null}
            <View style={styles.actionRow}>
              <AppButton testID={cancelTestID} label={cancelLabel} variant="secondary" disabled={loading} onPress={onCancel} style={styles.action} />
              <AppButton testID={confirmTestID} label={confirmLabel} variant={destructive ? 'danger' : 'primary'} loading={loading} onPress={onConfirm} style={styles.action} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, padding: spacing.lg, backgroundColor: colors.modalOverlay, alignItems: 'center', justifyContent: 'center' },
  dialog: { ...shadows.floating, width: '100%', maxWidth: layout.dialogMaxWidth, padding: spacing.lg, borderRadius: radius.hero, backgroundColor: colors.neutral.surface, alignItems: 'center', gap: spacing.sm },
  icon: { width: layout.dialogIconSize, height: layout.dialogIconSize, borderRadius: radius.medium, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
  actions: { width: '100%', marginTop: spacing.xs, gap: spacing.xs },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  action: { flex: 1, minHeight: layout.minTouchTarget },
});
