import { layout } from './layout';

/**
 * Admin module spacing mirrors the Player and Coach modules so the three role
 * experiences stay visually identical. Values are derived from the shared
 * layout tokens rather than redeclared, so a change to the base scale flows
 * through every role.
 */
export const adminLayout = {
  pageHorizontal: layout.pageHorizontal,
  pageTop: layout.pageTop,
  headerToFirstSection: layout.headerToFirstSection,
  sectionGap: layout.sectionGap,
  sectionHeaderToCard: layout.sectionHeaderToCard,
  cardGap: layout.cardGap,
  cardPadding: layout.cardPadding,
  largeCardPadding: layout.largeCardPadding,
  compactRowPaddingVertical: layout.compactRowPaddingVertical,
  compactRowPaddingHorizontal: layout.compactRowPaddingHorizontal,
  actionGridGap: layout.cardGap,
  metricGridGap: layout.cardGap,
  metricCardMinHeight: 92,
  heroMinHeight: 216,
} as const;

export const adminTabBarMetrics = {
  height: 64,
  horizontalInset: 12,
  bottomInset: 10,
  activePillHeight: 44,
  activePillWidths: {
    overview: 122,
    members: 110,
    coaches: 110,
    finance: 104,
    settings: 108,
  },
  pillReferenceContentWidth: 416,
  minimumPillWidth: 92,
  inactiveIconGap: 6,
  contentClearance: 20,
  stickyActionHeight: 68,
  stickyContentClearance: 24,
} as const;
