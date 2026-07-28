import { AccountType } from '../auth/auth.models';

export type ProfileType =
  | 'STUDENT'
  | 'INDEPENDENT_CREATOR'
  | 'PROFESSIONAL_FREELANCER'
  | 'STARTUP_FOUNDER'
  | 'STARTUP_TEAM'
  | 'AGENCY'
  | 'BUSINESS'
  | 'GENERAL_CLIENT';

export interface SaveProfileRequest {
  profileType: ProfileType;
  accountType: AccountType;
  headline: string;
  bio: string;
  location: string;
  websiteUrl: string;
  skills: string[];
}

export interface UserProfileResponse {
  profileId: number;
  userId: number;
  fullName: string;
  email: string;
  accountType: AccountType;
  profileType: ProfileType;
  headline: string | null;
  bio: string | null;
  location: string | null;
  websiteUrl: string | null;
  avatarUrl: string | null;
  skills: string[];
  onboardingCompleted: boolean;
}
