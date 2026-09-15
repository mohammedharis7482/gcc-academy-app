import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useProfile } from '@/contexts/profile-context';
import { useUpdates } from '@/contexts/updates-context';
import { adminService } from '@/services/admin-service';
import { AdminAnnouncementAudience, AdminAnnouncementRecord } from '@/types/admin';
import { AcademyCommunicationUpdate } from '@/types/updates';

interface AdminAnnouncementsContextValue {
  readonly announcements: readonly AdminAnnouncementRecord[];
  /** Re-reads stored announcements. Called by the Admin module after publishing one. */
  refresh: () => void;
}

const AdminAnnouncementsContext = createContext<AdminAnnouncementsContextValue | undefined>(undefined);

const audienceLabels: Readonly<Record<AdminAnnouncementAudience, string>> = {
  'all-players': 'All academy players',
  'selected-categories': 'Selected squads',
  coaches: 'Coaching staff',
};

/**
 * Turns stored Admin announcements into Player Updates entries.
 *
 * `coaches` announcements never reach a player. `all-players` reaches everyone,
 * and `selected-categories` reaches only players whose own category is targeted.
 */
function adminAnnouncementUpdates(announcements: readonly AdminAnnouncementRecord[], playerCategoryIds: readonly string[]): readonly AcademyCommunicationUpdate[] {
  return announcements
    .filter((announcement) => {
      if (announcement.audience === 'coaches') return false;
      if (announcement.audience === 'all-players') return true;
      return announcement.categoryIds.some((categoryId) => playerCategoryIds.includes(categoryId));
    })
    .map<AcademyCommunicationUpdate>((announcement) => ({
      id: `admin-announcement-update-${announcement.id}`,
      category: announcement.category ?? 'General Notice',
      priority: announcement.priority,
      title: announcement.title,
      preview: announcement.message,
      message: announcement.message,
      publishedAt: announcement.publishedAt,
      relativeTime: 'Just now',
      dateGroup: 'Today',
      senderName: announcement.publishedBy,
      senderRole: 'Academy Admin',
      audienceLabel: audienceLabels[announcement.audience],
      actionType: 'none',
      metadata: { audience: audienceLabels[announcement.audience] },
      initiallyRead: false,
    }));
}

/**
 * Bridges Admin announcements into the shared Player Updates feed.
 *
 * This sits in the root layout rather than inside `(admin)` because the Admin
 * route group is unmounted while a player is signed in, and the player is the
 * audience. It mirrors `AcademyOperationsProvider`, which carries Coach
 * announcements the same way.
 */
export function AdminAnnouncementsProvider({ children }: { readonly children: ReactNode }) {
  const { syncAdminAnnouncementUpdates } = useUpdates();
  const { session } = useProfile();
  const [announcements, setAnnouncements] = useState<readonly AdminAnnouncementRecord[]>([]);
  const [reloadToken, setReloadToken] = useState(0);

  const sessionKey = session ? `${session.role}:${session.userId}` : 'signed-out';
  const playerCategoryIds = useMemo(() => session?.categoryIds ?? [], [session?.categoryIds]);

  // Re-read on mount, whenever the signed-in account changes, and on refresh().
  useEffect(() => {
    let active = true;
    void adminService.loadOperations().then((result) => { if (active) setAnnouncements(result.payload.announcements); });
    return () => { active = false; };
  }, [reloadToken, sessionKey]);

  useEffect(() => {
    syncAdminAnnouncementUpdates(adminAnnouncementUpdates(announcements, playerCategoryIds));
  }, [announcements, playerCategoryIds, syncAdminAnnouncementUpdates]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);
  const value = useMemo(() => ({ announcements, refresh }), [announcements, refresh]);
  return <AdminAnnouncementsContext.Provider value={value}>{children}</AdminAnnouncementsContext.Provider>;
}

export function useAdminAnnouncements() {
  const value = useContext(AdminAnnouncementsContext);
  if (!value) throw new Error('useAdminAnnouncements must be used inside AdminAnnouncementsProvider');
  return value;
}
