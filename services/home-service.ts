import { homeDashboardMock } from '@/data/home';
import { HomeDashboard } from '@/types/player';

export interface HomeService {
  getDashboard(): Promise<HomeDashboard>;
}

export const mockHomeService: HomeService = {
  async getDashboard() {
    return homeDashboardMock;
  },
};
