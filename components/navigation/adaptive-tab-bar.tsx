import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { ComponentProps, ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, layout, motion, radius, shadows, typography } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export type TabIconName = keyof typeof MaterialCommunityIcons.glyphMap;
export interface AdaptiveTabDefinition { readonly name: string; readonly label: string; readonly activeIcon: TabIconName; readonly inactiveIcon: TabIconName; readonly pillWidth: number }
export interface AdaptiveTabBarMetrics {
  readonly height: number;
  readonly horizontalInset: number;
  readonly activePillHeight: number;
  readonly pillReferenceContentWidth?: number;
  readonly minimumPillWidth?: number;
  readonly inactiveIconGap?: number;
}
interface AdaptiveTabBarProps extends BottomTabBarProps { readonly definitions: readonly AdaptiveTabDefinition[]; readonly badgeCounts?: Readonly<Record<string, number>>; readonly testID: string; readonly onBeforeNavigate?: (routeName: string, proceed: () => void) => void; readonly metrics?: AdaptiveTabBarMetrics }

const defaultMetrics: AdaptiveTabBarMetrics = { height: layout.tabBarContentHeight, horizontalInset: layout.tabBarHorizontalPadding, activePillHeight: layout.tabBarPillHeight };
interface PillGeometry { readonly left: number; readonly width: number }
function getPillGeometry(rowWidth: number, index: number, desiredWidth: number, count: number, metrics: AdaptiveTabBarMetrics): PillGeometry {
  const contentWidth = Math.max(0, rowWidth - metrics.horizontalInset * 2);
  const scale = metrics.pillReferenceContentWidth ? Math.min(1, contentWidth / metrics.pillReferenceContentWidth) : 1;
  const scaledWidth = desiredWidth * scale;
  const width = Math.min(contentWidth, Math.max(metrics.minimumPillWidth ?? 0, scaledWidth));
  const zoneWidth = contentWidth / count;
  const tabCenter = metrics.horizontalInset + zoneWidth * (index + 0.5);
  const centeredLeft = tabCenter - width / 2;
  const left = Math.max(metrics.horizontalInset, Math.min(centeredLeft, rowWidth - width - metrics.horizontalInset));
  return { left, width };
}

function getInactiveOffset(rowWidth: number, index: number, activeIndex: number, count: number, geometry: PillGeometry, metrics: AdaptiveTabBarMetrics) {
  if (index === activeIndex) return 0;
  const contentWidth = Math.max(0, rowWidth - metrics.horizontalInset * 2);
  const zoneWidth = contentWidth / count;
  const iconCenter = metrics.horizontalInset + zoneWidth * (index + 0.5);
  const iconRadius = layout.tabBarIconSize / 2;
  const gap = metrics.inactiveIconGap ?? 0;
  if (index < activeIndex && iconCenter + iconRadius > geometry.left - gap) return geometry.left - gap - iconCenter - iconRadius;
  const pillRight = geometry.left + geometry.width;
  if (index > activeIndex && iconCenter - iconRadius < pillRight + gap) return pillRight + gap - iconCenter + iconRadius;
  return 0;
}

type AnimatedTabPressableProps = Omit<ComponentProps<typeof Pressable>, 'children'> & { readonly children: ReactNode };
function AnimatedTabPressable({ children, ...props }: AnimatedTabPressableProps) {
  const reducedMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (toValue: number) => Animated.timing(scale, { toValue, duration: motion.duration.press, easing: motion.easing.out, useNativeDriver: true }).start();
  return <Pressable {...props} onPressIn={(event) => { if (Platform.OS === 'ios') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); animate(reducedMotion ? 0.995 : motion.scale.pressStrong); props.onPressIn?.(event); }} onPressOut={(event) => { animate(1); props.onPressOut?.(event); }}><Animated.View style={[styles.pressContent, { transform: [{ scale }] }]}>{children}</Animated.View></Pressable>;
}

function TabBadge({ label, focused }: { readonly label: string; readonly focused: boolean }) {
  const reducedMotion = useReducedMotion();
  const visibility = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  useEffect(() => { visibility.setValue(reducedMotion ? 1 : 0); Animated.timing(visibility, { toValue: 1, duration: reducedMotion ? motion.duration.instant : motion.duration.fast, easing: motion.easing.out, useNativeDriver: true }).start(); }, [label, reducedMotion, visibility]);
  const scale = visibility.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  return <Animated.View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.badge, focused ? styles.badgeActive : styles.badgeInactive, { opacity: visibility, transform: [...(focused ? styles.badgeActive.transform : styles.badgeInactive.transform), { scale }] }]}><Text style={styles.badgeText}>{label}</Text></Animated.View>;
}

export function AdaptiveTabBar({ state, descriptors, navigation, insets, definitions, badgeCounts = {}, testID, onBeforeNavigate, metrics = defaultMetrics }: AdaptiveTabBarProps) {
  const reducedMotion = useReducedMotion();
  const [rowWidth, setRowWidth] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const activeDefinition = definitions.find((item) => item.name === state.routes[state.index]?.name) ?? definitions[0];
  const activeIndex = Math.max(0, definitions.findIndex((item) => item.name === state.routes[state.index]?.name));
  const activeGeometry = getPillGeometry(rowWidth, activeIndex, activeDefinition.pillWidth, definitions.length, metrics);
  const pillLeft = useRef(new Animated.Value(0)).current;
  const pillWidth = useRef(new Animated.Value(activeDefinition.pillWidth)).current;

  useEffect(() => {
    if (rowWidth === 0) return;
    Animated.parallel([
      Animated.timing(pillLeft, { toValue: activeGeometry.left, duration: reducedMotion ? motion.duration.instant : motion.duration.fast, easing: motion.easing.out, useNativeDriver: false }),
      Animated.timing(pillWidth, { toValue: activeGeometry.width, duration: reducedMotion ? motion.duration.instant : motion.duration.fast, easing: motion.easing.out, useNativeDriver: false }),
    ]).start();
  }, [activeDefinition.pillWidth, activeGeometry.left, activeGeometry.width, definitions, pillLeft, pillWidth, reducedMotion, rowWidth, state.index, state.routes]);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (rowWidth === 0) {
      const geometry = getPillGeometry(width, activeIndex, activeDefinition.pillWidth, definitions.length, metrics);
      pillLeft.setValue(geometry.left);
      pillWidth.setValue(geometry.width);
    }
    setRowWidth(width);
  };

  if (isKeyboardVisible) return null;
  return <View nativeID={testID} testID={testID} style={[styles.bar, { height: metrics.height + insets.bottom, paddingBottom: insets.bottom }]}><View style={[styles.row, { paddingHorizontal: metrics.horizontalInset }]} onLayout={handleLayout}>{rowWidth > 0 ? <Animated.View pointerEvents="none" style={[styles.activePill, { top: (metrics.height - metrics.activePillHeight) / 2, height: metrics.activePillHeight, left: pillLeft, width: pillWidth }]}><MaterialCommunityIcons name={activeDefinition.activeIcon} size={layout.tabBarActiveIconSize} color={colors.neutral.white} /><Text numberOfLines={1} maxFontSizeMultiplier={1.1} style={styles.activeLabel}>{activeDefinition.label}</Text></Animated.View> : null}{state.routes.map((route, index) => {
    const definition = definitions.find((item) => item.name === route.name);
    if (!definition) return null;
    const isFocused = state.routes[state.index]?.key === route.key;
    const badgeCount = badgeCounts[route.name] ?? 0;
    const badgeLabel = badgeCount > 9 ? '9+' : String(badgeCount);
    const accessibilityLabel = badgeCount > 0 ? `${definition.label} tab, ${badgeCount} unread` : `${definition.label} tab`;
    const onPress = () => { const proceed = () => { const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true }); if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params); }; if (!isFocused && onBeforeNavigate) onBeforeNavigate(route.name, proceed); else proceed(); };
    const inactiveOffset = rowWidth ? getInactiveOffset(rowWidth, index, activeIndex, definitions.length, activeGeometry, metrics) : 0;
    return <AnimatedTabPressable key={route.key} testID={descriptors[route.key].options.tabBarButtonTestID} accessibilityRole="tab" accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel ?? accessibilityLabel} accessibilityState={{ selected: isFocused }} aria-selected={isFocused} onPress={onPress} onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })} style={[styles.tabZone, { height: metrics.height }]}>{!isFocused ? <View style={[styles.inactiveContent, { transform: [{ translateX: inactiveOffset }] }]}><MaterialCommunityIcons name={definition.inactiveIcon} size={layout.tabBarIconSize} color={colors.neutral.textMuted} />{badgeCount > 0 ? <TabBadge label={badgeLabel} focused={false} /> : null}</View> : badgeCount > 0 ? <TabBadge label={badgeLabel} focused /> : null}</AnimatedTabPressable>;
  })}</View></View>;
}

const styles = StyleSheet.create({
  bar: { ...shadows.tabBar, backgroundColor: colors.neutral.surface, borderTopColor: colors.neutral.divider, borderTopWidth: StyleSheet.hairlineWidth },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  activePill: { position: 'absolute', borderRadius: radius.pill, backgroundColor: colors.brand.navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: layout.tabBarLabelGap },
  activeLabel: { flexShrink: 1, fontFamily: fontFamilies.bold, ...typography.tabLabel, color: colors.neutral.white },
  tabZone: { flex: 1, minWidth: 0, height: layout.tabBarContentHeight, alignItems: 'center', justifyContent: 'center' },
  pressContent: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  inactiveContent: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', minWidth: 19, height: 19, paddingHorizontal: 4, borderRadius: radius.pill, backgroundColor: colors.brand.blue, borderWidth: 2, borderColor: colors.neutral.surface, alignItems: 'center', justifyContent: 'center' },
  badgeInactive: { top: 11, left: '50%', transform: [{ translateX: 5 }] }, badgeActive: { top: 7, left: '50%', transform: [{ translateX: 28 }] },
  badgeText: { fontFamily: fontFamilies.bold, ...typography.badge, color: colors.neutral.white },
});
