import { motion } from '@/design/tokens';
import { useReducedMotion } from './use-reduced-motion';

export function useImageTransition() {
  return useReducedMotion() ? 0 : motion.duration.fast;
}
