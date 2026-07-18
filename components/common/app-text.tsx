import { Text, TextProps, TextStyle } from 'react-native';

import { colors, fontFamilies, typography } from '@/design/tokens';

type TextVariant = 'display' | 'title' | 'heading' | 'body' | 'bodySmall' | 'caption' | 'button';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extraBold';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: string;
}

export function AppText({ variant = 'body', weight = 'regular', color = colors.neutral.text, style, ...props }: AppTextProps) {
  const textStyle: TextStyle = { ...typography[variant], fontFamily: fontFamilies[weight], color };
  return <Text {...props} style={[textStyle, style]} />;
}
