export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatVideoProgress(watched: number, duration: number): string {
  return `${watched} / ${duration} min`;
}

export function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, value));
}
