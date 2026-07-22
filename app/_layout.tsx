import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold, useFonts } from '@expo-google-fonts/manrope';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { AuthLoadingScreen } from '@/components/common/auth-loading-screen';
import { OfflineBanner } from '@/components/common/offline-banner';
import { RootErrorBoundary } from '@/components/common/root-error-boundary';
import { ToastProvider } from '@/components/states/success-toast';
import { colors } from '@/design/tokens';
import { AcademyDataProvider } from '@/contexts/academy-data-context';
import { AttendanceProvider } from '@/contexts/attendance-context';
import { AssessmentProvider } from '@/contexts/assessment-context';
import { LearningProvider } from '@/contexts/learning-context';
import { ProfileProvider, useProfile } from '@/contexts/profile-context';
import { UpdatesProvider } from '@/contexts/updates-context';
import { TrainingPlanProvider } from '@/contexts/training-plan-context';
import { AcademyOperationsProvider } from '@/contexts/academy-operations-context';

void SplashScreen.preventAutoHideAsync();

const navigationTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: colors.brand.blue, background: colors.neutral.background, card: colors.neutral.surface, text: colors.neutral.text, border: colors.neutral.border } };

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold });
  useEffect(() => { if (fontsLoaded || fontError) void SplashScreen.hideAsync(); }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError) return null;
  return <RootErrorBoundary><ThemeProvider value={navigationTheme}><ToastProvider><AcademyDataProvider><AttendanceProvider><ProfileProvider><LearningProvider><UpdatesProvider><AcademyOperationsProvider><AssessmentProvider><TrainingPlanProvider><View style={styles.app}><OfflineBanner /><AppNavigator /></View></TrainingPlanProvider></AssessmentProvider></AcademyOperationsProvider></UpdatesProvider></LearningProvider></ProfileProvider></AttendanceProvider></AcademyDataProvider><AppStatusBar /></ToastProvider></ThemeProvider></RootErrorBoundary>;
}

function AppStatusBar() {
  const pathname = usePathname();
  const useLightContent = Platform.OS === 'ios' && pathname === '/sign-in';
  return <StatusBar style={useLightContent ? 'light' : 'dark'} backgroundColor={colors.neutral.background} />;
}

function AppNavigator() {
  const { session, isAuthenticated, isAuthLoading } = useProfile();
  if (isAuthLoading) return <AuthLoadingScreen />;
  const isPlayer = session?.role === 'player';
  const isCoach = session?.role === 'coach';
  return <Stack screenOptions={{ headerShown: false }}><Stack.Protected guard={isPlayer}><Stack.Screen name="(tabs)" /><Stack.Screen name="training/schedule" /><Stack.Screen name="progress/attendance" /><Stack.Screen name="progress/assessment/[assessmentId]" /><Stack.Screen name="progress/feedback/[feedbackId]" /><Stack.Screen name="sessions/[sessionId]" /><Stack.Screen name="updates/[updateId]" /><Stack.Screen name="profile/fees" /><Stack.Screen name="profile/settings" /><Stack.Screen name="profile/notifications" /><Stack.Screen name="profile/support" /><Stack.Screen name="profile/about" /><Stack.Screen name="profile/privacy" /><Stack.Screen name="profile/terms" /></Stack.Protected><Stack.Protected guard={isCoach}><Stack.Screen name="(coach)" /></Stack.Protected><Stack.Protected guard={!isAuthenticated}><Stack.Screen name="(auth)" /></Stack.Protected></Stack>;
}

const styles = StyleSheet.create({ app: { flex: 1, backgroundColor: colors.neutral.background } });
