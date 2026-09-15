import { Tabs } from 'expo-router';

import { AdminTabBar } from '@/components/navigation/admin-tab-bar';

export default function AdminTabsLayout() {
  return <Tabs initialRouteName="index" tabBar={(props) => <AdminTabBar {...props} />} screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true, freezeOnBlur: true }}><Tabs.Screen name="index" options={{ title: 'Overview', tabBarAccessibilityLabel: 'Admin Overview tab' }} /><Tabs.Screen name="members" options={{ title: 'Members', tabBarAccessibilityLabel: 'Admin Members tab' }} /><Tabs.Screen name="coaches" options={{ title: 'Coaches', tabBarAccessibilityLabel: 'Admin Coaches tab' }} /><Tabs.Screen name="finance" options={{ title: 'Finance', tabBarAccessibilityLabel: 'Admin Finance tab' }} /><Tabs.Screen name="settings" options={{ title: 'Settings', tabBarAccessibilityLabel: 'Admin Settings tab' }} /></Tabs>;
}
