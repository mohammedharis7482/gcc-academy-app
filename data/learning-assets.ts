import { ImageSource } from 'expo-image';

import { LessonThumbnail } from '@/types/learning';

export const learningImages: Readonly<Record<LessonThumbnail, ImageSource>> = {
  'ball-control': require('@/assets/images/home/ball-control.png'),
  passing: require('@/assets/images/learn/weak-foot-passing.png'),
  positioning: require('@/assets/images/learn/positioning.png'),
  recovery: require('@/assets/images/learn/recovery.png'),
  training: require('@/assets/images/home/training-hero.png'),
};

export const learningFallbackImage = require('@/assets/images/home/ball-control.png') as ImageSource;
