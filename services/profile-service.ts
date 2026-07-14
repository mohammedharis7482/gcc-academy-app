import { playerProfileMock } from '@/data/profile';
import { PlayerProfile } from '@/types/profile';

export interface ProfileService {
  getProfile(): Promise<PlayerProfile | null>;
}

export const profileService: ProfileService = {
  async getProfile() {
    return playerProfileMock;
  },
};
