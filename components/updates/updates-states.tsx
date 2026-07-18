import { EmptyState } from '@/components/states/content-state';
import { SkeletonList } from '@/components/states/loading-skeletons';

export function UpdatesSkeleton() {
  return <SkeletonList count={3} />;
}

export function UpdatesEmptyState({ category }: { readonly category?: string }) {
  return <EmptyState icon="bell-check-outline" title={category ? `No ${category} updates` : 'You’re all caught up'} message={category ? `There are no ${category.toLowerCase()} updates to show.` : 'New academy communication will appear here.'} />;
}
