import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { adminDemoConfig } from '@/config/admin';
import { PaymentMethod } from '@/types/admin';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

/** Avatar initials for a person's name — "Sreerag Ambadi" becomes "SA". */
export function initialsOf(name: string) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('');
}

/** The payment methods the academy accepts, in the order they are offered. */
export const paymentMethods = ['Cash', 'Bank Transfer', 'UPI'] as const satisfies readonly PaymentMethod[];

function paymentMethodIcon(method: PaymentMethod): IconName {
  return method === 'Cash' ? 'cash' : method === 'UPI' ? 'cellphone' : 'bank-outline';
}

/** Ready-made bottom sheet options for choosing a payment method. */
export const paymentMethodOptions = paymentMethods.map((value) => ({ id: value, label: value, icon: paymentMethodIcon(value) }));

/** Narrows a bottom sheet selection back to a payment method. */
export function toPaymentMethod(id: string): PaymentMethod | undefined {
  return paymentMethods.find((method) => method === id);
}

/** Billing period filter chips, shortened to the month because every period is 2026. */
export const adminPeriodOptions = adminDemoConfig.billing.periods.map((period) => ({ value: period, label: period.replace(' 2026', '') }));
