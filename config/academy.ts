import { AcademySupportContact } from '@/types/profile';
import { demoConfig } from '@/config/demo';

export const academySupportContact: AcademySupportContact = {
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'support@gccacademy.example',
  officeHours: 'Monday–Saturday, 9:00 AM–6:00 PM',
  isDemo: true,
};

export const academyPaymentInstructions = [
  'Pay the academy office directly by cash or approved bank transfer.',
  `Mention the player ID ${demoConfig.player.playerId} with every payment.`,
  'Payment confirmation is recorded by academy accounts.',
] as const;
