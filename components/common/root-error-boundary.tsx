import { reloadAppAsync } from 'expo';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, layout, radius, spacing, typography } from '@/design/tokens';
import { removeStoredValue, storageKeys } from '@/utils/app-storage';

interface RootErrorBoundaryProps {
  readonly children: ReactNode;
}

interface RootErrorBoundaryState {
  readonly hasError: boolean;
  readonly recoveryError: string | null;
}

const initialState: RootErrorBoundaryState = {
  hasError: false,
  recoveryError: null,
};

export class RootErrorBoundary extends Component<RootErrorBoundaryProps, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = initialState;

  static getDerivedStateFromError(): RootErrorBoundaryState {
    return { hasError: true, recoveryError: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (__DEV__) console.error('Unhandled application render error', error, info.componentStack);
  }

  private reload = async () => {
    try {
      await reloadAppAsync('Recover from the root error boundary');
    } catch {
      this.setState({ recoveryError: 'The app could not reload. Close Expo Go and open the project again.' });
    }
  };

  private returnToSignIn = async () => {
    try {
      await removeStoredValue(storageKeys.authSession);
      await reloadAppAsync('Return to Sign In from the root error boundary');
    } catch {
      this.setState({ recoveryError: 'Sign In could not be restored. Close Expo Go and open the project again.' });
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.screen} accessibilityRole="alert">
        <View style={styles.card}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>Please reload the app.</Text>
          {this.state.recoveryError ? <Text style={styles.error}>{this.state.recoveryError}</Text> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reload the application"
            onPress={() => { void this.reload(); }}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryLabel}>Reload</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear the current session and return to Sign In"
            onPress={() => { void this.returnToSignIn(); }}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryLabel}>Return to Sign In</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.neutral.background,
  },
  card: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: radius.large,
    backgroundColor: colors.neutral.surface,
  },
  title: {
    color: colors.neutral.text,
    fontFamily: fontFamilies.extraBold,
    ...typography.title,
  },
  message: {
    color: colors.neutral.textSecondary,
    fontFamily: fontFamilies.medium,
    ...typography.body,
  },
  error: {
    color: colors.status.error,
    fontFamily: fontFamilies.medium,
    ...typography.bodySmall,
  },
  primaryButton: {
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.medium,
    backgroundColor: colors.brand.navy,
  },
  primaryLabel: {
    color: colors.neutral.white,
    fontFamily: fontFamilies.bold,
    ...typography.bodySmall,
  },
  secondaryButton: {
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral.borderStrong,
    borderRadius: radius.medium,
    backgroundColor: colors.neutral.surface,
  },
  secondaryLabel: {
    color: colors.brand.navy,
    fontFamily: fontFamilies.bold,
    ...typography.bodySmall,
  },
  pressed: {
    opacity: 0.78,
  },
});
