import { academyUpdates, getUpdateById } from '@/data/updates';
import { AcademyCommunicationUpdate } from '@/types/updates';

export const updatesService = {
  async getUpdates(): Promise<readonly AcademyCommunicationUpdate[]> { return academyUpdates; },
  async getUpdate(id: string): Promise<AcademyCommunicationUpdate | undefined> { return getUpdateById(id); },
};
