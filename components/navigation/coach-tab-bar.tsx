import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRef, useState } from 'react';

import { AppConfirmationDialog } from '@/components/common/app-confirmation-dialog';
import { AdaptiveTabBar, AdaptiveTabBarMetrics, AdaptiveTabDefinition } from '@/components/navigation/adaptive-tab-bar';
import { useAttendanceDraft } from '@/contexts/attendance-context';
import { coachTabBarMetrics } from '@/design/tokens';

const coachTabs: readonly AdaptiveTabDefinition[] = [
  { name: 'index', label: 'Dashboard', activeIcon: 'view-dashboard', inactiveIcon: 'view-dashboard-outline', pillWidth: coachTabBarMetrics.activePillWidths.index },
  { name: 'players', label: 'Players', activeIcon: 'account-group', inactiveIcon: 'account-group-outline', pillWidth: coachTabBarMetrics.activePillWidths.players },
  { name: 'attendance', label: 'Attendance', activeIcon: 'clipboard-check', inactiveIcon: 'clipboard-check-outline', pillWidth: coachTabBarMetrics.activePillWidths.attendance },
  { name: 'schedule', label: 'Schedule', activeIcon: 'calendar-clock', inactiveIcon: 'calendar-clock-outline', pillWidth: coachTabBarMetrics.activePillWidths.training },
  { name: 'profile', label: 'Profile', activeIcon: 'account', inactiveIcon: 'account-outline', pillWidth: coachTabBarMetrics.activePillWidths.profile },
];
const coachAdaptiveMetrics: AdaptiveTabBarMetrics = {
  height: coachTabBarMetrics.height,
  horizontalInset: coachTabBarMetrics.horizontalInset,
  activePillHeight: coachTabBarMetrics.activePillHeight,
  pillReferenceContentWidth: coachTabBarMetrics.pillReferenceContentWidth,
  minimumPillWidth: coachTabBarMetrics.minimumPillWidth,
  inactiveIconGap: coachTabBarMetrics.inactiveIconGap,
};

export function CoachTabBar(props: BottomTabBarProps) {
  const { hasUnsavedChanges, discardDraft, saveDraft, isSaving } = useAttendanceDraft();
  const [confirmLeave, setConfirmLeave] = useState(false); const pendingNavigationRef = useRef<(() => void) | null>(null);
  const activeRoute = props.state.routes[props.state.index]?.name;
  const beforeNavigate = (routeName: string, proceed: () => void) => {
    if (activeRoute !== 'attendance' || routeName === 'attendance' || !hasUnsavedChanges) { proceed(); return; }
    pendingNavigationRef.current = proceed; setConfirmLeave(true);
  };
  const close = () => { if (!isSaving) { pendingNavigationRef.current = null; setConfirmLeave(false); } };
  const discardAndNavigate = () => { const proceed = pendingNavigationRef.current; pendingNavigationRef.current = null; setConfirmLeave(false); discardDraft(); proceed?.(); };
  const saveAndNavigate = async () => { const proceed = pendingNavigationRef.current; const record = await saveDraft(); if (!record) return; pendingNavigationRef.current = null; setConfirmLeave(false); proceed?.(); };
  return <><AdaptiveTabBar {...props} definitions={coachTabs} metrics={coachAdaptiveMetrics} testID="coach-tab-bar" onBeforeNavigate={beforeNavigate} /><AppConfirmationDialog visible={confirmLeave} icon="content-save-alert-outline" title="Unsaved attendance" description="You have attendance changes that have not been saved." cancelLabel="Continue Editing" confirmLabel="Discard Changes" alternateLabel="Save Attendance" destructive loading={isSaving} onCancel={close} onConfirm={discardAndNavigate} onAlternate={() => { void saveAndNavigate(); }} /></>;
}
