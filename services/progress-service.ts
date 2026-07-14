import { progressDashboardMock } from '@/data/progress';
import { ProgressDashboard } from '@/types/progress';

export interface ProgressService {
  getDashboard(): Promise<ProgressDashboard>;
}

export const mockProgressService: ProgressService = {
  async getDashboard() {
    return progressDashboardMock;
  },
};
