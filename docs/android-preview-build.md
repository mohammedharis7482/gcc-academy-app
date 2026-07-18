# Android preview APK build guide

This guide prepares the GCC Football Academy Player/Parent frontend for a private Android preview. The preview is a frontend-only demo: it uses mock authentication and locally persisted mock data, and it is not a production release.

## Preview configuration

| Setting | Value |
| --- | --- |
| App name | GCC Football Academy |
| Expo slug | `gcc-football-academy` |
| Version | `1.0.0` |
| Android version code | `1` |
| Android application ID | `com.mhd_haris.gccacademyapp` |
| Orientation | Portrait |
| Build profile | `preview` |
| Artifact | Installable APK |

The application ID has deliberately been preserved. Confirm that the chosen Expo account owns, or is authorized to use, this ID before distributing the preview.

## Prerequisites

- Node.js compatible with Expo SDK 54 (Node 20.19 or newer is recommended).
- The project dependencies installed with `npm install`.
- An Expo account with permission to own the EAS project.
- EAS CLI, either installed globally or invoked with `npx eas-cli@latest`.
- An Android device that allows installation from the browser or file manager used to open the APK.

## Demo sign-in

Use the frontend-only preview credentials:

- Player ID: `GCC-U13-024`
- Password: `demo123`

These credentials are not secure authentication and must be replaced by the future backend before production.

## Validate before every build

Run from the project root:

```sh
npx tsc --noEmit
npm run lint
npx expo-doctor
npx expo install --check
```

All four commands should pass before requesting an EAS build. If the Expo dependency check reports mismatches, review the proposed changes and use `npx expo install --fix` only when necessary.

An optional JavaScript/asset bundle check, which does not create an APK, is:

```sh
npx expo export --platform android --output-dir /tmp/gcc-football-academy-export
```

## First-time EAS setup

The repository intentionally does not contain an Expo account owner or EAS project ID. The project owner must perform the one-time account link:

```sh
npx eas-cli@latest login
npx eas-cli@latest init
```

During `eas init`, select the correct Expo organization/account and create or link the `gcc-football-academy` project. The command normally adds `extra.eas.projectId` to the Expo configuration. Review that change before committing it so the app is not accidentally linked to a personal or incorrect organization.

After linking, verify the resolved preview profile:

```sh
npx eas-cli@latest config --platform android --profile preview
```

## Build the preview APK

The repository's `eas.json` uses internal distribution and Android `buildType: apk`, so the preview profile produces an installable APK rather than an Android App Bundle.

If EAS CLI is installed globally, run the required build command:

```sh
eas build --platform android --profile preview
```

Without a global installation, the equivalent is:

```sh
npx eas-cli@latest build --platform android --profile preview
```

Follow the prompt to create or reuse Android signing credentials. Do not commit keystores or credential files to the repository.

## Install on an Android device

1. Open the successful build URL from the EAS dashboard or scan its QR code.
2. Download the APK on the target device.
3. If Android asks, allow APK installation for that browser or file manager only.
4. Install and open **GCC Football Academy**.
5. Sign in with the demo credentials above.

For a USB-connected development device, download the APK to the computer and use:

```sh
adb install -r /absolute/path/to/gcc-football-academy.apk
```

## Publish a newer preview

Before creating another installable preview, increment `expo.android.versionCode` in `app.json` from `1` to `2`, then `3`, and so on. Keep `expo.version` at `1.0.0` for equivalent preview iterations; change it only when the user-facing application version changes. Rerun all validation commands, commit the intended changes, and run the same preview build command.

Local EAS builds are optional and require a correctly configured Android SDK and Java toolchain:

```sh
npx eas-cli@latest build --platform android --profile preview --local
```

Cloud EAS Build is the recommended first-preview path.

## Android permissions

The preview needs internet access for connectivity status and valid external support links, and vibration for the app's haptic feedback. Legacy read/write external-storage permissions and the system-overlay permission are explicitly blocked in `app.json`; the Player/Parent frontend does not need them. No camera, microphone, location, contacts, notification, or media-library permission is requested by the app configuration.

## Troubleshooting

- **EAS project is not configured:** run `npx eas-cli@latest init` while logged into the intended Expo account.
- **Wrong Expo owner/project:** remove only the incorrect EAS project link after confirming ownership, then rerun `eas init`; do not change the Android application ID casually.
- **Dependency mismatch:** run `npx expo install --check`, inspect the output, and use `npx expo install --fix` only for confirmed SDK compatibility issues.
- **Stale local bundler output:** stop Metro, remove `.expo` and local Metro caches, then run `npx expo start --clear`.
- **Old demo state is restored:** clear the app's Android storage or uninstall/reinstall the APK. The in-app reset control is development-only and is intentionally absent from preview builds.
- **APK will not install over an older copy:** confirm that both APKs use the same application ID and signing credentials, and that the new `versionCode` is higher. Otherwise uninstall the previous preview first (which clears local data).
- **Support link fails:** the currently configured phone, WhatsApp, and email values are clearly marked demo contacts and must be replaced before production.
- **Content appears behind system UI:** capture the Android model, OS version, navigation mode (gesture or three-button), and screenshot for QA; the app uses safe-area insets and Android resize keyboard behavior.

## Known preview limitations

- Authentication is a local mock, not a secure server session.
- Player, training, attendance, progress, fee, Session development, update, and profile data are mock data.
- Session playback is a simulated thumbnail-based experience; no production video service is connected.
- State persists only on the installed device and is not synchronized.
- There is no real push-notification service, online payment, backend API, database, Coach module, or Admin module.
- Malayalam remains marked **Coming later**.
- Support contacts are demo values.
- Privacy Policy and Terms screens are explicitly draft/demo content and are not production legal documents.

## Client preview checklist

- [ ] Fresh install opens Sign In without a blank or flashing authenticated screen.
- [ ] Demo credentials open all five Player/Parent tabs.
- [ ] Home, Progress, Sessions, Updates, and Profile render and scroll correctly.
- [ ] Supporting detail pages open and Android Back returns predictably.
- [ ] Sessions progress and completion survive an app restart.
- [ ] Updates read state and tab badge survive an app restart.
- [ ] Notification preferences survive an app restart.
- [ ] Offline mode keeps local content visible and shows the offline indicator.
- [ ] Fee, support, legal, and logout flows behave as described for the preview.
- [ ] Logout returns to Sign In and Android Back does not reopen authenticated tabs.
- [ ] Launcher icon, adaptive icon, splash screen, app name, status bar, and navigation bar are branded and legible.
- [ ] Layout is checked on a narrow Android phone (approximately 360 px wide) and on the intended client device.
- [ ] No Metro/runtime warning or missing-image error is observed during the walkthrough.

