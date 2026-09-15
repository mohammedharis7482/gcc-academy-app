import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/common/animated-pressable';
import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { AppTextInput } from '@/components/common/app-text-input';
import { BrandLogo } from '@/components/common/brand-logo';
import { adminDemoConfig } from '@/config/admin';
import { useAdminSession } from '@/contexts/admin-session-context';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';

const adminIdPattern = /^GCC-ADMIN-\d+$/;

export default function AdminSignInScreen() {
  const { signIn } = useAdminSession();
  const passwordRef = useRef<TextInput>(null);
  const submittingRef = useRef(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const identifierValid = adminIdPattern.test(identifier.trim().toUpperCase());
  const passwordValid = password.length >= 6;
  const formValid = identifierValid && passwordValid;

  const submit = async () => {
    if (!formValid || submittingRef.current) { setSubmitted(true); return; }
    submittingRef.current = true;
    setSubmitting(true); setInvalidLogin(false);
    try {
      const session = await signIn({ identifier, password });
      setInvalidLogin(!session);
    } catch {
      setInvalidLogin(true);
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  return <SafeAreaView style={styles.safe}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"><View style={styles.brand}><BrandLogo containerSize={96} feature /><AppText variant="display" weight="extraBold" color={colors.neutral.white} style={styles.center}>Academy Admin</AppText><AppText color={colors.navyMutedText} style={styles.center}>Sign in to manage members, coaches, and academy fees.</AppText></View><View style={styles.panel}><View><AppText variant="bodySmall" weight="bold" style={styles.label}>Admin ID</AppText><AppTextInput testID="admin-sign-in-identifier" accessibilityLabel="Admin ID" value={identifier} onChangeText={(value) => { setIdentifier(value); setInvalidLogin(false); }} placeholder="GCC admin ID" autoCapitalize="characters" autoCorrect={false} returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} error={submitted && !identifierValid} containerStyle={styles.inputSurface} />{submitted && !identifierValid ? <AppText variant="caption" color={colors.status.error} style={styles.fieldError}>Enter a valid GCC admin ID.</AppText> : null}</View><View><AppText variant="bodySmall" weight="bold" style={styles.label}>Password</AppText><AppTextInput ref={passwordRef} testID="admin-sign-in-password" accessibilityLabel="Password" value={password} onChangeText={(value) => { setPassword(value); setInvalidLogin(false); }} placeholder="Enter password" secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} textContentType="password" returnKeyType="done" onSubmitEditing={() => { void submit(); }} error={submitted && !passwordValid} containerStyle={styles.inputSurface} trailing={<AnimatedPressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'} onPress={() => setShowPassword((visible) => !visible)} style={styles.eye}><MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={layout.iconSizeStandard} color={colors.neutral.textSecondary} /></AnimatedPressable>} />{submitted && !passwordValid ? <AppText variant="caption" color={colors.status.error} style={styles.fieldError}>Password must contain at least 6 characters.</AppText> : null}</View>{invalidLogin ? <View accessibilityRole="alert" style={styles.error}><MaterialCommunityIcons name="alert-circle-outline" size={19} color={colors.status.error} /><AppText variant="bodySmall" color={colors.status.error} style={styles.errorCopy}>The admin ID or password is incorrect.</AppText></View> : null}<AppButton testID="admin-sign-in-submit" label="Sign in" loading={submitting} onPress={() => { setSubmitted(true); void submit(); }} disabled={!formValid} accessibilityLabel="Sign in to GCC academy admin account" style={styles.button} /><View style={styles.notice}><MaterialCommunityIcons name="information-outline" size={17} color={colors.status.info} /><AppText variant="caption" color={colors.neutral.textSecondary} style={styles.errorCopy}>Frontend demo only. No academy records leave this device.</AppText></View>{__DEV__ ? <View style={styles.hint}><AppText variant="caption" weight="bold" color={colors.brand.navy}>DEMO LOGIN</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>Admin: {adminDemoConfig.credentials.admin.id} · {adminDemoConfig.credentials.admin.password}</AppText></View> : null}</View></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, safe: { flex: 1, backgroundColor: colors.brand.navy }, content: { flexGrow: 1, width: '100%', maxWidth: layout.contentMaxWidth, alignSelf: 'center', padding: spacing.lg, justifyContent: 'center', gap: spacing.xl },
  brand: { alignItems: 'center', gap: spacing.sm }, center: { textAlign: 'center' }, panel: { ...shadows.hero, padding: spacing.lg, borderRadius: radius.hero, backgroundColor: colors.neutral.surface, gap: spacing.md },
  label: { marginBottom: spacing.xs }, inputSurface: { backgroundColor: colors.neutral.backgroundRaised }, eye: { width: layout.minTouchTarget, height: layout.minTouchTarget, marginRight: -spacing.md, alignItems: 'center', justifyContent: 'center' }, fieldError: { marginTop: spacing.xs },
  error: { padding: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.status.errorSoft, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, errorCopy: { flex: 1 }, button: { minHeight: layout.minTouchTarget },
  notice: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, hint: { alignItems: 'center', gap: 2, paddingTop: spacing.xs },
});
