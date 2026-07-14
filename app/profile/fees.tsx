import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/app-button';
import { AppScreen } from '@/components/common/app-screen';
import { CurrentFeeCard, FeeHistoryItem, PaymentInstructions } from '@/components/profile/fee-components';
import { ProfileSection, SubpageHeader, SurfaceCard } from '@/components/profile/profile-shared';
import { ContentState } from '@/components/states/content-state';
import { academyPaymentInstructions } from '@/config/academy';
import { useProfile } from '@/contexts/profile-context';
import { layout } from '@/design/tokens';

export default function FeeDetailsScreen() {
  const router = useRouter();
  const { profile, status, retry } = useProfile();
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/profile'); };
  if (status === 'error') return <AppScreen><SubpageHeader title="Fee Details" onBack={back} /><ContentState type="error" title="Fee records unavailable" message="Academy accounts data could not be loaded." onRetry={retry} /></AppScreen>;
  if (!profile) return <AppScreen><SubpageHeader title="Fee Details" onBack={back} /><ContentState type={status === 'loading' ? 'loading' : 'empty'} title={status === 'loading' ? 'Loading fee details' : 'No fee data'} /></AppScreen>;
  return <AppScreen><SubpageHeader title="Fee Details" subtitle="Membership fees and recorded payments" onBack={back} /><View style={styles.sections}><CurrentFeeCard fee={profile.currentFee} /><ProfileSection title="Payment History">{profile.feeHistory.length ? <SurfaceCard>{profile.feeHistory.map((fee) => <FeeHistoryItem key={fee.id} fee={fee} />)}</SurfaceCard> : <ContentState type="empty" title="No payment history" message="Recorded academy payments will appear here." />}</ProfileSection><ProfileSection title="How to Pay"><PaymentInstructions instructions={academyPaymentInstructions} /></ProfileSection><AppButton label="Contact academy support" variant="secondary" onPress={() => router.push('/profile/support')} accessibilityLabel="Contact academy support about fees" /></View></AppScreen>;
}

const styles = StyleSheet.create({ sections: { gap: layout.sectionGap } });
