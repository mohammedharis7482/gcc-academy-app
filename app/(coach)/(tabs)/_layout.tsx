import { Tabs } from 'expo-router';

import { CoachTabBar } from '@/components/navigation/coach-tab-bar';

export default function CoachTabsLayout() {
  return <Tabs initialRouteName="index" tabBar={(props) => <CoachTabBar {...props} />} screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}><Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarAccessibilityLabel: 'Coach Dashboard tab' }} /><Tabs.Screen name="players" options={{ title: 'Players', tabBarAccessibilityLabel: 'Coach Players tab' }} /><Tabs.Screen name="attendance" options={{ title: 'Attendance', tabBarAccessibilityLabel: 'Coach Attendance tab' }} /><Tabs.Screen name="schedule" options={{ title: 'Schedule', tabBarAccessibilityLabel: 'Coach Schedule tab' }} /><Tabs.Screen name="training" options={{ href: null }} /><Tabs.Screen name="profile" options={{ title: 'Profile', tabBarAccessibilityLabel: 'Coach Profile tab' }} /></Tabs>;
}
