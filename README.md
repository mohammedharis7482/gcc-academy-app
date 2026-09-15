# GCC Football Academy Mobile App

GCC Football Academy is an Expo/React Native mobile application for academy players, parents, coaches, and academy administrators. The current frontend MVP provides role-based experiences, persistent on-device demo state, and connected Player–Coach–Admin workflows without a backend.

## Technology

- Expo SDK 54 and Expo Router
- React Native 0.81 and React 19
- TypeScript with strict checking
- AsyncStorage for local demo persistence
- Manrope typography and shared GCC design tokens
- Android preview builds through EAS

## Local setup

Prerequisites:

- Node.js 20.19 or newer
- npm
- Expo Go, an Android emulator, or an EAS development/preview build

Install and run:

```bash
npm install
npx expo start --clear
```

Use the QR code with Expo Go or press `a` to open an available Android emulator.

Quality checks:

```bash
npx tsc --noEmit
npm run lint
npx expo-doctor
```

Create the configured internal Android APK preview:

```bash
eas build --profile preview --platform android
```

See [Android preview build notes](docs/android-preview-build.md) for the release checklist.

## Demo accounts

| Role | Account ID | Password |
| --- | --- | --- |
| Player/Parent | `GCC-U13-024` | `demo123` |
| Coach | `GCC-COACH-001` | `coach123` |
| Admin | `GCC-ADMIN-001` | `admin123` |

The accounts are frontend demo credentials only. Details and reset guidance are in [Demo credentials](docs/DEMO_CREDENTIALS.md).

## Demo scenario

The scripted client demonstration is centred on Ayaan Mohammed of the U13 Development Squad:

- Jersey 10; head coach Sandeep
- 94% attendance and 4.3/5 coach rating
- Current goal: Weak-foot Passing
- Current session: Saturday, 11 July 2026, 4:30 PM–6:00 PM
- July fee: ₹1,200 pending, due 15 July 2026

The Coach account has a primary U13 assignment and includes complete U10, U13, and U15 demo rosters so roster filtering can be reviewed.

The Admin account is Sreerag Ambadi, Academy Owner. It covers the academy-wide view: members, coaching staff, squads, finance (Money In, Money Out, coach salaries), approvals, reports, and academy announcements.

## Project structure

```text
app/          Expo Router routes and role groups
components/   Shared, Player, Coach, and Admin UI components
config/       Central demo and academy configuration
contexts/     Persistent frontend state providers
data/         Typed academy demo datasets and selectors
design/       GCC design and motion tokens
services/     Local persistence and mock service adapters
types/        Shared TypeScript models
docs/         QA, architecture, build, and client documents
```

The root layout owns role protection and shared providers. Player tabs live in `app/(tabs)`, Coach tabs live in `app/(coach)/(tabs)`, Admin tabs live in `app/(admin)/(tabs)`, and supporting pages are stack routes so they do not appear in the bottom navigation.

## Documentation

- [Feature inventory](FEATURES.md)
- [User flows](USER_FLOWS.md)
- [Known limitations](KNOWN_LIMITATIONS.md)
- [Changelog](CHANGELOG.md)
- [Client feedback checklist](docs/CLIENT_FEEDBACK_CHECKLIST.md)
- [Role architecture](docs/app-role-architecture.md)
- [Admin module](docs/admin-module.md)

## Data and privacy

All player, attendance, assessment, fee, and update records in this build are demonstration data stored locally on the test device. Do not enter real sensitive player or guardian information. Support contact details are centralized in `config/academy.ts`; legal screens remain clearly labelled drafts until approved policies are supplied.
