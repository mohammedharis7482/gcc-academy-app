import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/common/app-button';
import { AppText } from '@/components/common/app-text';
import { demoConfig } from '@/config/demo';
import { useProfile } from '@/contexts/profile-context';
import { colors, fontFamilies, layout, radius, shadows, spacing, typography } from '@/design/tokens';

const playerIdPattern = /^GCC-[A-Z0-9]+-\d+$/;

export default function SignInScreen() {
  const { signIn } = useProfile();
  const passwordRef = useRef<TextInput>(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const identifierValid = playerIdPattern.test(identifier.trim().toUpperCase());
  const passwordValid = password.length >= 6;
  const formValid = identifierValid && passwordValid;

  const submit = async () => {
    if (!formValid || submitting) { setSubmitted(true); return; }
    setSubmitting(true);
    setInvalidLogin(false);
    const valid = await signIn({ identifier, password });
    setSubmitting(false);
    setInvalidLogin(!valid);
  };

  return <SafeAreaView style={styles.safe}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"><View style={styles.brand}>{!logoFailed ? <Image source={require('@/assets/branding/gcc-logo.png')} style={styles.logo} contentFit="contain" onError={() => setLogoFailed(true)} /> : <MaterialCommunityIcons name="shield-star-outline" size={48} color={colors.brand.gold} />}<AppText variant="display" weight="extraBold" color={colors.neutral.white} style={styles.center}>Welcome back</AppText><AppText color={colors.navyMutedText} style={styles.center}>Sign in to access {demoConfig.player.name}’s GCC academy account.</AppText></View><View style={styles.panel}><View><AppText variant="bodySmall" weight="bold" style={styles.label}>Player ID</AppText><TextInput testID="sign-in-identifier" accessibilityLabel="Player ID" value={identifier} onChangeText={(value) => { setIdentifier(value); setInvalidLogin(false); }} placeholder={demoConfig.player.playerId} placeholderTextColor={colors.neutral.textMuted} autoCapitalize="characters" autoCorrect={false} returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} style={[styles.input, submitted && !identifierValid && styles.inputError]} />{submitted && !identifierValid ? <AppText variant="caption" color={colors.status.error} style={styles.fieldError}>Enter a valid GCC player ID.</AppText> : null}</View><View><AppText variant="bodySmall" weight="bold" style={styles.label}>Password</AppText><View style={[styles.passwordRow, submitted && !passwordValid && styles.inputError]}><TextInput ref={passwordRef} testID="sign-in-password" accessibilityLabel="Password" value={password} onChangeText={(value) => { setPassword(value); setInvalidLogin(false); }} placeholder="Enter password" placeholderTextColor={colors.neutral.textMuted} secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} textContentType="password" returnKeyType="done" onSubmitEditing={() => { void submit(); }} style={styles.passwordInput} /><Pressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'} onPress={() => setShowPassword((visible) => !visible)} style={({ pressed }) => [styles.eye, pressed && styles.pressed]}><MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.neutral.textSecondary} /></Pressable></View>{submitted && !passwordValid ? <AppText variant="caption" color={colors.status.error} style={styles.fieldError}>Password must contain at least 6 characters.</AppText> : null}</View>{invalidLogin ? <View accessibilityRole="alert" style={styles.error}><MaterialCommunityIcons name="alert-circle-outline" size={19} color={colors.status.error} /><AppText variant="bodySmall" color={colors.status.error} style={styles.errorCopy}>The player ID or password is incorrect.</AppText></View> : null}<AppButton testID="sign-in-submit" label={submitting ? 'Signing in…' : 'Sign in to player account'} onPress={() => { setSubmitted(true); void submit(); }} disabled={!formValid || submitting} accessibilityLabel={`Sign in to ${demoConfig.player.name} player account`} accessibilityState={{ disabled: !formValid || submitting, busy: submitting }} style={styles.button} />{__DEV__ ? <View style={styles.hint}><AppText variant="caption" weight="bold" color={colors.brand.navy}>DEMO LOGIN</AppText><AppText variant="caption" color={colors.neutral.textSecondary}>{demoConfig.credentials.playerId} · {demoConfig.credentials.password}</AppText></View> : null}</View></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, safe: { flex: 1, backgroundColor: colors.brand.navy },
  content: { flexGrow: 1, width: '100%', maxWidth: layout.contentMaxWidth, alignSelf: 'center', padding: spacing.lg, justifyContent: 'center', gap: spacing.xl },
  brand: { alignItems: 'center', gap: spacing.sm }, logo: { width: 96, height: 96 }, center: { textAlign: 'center' },
  panel: { ...shadows.hero, padding: spacing.lg, borderRadius: radius.hero, backgroundColor: colors.neutral.surface, gap: spacing.md },
  label: { marginBottom: spacing.xs }, input: { minHeight: layout.minTouchTarget, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.neutral.borderStrong, borderRadius: radius.medium, backgroundColor: colors.neutral.backgroundRaised, color: colors.neutral.text, fontFamily: fontFamilies.medium, ...typography.body },
  passwordRow: { minHeight: layout.minTouchTarget, paddingLeft: spacing.md, borderWidth: 1, borderColor: colors.neutral.borderStrong, borderRadius: radius.medium, backgroundColor: colors.neutral.backgroundRaised, flexDirection: 'row', alignItems: 'center' }, passwordInput: { flex: 1, minWidth: 0, color: colors.neutral.text, fontFamily: fontFamilies.medium, ...typography.body }, eye: { width: layout.minTouchTarget, height: layout.minTouchTarget, alignItems: 'center', justifyContent: 'center' }, inputError: { borderColor: colors.status.error }, fieldError: { marginTop: spacing.xs },
  error: { padding: spacing.sm, borderRadius: radius.medium, backgroundColor: colors.status.errorSoft, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, errorCopy: { flex: 1 }, button: { minHeight: layout.minTouchTarget }, hint: { alignItems: 'center', gap: 2, paddingTop: spacing.xs }, pressed: { opacity: 0.65 },
});
