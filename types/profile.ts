import { ImageSource } from 'expo-image';

export type MembershipStatus = 'active' | 'pending-renewal' | 'paused' | 'inactive';
export type FeeStatus = 'pending' | 'paid' | 'overdue';

export interface PlayerIdentity {
  readonly name: string;
  readonly category: string;
  readonly jerseyNumber: number;
  readonly playerId: string;
  readonly joinedYear: number;
  readonly photo: ImageSource | null;
}

export interface AcademyAssignment {
  readonly category: string;
  readonly batch: string;
  readonly headCoach: string;
  readonly assistantCoaches: readonly string[];
  readonly trainingGround: string;
  readonly trainingDays: readonly string[];
  readonly joiningDate: string;
}

export interface PlayerMembership {
  readonly status: MembershipStatus;
  readonly plan: string;
  readonly membershipId: string;
  readonly currentPeriod: string;
  readonly renewalDate: string;
}

export interface FeeRecord {
  readonly id: string;
  readonly period: string;
  readonly amount: number;
  readonly status: FeeStatus;
  readonly dueDate?: string;
  readonly paidDate?: string;
  readonly receiptNumber?: string;
}

export interface GuardianDetails {
  readonly name: string;
  readonly relationship: string;
  readonly primaryPhone: string;
  readonly emergencyPhone: string;
}

export interface NotificationPreferences {
  readonly trainingUpdates: boolean;
  readonly progressFeedback: boolean;
  readonly feeReminders: boolean;
  readonly learningRecommendations: boolean;
  readonly academyAnnouncements: boolean;
}

export type NotificationPreferenceKey = keyof NotificationPreferences;
export type AppLanguage = 'en';

export type UserRole = 'player' | 'coach' | 'admin';

export interface MockSession {
  readonly schemaVersion: 2;
  readonly userId: string;
  readonly role: UserRole;
  readonly displayName: string;
  readonly academyId: string;
  readonly categoryIds?: readonly string[];
  readonly assignedSquadIds?: readonly string[];
  readonly signedInAt: string;
}

export interface SignInCredentials {
  readonly identifier: string;
  readonly password: string;
}

export interface PlayerProfile {
  readonly identity: PlayerIdentity;
  readonly academy: AcademyAssignment;
  readonly membership: PlayerMembership;
  readonly guardian: GuardianDetails;
  readonly currentFee: FeeRecord | null;
  readonly feeHistory: readonly FeeRecord[];
}

export interface AcademySupportContact {
  readonly phone: string;
  readonly whatsapp: string;
  readonly email: string;
  readonly officeHours: string;
  readonly isDemo: boolean;
}
