import {
  CreatorService
} from '../services/creator-service.models';

export interface PublicCreator {
  userId: number;
  fullName: string;
  profileType: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  websiteUrl: string | null;
  skills: string[];
  services: CreatorService[];
}
