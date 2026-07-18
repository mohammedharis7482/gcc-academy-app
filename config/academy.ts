import { AcademySupportContact } from '@/types/profile';
import { demoConfig } from '@/config/demo';

export const academySupportContact: AcademySupportContact = {
  phone: '+91 95392 67730',
  whatsapp: '+91 95392 67730',
  email: 'info@gccacademy.in',
  officeHours: 'By appointment — contact the academy first',
  isDemo: false,
};

export const academyPaymentInstructions = [
  'Pay the academy office directly by cash or approved bank transfer.',
  `Mention the player ID ${demoConfig.player.playerId} with every payment.`,
  'Payment confirmation is recorded by academy accounts.',
] as const;
