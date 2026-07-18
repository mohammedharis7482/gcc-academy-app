import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppText } from '@/components/common/app-text';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export interface AppBottomSheetOption {
  readonly id: string;
  readonly label: string;
  readonly supportingText?: string;
  readonly icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  readonly disabled?: boolean;
}

interface AppBottomSheetProps {
  readonly visible: boolean;
  readonly title: string;
  readonly description?: string;
  readonly options: readonly AppBottomSheetOption[];
  readonly selectedIds: readonly string[];
  readonly multiple?: boolean;
  readonly loading?: boolean;
  readonly onSelect: (id: string) => void;
  readonly onClose: () => void;
}

export function AppBottomSheet({ visible, title, description, options, selectedIds, multiple = false, loading = false, onSelect, onClose }: AppBottomSheetProps) {
  const reducedMotion = useReducedMotion();
  const close = () => { if (!loading) onClose(); };
  return (
    <Modal visible={visible} transparent animationType={reducedMotion ? 'none' : 'slide'} presentationStyle="overFullScreen" statusBarTranslucent onRequestClose={close}>
      <View style={styles.overlay}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Close ${title}`} disabled={loading} onPress={close} style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['bottom']} style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.copy}>
              <AppText variant="title" weight="extraBold">{title}</AppText>
              {description ? <AppText variant="bodySmall" color={colors.neutral.textSecondary}>{description}</AppText> : null}
            </View>
            <AnimatedPressable accessibilityRole="button" accessibilityLabel={`Close ${title}`} disabled={loading} onPress={close} style={styles.close}>
              <MaterialCommunityIcons name="close" size={22} color={colors.brand.navy} />
            </AnimatedPressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.options}>
            {options.map((option) => {
              const selected = selectedIds.includes(option.id);
              return (
                <AnimatedPressable
                  key={option.id}
                  accessibilityRole={multiple ? 'checkbox' : 'radio'}
                  accessibilityLabel={option.supportingText ? `${option.label}. ${option.supportingText}` : option.label}
                  accessibilityState={{ checked: selected, selected, disabled: option.disabled || loading }}
                  disabled={option.disabled || loading}
                  onPress={() => onSelect(option.id)}
                  style={[styles.option, selected && styles.optionSelected, option.disabled && styles.disabled]}
                >
                  {option.icon ? <View style={[styles.icon, selected && styles.iconSelected]}><MaterialCommunityIcons name={option.icon} size={20} color={selected ? colors.neutral.white : colors.brand.blue} /></View> : null}
                  <View style={styles.copy}>
                    <AppText variant="bodySmall" weight="extraBold">{option.label}</AppText>
                    {option.supportingText ? <AppText variant="caption" color={colors.neutral.textSecondary}>{option.supportingText}</AppText> : null}
                  </View>
                  <MaterialCommunityIcons name={selected ? 'check-circle' : 'circle-outline'} size={23} color={selected ? colors.brand.blue : colors.neutral.textMuted} />
                </AnimatedPressable>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.modalOverlay },
  sheet: { ...shadows.floating, width: '100%', maxHeight: '78%', borderTopLeftRadius: radius.hero, borderTopRightRadius: radius.hero, backgroundColor: colors.neutral.surface },
  handle: { width: 42, height: 4, marginTop: spacing.xs, marginBottom: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.neutral.borderStrong, alignSelf: 'center' },
  header: { paddingHorizontal: layout.pageHorizontal, paddingBottom: spacing.sm, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  copy: { flex: 1, minWidth: 0, gap: 2 },
  close: { width: layout.minTouchTarget, height: layout.minTouchTarget, marginTop: -spacing.xs, marginRight: -spacing.xs, borderRadius: radius.pill, backgroundColor: colors.neutral.backgroundRaised, alignItems: 'center', justifyContent: 'center' },
  options: { paddingHorizontal: layout.pageHorizontal, paddingBottom: spacing.lg, gap: spacing.xs },
  option: { minHeight: layout.selectRowMinHeight, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.neutral.border, borderRadius: radius.medium, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  optionSelected: { borderColor: colors.brand.blue, backgroundColor: colors.brand.blueSoft },
  icon: { width: layout.compactIconSize, height: layout.compactIconSize, borderRadius: radius.small, backgroundColor: colors.brand.blueSoft, alignItems: 'center', justifyContent: 'center' },
  iconSelected: { backgroundColor: colors.brand.blue },
  disabled: { opacity: 0.42 },
});
