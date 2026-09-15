import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { AppTextInput } from '@/components/common/app-text-input';
import { AnimatedPressable } from '@/components/common/animated-pressable';
import { adminDemoConfig } from '@/config/admin';
import { demoConfig } from '@/config/demo';
import { useProfile } from '@/contexts/profile-context';
import { colors, layout, radius, shadows, spacing } from '@/design/tokens';

const accountIdPattern = /^GCC-[A-Z0-9]+-\d+$/;

export default function SignInScreen() {
  const { signIn } = useProfile();
  const passwordRef = useRef<TextInput>(null);
  const submittingRef = useRef(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const identifierValid = accountIdPattern.test(identifier.trim().toUpperCase());
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

  return <SafeAreaView style={styles.safe}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"><View style={styles.brand}>{!logoFailed ? <Image source={require('@/assets/branding/gcc-logo.png')} style={styles.logo} contentFit="contain" onError={() => setLogoFailed(true)} /> : <MaterialCommunityIcons name="shield-star-outline" size={48} color={colors.brand.gold} />}<AppText variant="display" weight="extraBold" color={colors.neutral.white} style={styles.center}>Welcome back</AppText><AppText color={colors.navyMutedText} style={styles.center}>Sign in to access your GCC academy account.</AppText></View><View style={styles.panel}><View><AppText variant="bodySmall" weight="bold" style={styles.label}>Academy account ID</AppText><AppTextInput testID="sign-in-identifier" accessibilityLabel="Academy account ID" value={identifier} onChangeText={(value) => { setIdentifier(value); setInvalidLogin(false); }} placeholder="GCC account ID" autoCapitalize="characters" autoCorrect={false} returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} error={submitted && !identifierValid} containerStyle={styles.inputSurface} />{submitted && !identifierValid ? <AppText variant="caption" color={colors.status.error} style={styles.fieldError}>Enter a valid GCC account ID.</AppText> : null}</View><View><AppText variant="bodySmall" weight="bold" style={styles.label}>Password</AppText><AppTextInput ref={passwordRef} testID="sign-in-password" accessibilityLabel="Password" value={password} onChangeText={(value) => { setPassword(value); setInvalidLogin(false); }} placeholder="Enter password" secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} textContentType="password" returnKeyType="done" onSubmitEditing={() => { void submit(); }} error={submitted && !passwordValid} containerStyle={styles.inputSurface} trailing={<AnimatedPressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'} onPress={() => setShowPassword((visible) => !visible)} style={styles.eye}><MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={layout.iconSizeStandard} color={colors.neutral.textSecondary} /></AnimatedPressable>} />{submitted && !passwordValid ? <AppText variant="caption" color={colors.status.error} style={styles.fieldError}>Password must contain at least 6 characters.</AppText> : null}</View>{invalidLogin ? <View accessibilityRole="alert" style={styles.error}><MaterialCommunityIcons name="alert-circle-outline" size={19} color={colors.status.error} /><AppText variant="bodySmall" color={colors.status.error} style={styles.errorCopy}>The account ID or password is incorrect.</AppText></View> : null}<AppButton testID="sign-in-submit" label="Sign in" loading={submitting} onPress={() => { setSubmitted(true); void submit(); }} disabled={!formValid} accessibilityLabel="Sign in to GCC academy account" style={styles.button} />{__DEV__ ? <View style={styles.hint}><AppText variant="caption" weight="bold" color={colors.brand.navy}>DEMO LOGIN</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>Player: {demoConfig.credentials.player.id} · {demoConfig.credentials.player.password}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>Coach: {demoConfig.credentials.coach.id} · {demoConfig.credentials.coach.password}</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>Admin: {adminDemoConfig.credentials.admin.id} · {adminDemoConfig.credentials.admin.password}</AppText></View> : null}</View></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, safe: { flex: 1, backgroundColor: colors.brand.navy }, content: { flexGrow: 1, width: '100%', maxWidth: layout.contentMaxWidth, alignSelf: 'center', padding: spacing.lg, justifyContent: 'center', gap: spacing.xl },
  brand: { alignItems: 'center', gap: spacing.sm }, logo: { width: 96, height: 96 }, center: { textAlign: 'center' }, panel: { ...shadows.hero, padding: spacing.lg, borderRadius: radius.hero, backgroundColor: colors.neutral.surface, gap: spacing.md },
  label: { marginBottom: spacing.xs }, inputSurface: { backgroundColor: colors.neutral.backgroundRaised }, eye: { width: layout.minTouchTarget, height: layout.minTouchTarget, marginRight: -spacing.md, alignItems: 'center', justifyContent: 'center' }, fieldError: { marginTop: spacing.xs },
  error: { padding: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.status.errorSoft, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, errorCopy: { flex: 1 }, button: { minHeight: layout.minTouchTarget }, hint: { alignItems: 'center', gap: 2, paddingTop: spacing.xs },
});
