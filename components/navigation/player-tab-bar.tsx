import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { ComponentProps, ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, layout, motion, radius, shadows } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;
type PlayerTabName = 'index' | 'progress' | 'learn' | 'updates' | 'profile';

interface PlayerTabDefinition {
  readonly label: string;
  readonly activeIcon: IconName;
  readonly inactiveIcon: IconName;
  readonly pillWidth: number;
}

interface PlayerTabBarProps extends BottomTabBarProps {
  readonly unreadCount: number;
}

const tabDefinitions = {
  index: { label: 'Home', activeIcon: 'home', inactiveIcon: 'home-outline', pillWidth: 78 },
  progress: { label: 'Progress', activeIcon: 'chart-line', inactiveIcon: 'chart-line', pillWidth: 100 },
  learn: { label: 'Learn', activeIcon: 'school', inactiveIcon: 'school-outline', pillWidth: 78 },
  updates: { label: 'Updates', activeIcon: 'bullhorn', inactiveIcon: 'bullhorn-outline', pillWidth: 96 },
  profile: { label: 'Profile', activeIcon: 'account', inactiveIcon: 'account-outline', pillWidth: 88 },
} as const satisfies Record<PlayerTabName, PlayerTabDefinition>;

const isPlayerTab = (name: string): name is PlayerTabName => name in tabDefinitions;

function getPillLeft(rowWidth: number, index: number, pillWidth: number) {
  const zoneWidth = rowWidth / 5;
  const centeredLeft = zoneWidth * index + (zoneWidth - pillWidth) / 2;
  return Math.max(layout.tabBarHorizontalPadding, Math.min(centeredLeft, rowWidth - pillWidth - layout.tabBarHorizontalPadding));
}

type AnimatedTabPressableProps = Omit<ComponentProps<typeof Pressable>, 'children'> & { readonly children: ReactNode };

function AnimatedTabPressable({ children, ...props }: AnimatedTabPressableProps) {
  const reducedMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (toValue: number) => Animated.timing(scale, { toValue, duration: motion.duration.press, easing: motion.easing.out, useNativeDriver: true }).start();

  return (
    <Pressable
      {...props}
      onPressIn={(event) => {
        if (Platform.OS === 'ios') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        animate(reducedMotion ? 0.995 : motion.scale.pressStrong);
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animate(1);
        props.onPressOut?.(event);
      }}>
      <Animated.View style={[styles.pressContent, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

function UnreadBadge({ label, focused }: { readonly label: string; readonly focused: boolean }) {
  const reducedMotion = useReducedMotion();
  const visibility = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  useEffect(() => {
    visibility.setValue(reducedMotion ? 1 : 0);
    Animated.timing(visibility, { toValue: 1, duration: reducedMotion ? motion.duration.instant : motion.duration.fast, easing: motion.easing.out, useNativeDriver: true }).start();
  }, [label, reducedMotion, visibility]);
  const scale = visibility.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  return <Animated.View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.badge, focused ? styles.badgeActive : styles.badgeInactive, { opacity: visibility, transform: [...(focused ? styles.badgeActive.transform : styles.badgeInactive.transform), { scale }] }]}><Text style={styles.badgeText}>{label}</Text></Animated.View>;
}

export function PlayerTabBar({ state, descriptors, navigation, insets, unreadCount }: PlayerTabBarProps) {
  const reducedMotion = useReducedMotion();
  const [rowWidth, setRowWidth] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const pillLeft = useRef(new Animated.Value(0)).current;
  const pillWidth = useRef(new Animated.Value(tabDefinitions.index.pillWidth)).current;
  const activeRoute = state.routes[state.index];
  const activeDefinition = isPlayerTab(activeRoute.name) ? tabDefinitions[activeRoute.name] : tabDefinitions.index;

  useEffect(() => {
    if (rowWidth === 0) return;
    pillLeft.stopAnimation();
    pillWidth.stopAnimation();
    Animated.parallel([
      Animated.timing(pillLeft, { toValue: getPillLeft(rowWidth, state.index, activeDefinition.pillWidth), duration: reducedMotion ? motion.duration.instant : motion.duration.fast, easing: motion.easing.out, useNativeDriver: false }),
      Animated.timing(pillWidth, { toValue: activeDefinition.pillWidth, duration: reducedMotion ? motion.duration.instant : motion.duration.fast, easing: motion.easing.out, useNativeDriver: false }),
    ]).start();
  }, [activeDefinition.pillWidth, pillLeft, pillWidth, reducedMotion, rowWidth, state.index]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (rowWidth === 0) {
      pillLeft.setValue(getPillLeft(width, state.index, activeDefinition.pillWidth));
      pillWidth.setValue(activeDefinition.pillWidth);
    }
    setRowWidth(width);
  };

  if (isKeyboardVisible) return null;

  return (
    <View nativeID="player-tab-bar" testID="player-tab-bar" style={[styles.bar, { height: layout.tabBarContentHeight + insets.bottom, paddingBottom: insets.bottom }]}>
      <View style={styles.row} onLayout={handleLayout}>
        {rowWidth > 0 ? (
          <Animated.View nativeID="active-tab-pill" testID="active-tab-pill" pointerEvents="none" style={[styles.activePill, { left: pillLeft, width: pillWidth }]}>
            <MaterialCommunityIcons name={activeDefinition.activeIcon} size={layout.tabBarActiveIconSize} color={colors.neutral.white} />
            <Text numberOfLines={1} maxFontSizeMultiplier={1.1} style={styles.activeLabel}>{activeDefinition.label}</Text>
          </Animated.View>
        ) : null}

        {state.routes.map((route, index) => {
          if (!isPlayerTab(route.name)) return null;
          const definition = tabDefinitions[route.name];
          const isFocused = state.index === index;
          const isUpdates = route.name === 'updates';
          const visibleUnreadCount = unreadCount > 9 ? '9+' : String(unreadCount);
          const accessibilityLabel = isUpdates && unreadCount > 0 ? `${definition.label} tab, ${unreadCount} unread` : `${definition.label} tab`;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };

          const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

          return (
            <AnimatedTabPressable
              key={route.key}
              testID={descriptors[route.key].options.tabBarButtonTestID}
              accessibilityRole="tab"
              accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel ?? accessibilityLabel}
              accessibilityState={{ selected: isFocused }}
              aria-selected={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabZone}>
              {!isFocused ? <MaterialCommunityIcons name={definition.inactiveIcon} size={layout.tabBarIconSize} color={colors.neutral.textMuted} /> : null}
              {isUpdates && unreadCount > 0 ? (
                <UnreadBadge label={visibleUnreadCount} focused={isFocused} />
              ) : null}
            </AnimatedTabPressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    ...shadows.tabBar,
    backgroundColor: colors.neutral.surface,
    borderTopColor: colors.neutral.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.tabBarHorizontalPadding,
  },
  activePill: {
    position: 'absolute',
    top: (layout.tabBarContentHeight - layout.tabBarPillHeight) / 2,
    height: layout.tabBarPillHeight,
    borderRadius: radius.pill,
    backgroundColor: colors.brand.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: layout.tabBarLabelGap,
  },
  activeLabel: {
    flexShrink: 1,
    fontFamily: fontFamilies.bold,
    fontSize: layout.tabBarLabelSize,
    lineHeight: 16,
    color: colors.neutral.white,
  },
  tabZone: {
    flex: 1,
    minWidth: 0,
    height: layout.tabBarContentHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.brand.blue,
    borderWidth: 2,
    borderColor: colors.neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInactive: { top: 11, left: '50%', transform: [{ translateX: 5 }] },
  badgeActive: { top: 7, left: '50%', transform: [{ translateX: 28 }] },
  badgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    lineHeight: 11,
    color: colors.neutral.white,
  },
});
