import { Tabs } from 'expo-router';

import { PlayerTabBar } from '@/components/navigation/player-tab-bar';
import { useUpdates } from '@/contexts/updates-context';

export default function TabLayout() {
  const { unreadCount } = useUpdates();
  return <Tabs initialRouteName="index" tabBar={(props) => <PlayerTabBar {...props} unreadCount={unreadCount} />} screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}>
    <Tabs.Screen name="index" options={{ title: 'Home', tabBarAccessibilityLabel: 'Home tab' }} />
    <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarAccessibilityLabel: 'Progress tab' }} />
    <Tabs.Screen name="sessions" options={{ title: 'Sessions', tabBarAccessibilityLabel: 'Sessions tab' }} />
    <Tabs.Screen name="updates" options={{ title: 'Updates', tabBarAccessibilityLabel: unreadCount > 0 ? `Updates tab, ${unreadCount} unread` : 'Updates tab' }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarAccessibilityLabel: 'Profile tab' }} />
  </Tabs>;
}
