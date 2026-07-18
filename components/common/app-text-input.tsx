import { forwardRef, ReactNode, useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

import { colors, fontFamilies, layout, radius, spacing, typography } from '@/design/tokens';

interface AppTextInputProps extends Omit<TextInputProps, 'style'> {
  readonly leading?: ReactNode;
  readonly trailing?: ReactNode;
  readonly error?: boolean;
  readonly containerStyle?: StyleProp<ViewStyle>;
  readonly inputStyle?: StyleProp<TextStyle>;
}

export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(function AppTextInput({ leading, trailing, error = false, containerStyle, inputStyle, multiline = false, editable = true, placeholderTextColor = colors.neutral.textMuted, onFocus, onBlur, accessibilityState, ...props }, ref) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.frame, multiline && styles.multilineFrame, focused && styles.focused, error && styles.error, !editable && styles.disabled, containerStyle]}>
      {leading}
      <TextInput
        {...props}
        ref={ref}
        editable={editable}
        multiline={multiline}
        aria-invalid={error}
        accessibilityState={{ ...accessibilityState, disabled: !editable }}
        placeholderTextColor={placeholderTextColor}
        onFocus={(event) => { setFocused(true); onFocus?.(event); }}
        onBlur={(event) => { setFocused(false); onBlur?.(event); }}
        style={[styles.input, multiline && styles.multilineInput, inputStyle]}
      />
      {trailing}
    </View>
  );
});

const styles = StyleSheet.create({
  frame: { minHeight: layout.inputHeight, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.neutral.borderStrong, borderRadius: radius.medium, backgroundColor: colors.neutral.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  multilineFrame: { minHeight: layout.multilineInputMinHeight, paddingVertical: spacing.sm, alignItems: 'stretch' },
  focused: { borderColor: colors.brand.blue },
  error: { borderColor: colors.status.error },
  disabled: { backgroundColor: colors.neutral.backgroundRaised, opacity: 0.72 },
  input: { flex: 1, minWidth: 0, minHeight: layout.inputHeight - 2, paddingVertical: 0, color: colors.neutral.text, fontFamily: fontFamilies.medium, ...typography.body },
  multilineInput: { minHeight: layout.multilineInputMinHeight - spacing.lg, paddingTop: 0, paddingBottom: 0, textAlignVertical: 'top' },
});
