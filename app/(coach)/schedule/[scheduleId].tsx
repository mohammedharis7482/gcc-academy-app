import { useLocalSearchParams } from 'expo-router';
import { ScheduleEditorScreen } from '@/components/coach/schedule-editor-screen';

export default function EditScheduleRoute() { const params = useLocalSearchParams<{ scheduleId?: string | string[] }>(); const scheduleId = Array.isArray(params.scheduleId) ? params.scheduleId[0] : params.scheduleId; return <ScheduleEditorScreen scheduleId={scheduleId} />; }
