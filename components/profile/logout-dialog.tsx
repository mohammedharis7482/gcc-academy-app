import { AppConfirmationDialog } from '@/components/common/app-confirmation-dialog';

interface LogoutDialogProps {
  readonly visible: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
  readonly accountLabel?: 'player' | 'coach';
}

export function LogoutDialog({ visible, onCancel, onConfirm, accountLabel = 'player' }: LogoutDialogProps) {
  return <AppConfirmationDialog visible={visible} icon="logout" title={`Log out of your ${accountLabel === 'coach' ? 'Coach' : 'Player'} account?`} description="You will need to sign in again to access this account." cancelLabel="Stay Logged In" confirmLabel="Log Out" cancelTestID="logout-cancel" confirmTestID="logout-confirm" destructive onCancel={onCancel} onConfirm={onConfirm} />;
}
