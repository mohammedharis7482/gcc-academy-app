import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AttendanceHistory } from '@/components/coach/attendance-workflow';
import { AppScreen } from '@/components/common/app-screen';
import { SubpageHeader } from '@/components/profile/profile-shared';
import { useAttendanceData } from '@/contexts/attendance-context';

export default function CoachAttendanceHistoryScreen() {
  const router = useRouter();
  const attendance = useAttendanceData();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(coach)/(tabs)/attendance'); };
  const openSession = (sessionId: string) => router.replace({ pathname: '/(coach)/(tabs)/attendance', params: { sessionId } });
  return <AppScreen withTabBarClearance={false}><SubpageHeader title="Attendance History" subtitle="Saved squad sessions" onBack={back} /><View><AttendanceHistory records={attendance.records} sessions={attendance.sessions} onOpen={openSession} /></View></AppScreen>;
}
