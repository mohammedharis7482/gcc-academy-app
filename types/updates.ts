export type UpdateCategory = 'All' | 'Training' | 'Progress' | 'Fees' | 'Learning' | 'Academy';
export type AcademyUpdateCategory = Exclude<UpdateCategory, 'All'>;
export type UpdatePriority = 'normal' | 'important' | 'urgent';
export type UpdateActionType = 'schedule' | 'progress' | 'feedback' | 'fee-details' | 'lesson' | 'event' | 'none';
export type UpdateDateGroup = 'Today' | 'Yesterday' | 'Earlier';

export interface UpdateMetadata {
  readonly date?: string;
  readonly time?: string;
  readonly ground?: string;
  readonly coach?: string;
  readonly amount?: string;
  readonly dueDate?: string;
  readonly assessmentPeriod?: string;
  readonly lessonDuration?: string;
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
  | { readonly type: 'load-success'; readonly updates: readonly AcademyCommunicationUpdate[] }
  | { readonly type: 'load-error' }
  | { readonly type: 'loading' }
  | { readonly type: 'mark-read'; readonly updateId: string }
  | { readonly type: 'mark-all-read' }
  | { readonly type: 'replace-read-state'; readonly readIds: ReadonlySet<string> };
