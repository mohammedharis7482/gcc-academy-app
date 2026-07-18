import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { AdaptiveTabBar, AdaptiveTabDefinition } from '@/components/navigation/adaptive-tab-bar';

interface PlayerTabBarProps extends BottomTabBarProps { readonly unreadCount: number }
const playerTabs: readonly AdaptiveTabDefinition[] = [
  { name: 'index', label: 'Home', activeIcon: 'home', inactiveIcon: 'home-outline', pillWidth: 78 },
  { name: 'progress', label: 'Progress', activeIcon: 'chart-line', inactiveIcon: 'chart-line', pillWidth: 100 },
  { name: 'sessions', label: 'Sessions', activeIcon: 'play-box-multiple', inactiveIcon: 'play-box-multiple-outline', pillWidth: 100 },
  { name: 'updates', label: 'Updates', activeIcon: 'bullhorn', inactiveIcon: 'bullhorn-outline', pillWidth: 96 },
  { name: 'profile', label: 'Profile', activeIcon: 'account', inactiveIcon: 'account-outline', pillWidth: 88 },
];

export function PlayerTabBar(props: PlayerTabBarProps) {
  return <AdaptiveTabBar {...props} definitions={playerTabs} badgeCounts={{ updates: props.unreadCount }} testID="player-tab-bar" />;
}
