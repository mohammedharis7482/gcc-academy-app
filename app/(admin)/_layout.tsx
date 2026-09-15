import { Stack } from 'expo-router';

import { AdminAuthLoadingScreen } from '@/components/admin/admin-states';
import { AdminDataProvider } from '@/contexts/admin-data-context';
import { AdminSessionProvider, useAdminSession } from '@/contexts/admin-session-context';

export default function AdminLayout() {
  return <AdminSessionProvider><AdminDataProvider><AdminNavigator /></AdminDataProvider></AdminSessionProvider>;
}

function AdminNavigator() {
  const { isAuthenticated, isRestoring } = useAdminSession();
  if (isRestoring) return <AdminAuthLoadingScreen />;
  return <Stack screenOptions={{ headerShown: false }}><Stack.Protected guard={isAuthenticated}><Stack.Screen name="(tabs)" /><Stack.Screen name="members/[memberId]" /><Stack.Screen name="members/new" /><Stack.Screen name="coaches/[coachId]" /><Stack.Screen name="coaches/new" /><Stack.Screen name="squads/index" /><Stack.Screen name="squads/[squadId]" /><Stack.Screen name="finance/[feeId]" /><Stack.Screen name="announcements/new" /><Stack.Screen name="approvals" /><Stack.Screen name="reports" /><Stack.Screen name="admin-support" /></Stack.Protected><Stack.Protected guard={!isAuthenticated}><Stack.Screen name="admin-sign-in" /></Stack.Protected></Stack>;
}
