import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/app-text';
import { colors, layout, motion, radius, shadows, spacing } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface ToastMessage {
  readonly id: number;
  readonly title: string;
  readonly message?: string;
  readonly duration: number;
}

interface ToastContextValue {
  readonly showSuccess: (title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);
  const showSuccess = useCallback((title: string, message?: string, duration = 2200) => {
    if (timer.current) clearTimeout(timer.current);
    nextId.current += 1;
    setToast({ id: nextId.current, title, message, duration });
    void AccessibilityInfo.announceForAccessibility(`${title}${message ? `. ${message}` : ''}`);
  }, []);
  const dismiss = useCallback(() => setToast(null), []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!toast) return;
    timer.current = setTimeout(dismiss, toast.duration);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [dismiss, toast]);

  const value = useMemo(() => ({ showSuccess }), [showSuccess]);
  return <ToastContext.Provider value={value}><View style={styles.host}>{children}<SuccessToast toast={toast} /></View></ToastContext.Provider>;
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used inside ToastProvider');
  return value;
}

function SuccessToast({ toast }: { readonly toast: ToastMessage | null }) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    opacity.stopAnimation();
    translateY.stopAnimation();
    if (!toast) { opacity.setValue(0); return; }
    opacity.setValue(0);
    translateY.setValue(reducedMotion ? 0 : -8);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: reducedMotion ? motion.duration.instant : motion.duration.fast, easing: motion.easing.out, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: reducedMotion ? motion.duration.instant : motion.duration.fast, easing: motion.easing.out, useNativeDriver: true }),
    ]).start();
  }, [opacity, reducedMotion, toast, translateY]);

  if (!toast) return null;
  return <Animated.View accessibilityRole="alert" accessibilityLiveRegion="polite" accessibilityLabel={`${toast.title}${toast.message ? `. ${toast.message}` : ''}`} pointerEvents="none" style={[styles.toast, { top: insets.top + spacing.xs, opacity, transform: [{ translateY }] }]}><View style={styles.icon}><MaterialCommunityIcons name="check" size={20} color={colors.neutral.white} /></View><View style={styles.copy}><AppText variant="bodySmall" weight="extraBold" color={colors.neutral.white}>{toast.title}</AppText>{toast.message ? <AppText variant="caption" color={colors.status.successSoft} numberOfLines={2}>{toast.message}</AppText> : null}</View></Animated.View>;
}

const styles = StyleSheet.create({
  host: { flex: 1 },
  toast: { ...shadows.floating, position: 'absolute', zIndex: 1000, left: layout.pageHorizontal, right: layout.pageHorizontal, maxWidth: layout.contentMaxWidth, alignSelf: 'center', minHeight: 58, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.medium, backgroundColor: colors.brand.navy, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { width: layout.compactIconSize, height: layout.compactIconSize, flexShrink: 0, borderRadius: radius.pill, backgroundColor: colors.status.success, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: 1 },
});
