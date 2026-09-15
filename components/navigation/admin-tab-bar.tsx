import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { AdaptiveTabBar, AdaptiveTabBarMetrics, AdaptiveTabDefinition } from '@/components/navigation/adaptive-tab-bar';
import { adminTabBarMetrics } from '@/design/tokens/admin';

const adminTabs: readonly AdaptiveTabDefinition[] = [
  { name: 'index', label: 'Overview', activeIcon: 'chart-box', inactiveIcon: 'chart-box-outline', pillWidth: adminTabBarMetrics.activePillWidths.index },
  { name: 'members', label: 'Members', activeIcon: 'account-multiple', inactiveIcon: 'account-multiple-outline', pillWidth: adminTabBarMetrics.activePillWidths.members },
  { name: 'coaches', label: 'Coaches', activeIcon: 'whistle', inactiveIcon: 'whistle-outline', pillWidth: adminTabBarMetrics.activePillWidths.coaches },
  { name: 'finance', label: 'Finance', activeIcon: 'cash-multiple', inactiveIcon: 'cash-multiple', pillWidth: adminTabBarMetrics.activePillWidths.finance },
  { name: 'settings', label: 'Settings', activeIcon: 'cog', inactiveIcon: 'cog-outline', pillWidth: adminTabBarMetrics.activePillWidths.settings },
];

const adminAdaptiveMetrics: AdaptiveTabBarMetrics = {
  height: adminTabBarMetrics.height,
  horizontalInset: adminTabBarMetrics.horizontalInset,
  activePillHeight: adminTabBarMetrics.activePillHeight,
  pillReferenceContentWidth: adminTabBarMetrics.pillReferenceContentWidth,
  minimumPillWidth: adminTabBarMetrics.minimumPillWidth,
  inactiveIconGap: adminTabBarMetrics.inactiveIconGap,
};

export function AdminTabBar(props: BottomTabBarProps) {
  return <AdaptiveTabBar {...props} definitions={adminTabs} metrics={adminAdaptiveMetrics} testID="admin-tab-bar" />;
}
