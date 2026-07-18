import { Easing } from 'react-native';

export const motion = {
  duration: {
    instant: 110,
    press: 160,
    fast: 200,
    standard: 220,
    skeleton: 1200,
  },
  scale: {
    pressSmall: 0.985,
    pressStrong: 0.97,
  },
  translation: {
    sectionEnterY: 8,
  },
  opacity: {
    enterFrom: 0,
    pressed: 0.84,
  },
  easing: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
  },
} as const;
