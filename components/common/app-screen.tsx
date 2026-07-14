import { ReactNode } from 'react';
import { usePathname } from 'expo-router';
import { ScrollView, ScrollViewProps, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout } from '@/design/tokens';

interface AppScreenProps extends ScrollViewProps {
  children: ReactNode;
  scrollable?: boolean;
  withTabBarClearance?: boolean;
}

const tabPaths = new Set(['/', '/progress', '/learn', '/updates', '/profile']);

export function AppScreen({ children, scrollable = true, withTabBarClearance, contentContainerStyle, ...props }: AppScreenProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const reserveTabBar = withTabBarClearance ?? tabPaths.has(pathname);
  const horizontalPadding = width <= 360 ? layout.compactScreenPadding : layout.pageHorizontal;
  const content = <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>{children}</View>;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {scrollable ? (
        <ScrollView {...props} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: (reserveTabBar ? layout.tabBarContentHeight : 0) + insets.bottom + layout.tabClearance }, contentContainerStyle]}>
          {content}
        </ScrollView>
      ) : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.neutral.background },
  scrollContent: {},
  content: { width: '100%', maxWidth: layout.contentMaxWidth, alignSelf: 'center', flexGrow: 1 },
});
