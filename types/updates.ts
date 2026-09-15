export type UpdateCategory = 'All' | 'Match' | 'Camp' | 'Holiday' | 'Schedule Change' | 'Academy Event' | 'Payment Reminder' | 'General Notice';
export type AcademyUpdateCategory = Exclude<UpdateCategory, 'All'>;
export type UpdatePriority = 'normal' | 'important' | 'urgent';
export type UpdateActionType = 'schedule' | 'progress' | 'feedback' | 'fee-details' | 'session' | 'event' | 'none';
export type UpdateDateGroup = 'Today' | 'Yesterday' | 'Earlier';

export interface UpdateMetadata {
  readonly date?: string;
  readonly time?: string;
  readonly ground?: string;
  readonly coach?: string;
  readonly amount?: string;
  readonly dueDate?: string;
  readonly assessmentPeriod?: string;
  readonly sessionDuration?: string;
  readonly audience?: string;
}

export interface AcademyCommunicationUpdate {
  readonly id: string;
  readonly category: AcademyUpdateCategory;
  readonly priority: UpdatePriority;
  readonly title: string;
  readonly preview: string;
  readonly message: string;
  readonly publishedAt: string;
  readonly relativeTime: string;
  readonly dateGroup: UpdateDateGroup;
  readonly senderName: string;
  readonly senderRole: string;
  readonly audienceLabel: string;
  readonly actionType: UpdateActionType;
  readonly actionLabel?: string;
  readonly targetId?: string;
  readonly metadata: UpdateMetadata;
  readonly initiallyRead: boolean;
}

export interface UpdatesState {
  readonly updates: readonly AcademyCommunicationUpdate[];
  readonly readIds: ReadonlySet<string>;
  readonly status: 'loading' | 'ready' | 'error';
}

export type UpdatesAction =
  | { readonly type: 'load-success'; readonly updates: readonly AcademyCommunicationUpdate[]; readonly readIds: ReadonlySet<string> }
  | { readonly type: 'load-error' }
  | { readonly type: 'loading' }
  | { readonly type: 'mark-read'; readonly updateId: string }
  | { readonly type: 'mark-all-read' }
  | { readonly type: 'sync-assessment-updates'; readonly updates: readonly AcademyCommunicationUpdate[] }
  | { readonly type: 'sync-training-updates'; readonly updates: readonly AcademyCommunicationUpdate[] }
  | { readonly type: 'sync-operation-updates'; readonly updates: readonly AcademyCommunicationUpdate[] }
  | { readonly type: 'sync-admin-announcement-updates'; readonly updates: readonly AcademyCommunicationUpdate[] }
  | { readonly type: 'replace-read-state'; readonly readIds: ReadonlySet<string> };
