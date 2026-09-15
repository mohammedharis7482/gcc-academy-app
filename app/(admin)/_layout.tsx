import { Stack } from 'expo-router';

import { AdminDataProvider } from '@/contexts/admin-data-context';

export default function AdminLayout() {
  return <AdminDataProvider><Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(tabs)" /><Stack.Screen name="members/[memberId]" /><Stack.Screen name="members/new" /><Stack.Screen name="coaches/[coachId]" /><Stack.Screen name="coaches/new" /><Stack.Screen name="squads/index" /><Stack.Screen name="squads/[squadId]" /><Stack.Screen name="finance/[feeId]" /><Stack.Screen name="finance/money-in" /><Stack.Screen name="finance/money-out" /><Stack.Screen name="finance/salaries" /><Stack.Screen name="finance/new-expense" /><Stack.Screen name="finance/new-income" /><Stack.Screen name="announcement/new" /><Stack.Screen name="approvals" /><Stack.Screen name="reports" /><Stack.Screen name="support" /></Stack></AdminDataProvider>;
}
