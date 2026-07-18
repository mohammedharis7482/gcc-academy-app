import { Stack } from 'expo-router';

export default function CoachLayout() {
  return <Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(tabs)" /><Stack.Screen name="players/[playerId]" /><Stack.Screen name="players/[playerId]/action/[action]" /><Stack.Screen name="attendance/history" /><Stack.Screen name="feedback/index" /><Stack.Screen name="feedback/history" /><Stack.Screen name="feedback/[assessmentId]" /><Stack.Screen name="sessions/[sessionId]" /><Stack.Screen name="schedule/new" /><Stack.Screen name="schedule/[scheduleId]" /><Stack.Screen name="announcement/new" /><Stack.Screen name="session-assignment/new" /><Stack.Screen name="update" /><Stack.Screen name="support" /></Stack>;
}
