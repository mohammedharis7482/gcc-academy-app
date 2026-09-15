# GCC Football Academy — Mobile App

Read this file before changing anything. It is the standing reference for how this
project is built. `docs/` holds the detail; this file holds the rules.

---

## 1. What this is

A React Native + Expo mobile app for GCC Football Academy (Chalissery, Kerala).
Three roles share one app:

| Role | Principle | Scope |
| --- | --- | --- |
| Player / Parent | View and participate | Own records only |
| Coach | Manage training and assigned players | Assigned squads |
| Admin | Manage the academy | Academy-wide |

**Current phase: frontend only.** There is no backend, no API, no real
authentication. All data is typed local mock data; everything saved goes to
AsyncStorage on the device.

Do not add a backend, an API client, `fetch`, or any network call until that phase
is explicitly approved.

---

## 2. Never change these

| Item | Value |
| --- | --- |
| Android package | `com.mhd_haris.gccacademyapp` |
| iOS bundle ID | `com.mhdharis.gccacademyapp` |
| Expo slug | `gcc-football-academy` |
| URL scheme | `gccacademyapp` |
| EAS project ID | `74eda49e-15b9-4a94-a450-03bc88c3b593` |

Changing these breaks release signing and store association.

---

## 3. Technology baseline

Pinned to **Expo SDK 54**. Do not upgrade the SDK or any major dependency.

- Expo SDK 54, Expo Router 6, React Native 0.81, React 19, TypeScript 5.9
- New Architecture enabled; typed routes and React Compiler are on
- No state library, no HTTP client, no UI kit — React Context and the local
  component library only

Never add a dependency. If a task seems to need one, stop and ask.

Read exact API docs at `https://docs.expo.dev/versions/v54.0.0/` before writing
code. If that is unreachable, verify against the installed typings in
`node_modules` rather than guessing.

---

## 4. Route architecture

Four Expo Router groups, declared as mutually exclusive `Stack.Protected`
branches in `app/_layout.tsx`:

```
app/
  (auth)/     no session
  (tabs)/     role === 'player'
  (coach)/    role === 'coach'
  (admin)/    role === 'admin'
```

**The rule that matters:** a route group contributes no URL segment. `(tabs)/index.tsx`,
`(coach)/(tabs)/index.tsx`, and `(admin)/(tabs)/index.tsx` all claim `/`. This is safe
only because the root layout mounts exactly one branch at a time. If you ever mount
a group outside a `Stack.Protected` guard, its routes will hijack URLs from the other
modules.

Tab bars:

- Player — Home, Progress, Sessions, Updates, Profile
- Coach — Dashboard, Players, Attendance, Training, Profile
- Admin — Overview, Members, Coaches, Finance, Settings

Do not change tab structure without approval. Detail screens are stack routes and
must never appear in a tab bar.

Navigation rules: one tap = one action; no duplicate stack pushes; no redirect
loops; logout clears protected history so Android Back cannot reopen a protected
screen; short native-feeling transitions.

---

## 5. Auth and session

`ProfileProvider` (`contexts/profile-context.tsx`) is the **single** session source
for all three roles. Never create a second auth context.

- `UserRole = 'player' | 'coach' | 'admin'` in `types/profile.ts`
- Accounts live in `services/mock-auth-service.ts`
- Session restore completes before routes render
- Stored sessions are validated by `isStoredSession`; **add any new role there too**,
  or restored sessions are silently discarded on relaunch

Demo accounts:

| Role | ID | Password |
| --- | --- | --- |
| Player | `GCC-U13-024` | `demo123` |
| Coach | `GCC-COACH-001` | `coach123` |
| Admin | `GCC-ADMIN-001` | `admin123` |

Frontend guards are **not** security. Real authorization arrives with the backend.

---

## 6. Design system

Import tokens from `@/design/tokens` — never hardcode a colour, size, or spacing value.

- `colors` — brand navy `#081D4D`, blue `#1597E5`, gold `#E9B629`; neutral, status,
  and soft variants
- `typography` — Manrope; `display` 28 / `title` 22 / `heading` 18 / `body` 14 /
  `bodySmall` 13 / `caption` 11
- `spacing`, `radius`, `shadows`, `motion`, `layout`

Shared components in `components/common/` — use these before writing anything new:

`AppScreen` · `AppText` · `AppButton` · `AppTextInput` · `AppBottomSheet` ·
`AppSelectRow` · `AppConfirmationDialog` · `StatusBadge` · `ProgressBar` ·
`SectionHeader` · `IconButton` · `AnimatedPressable` · `BrandLogo` ·
`OfflineBanner` · `SkeletonPulse`

Also: `components/states/` for loading, empty, error, and toast states;
`components/navigation/` for the shared `AdaptiveTabBar`.

Visual direction: premium, clean, professional, academy-focused. Prioritise
hierarchy, spacing, typography, alignment, clear primary actions. Avoid excessive
cards, shadows, gradients, animation, clutter, and floating buttons. **Approved UI
is frozen** unless a real usability problem is demonstrated.

---

## 7. Data and state

One context per domain. Mock data in `data/`, types in `types/`, read logic in
`services/`, persistence helpers in `utils/`.

```
types/      shape definitions
data/       typed seed data
services/   read/derive logic (no network)
contexts/   React state + persistence
```

- `AcademyDataProvider` supplies shared read-only academy data to all roles
- `AdminDataProvider` merges seed data with device-saved operations, so a recorded
  payment updates Overview, Finance, Reports, the member record, and the squad
  roster at once
- Role-specific providers mount inside their own group layout, not the root layout

Never duplicate a fact across datasets. Derive shared facts from
`sharedAcademyData` so all three roles agree.

Dates come from the scripted demo timeline in `config/demo.ts` (11 July 2026), not
the device clock, so demo records stay inside the July 2026 billing period.

---

## 8. Cross-module connection flows

These chains are the product. A change in one module must surface in the others.

| Flow | Chain |
| --- | --- |
| Player onboarding | Admin enrols → guardian → squad → coach → fee → account ready |
| Fee payment | Admin records payment → fee marked paid → Money In → history → Player sees it |
| Training | Coach schedules → session → attendance → performance → feedback → Player sees it |
| Session video | Admin uploads → library → Coach assigns → Player watches |
| Coach salary | Admin pays → salary status → expense → finance overview |
| Announcement | Author posts → audience targeting → recipients see it |

Before building a feature, ask which chain it belongs to and what else must update.

---

## 9. Finance rules

Operational academy finance — **not** accounting software.

Income: Player Fees · Camp Fees · Tournament Fees · Sponsorship · Merchandise · Other
Expenses: Coach Salary · Ground Rent · Equipment · Transportation · Tournament ·
Events · Marketing · Maintenance · Office · Other

Plain language only: Money In, Money Out, Pending, Paid, Overdue.

Do not build: double-entry bookkeeping, journal entries, ledger trees, a GST/tax
engine, balance sheets, or a full P&L suite.

---

## 10. How to work on a task

1. Read the relevant existing code before changing it
2. Say what you found, what will change, and what the risk is
3. Make the smallest correct change
4. Reuse existing components, tokens, and utilities
5. Validate
6. Report changed files, validation results, and what remains

Validation, every time:

```sh
npx tsc --noEmit
npm run lint
npx expo export --platform web
```

Never say "done" if code was written but not validated. Never mark a workflow
complete without exercising it.

Hard constraints:

- No new dependencies
- No backend, API client, or network call
- Do not modify Player or Coach screens without explicit approval
- No duplicate components, contexts, or auth systems
- No unrelated improvements during a focused task
- Surface conflicts and stop rather than guessing

---

## 11. Git

Branch from `main`. Small, meaningful commits:

```
feat: add admin finance reports
fix: prevent duplicate attendance submission
perf: reduce dashboard re-renders
```

Never commit `.env`, secrets, API keys, keystores, or build artefacts.

Tags: `pre-admin-frontend`, `v1.0.0-client-review`, `v1.0.1-client-review`.

---

## 12. Testing

Expo Go from the Play Store tracks the newest SDK and will refuse an SDK 54
project. Use the web build (`npx expo start`, press `w`), an SDK 54 build of Expo
Go, or an EAS development build.

Development mode is much slower than production — never judge performance from
`expo start` alone.

Real-device Android and iOS testing is the release gate and has **not** been
completed yet. Never call anything production-ready before it passes.

---

## 13. What is not built yet

Backend · real authentication · server-side authorization · database · payment
gateway · push notifications · production video streaming · multi-device sync ·
reports export · Malayalam localization · approved legal copy.

Roadmap after the Admin frontend: data model → API and RBAC specification →
backend foundation → integration → media and notifications → reports and polish →
device QA and release.

---

## 14. Known gaps

- `README.md` and `docs/DEMO_CREDENTIALS.md` still list only two demo accounts
- `docs/app-role-architecture.md` still describes two roles
- `clearDemoStorage` in `utils/app-storage.ts` does not clear
  `samp.admin.operations` (Admin has its own `clearAdminStorage`)
- Admin announcements do not yet write into the Player Updates feed
- Attendance is owned by the Coach module; Admin reads it only

---

## 15. Principles

Simple beats feature-heavy. Connected workflows beat duplicate data entry. Clarity
beats decoration. Security must be real, not visual. Finance should feel like
academy management, not accounting. Every screen has one clear purpose and one
primary action. Every important write has confirmation and useful history. Build in
phases and verify each phase.

The result should feel like one coherent academy platform, not three separate apps.

---

See also `AGENTS.md`, `docs/admin-module.md`, `docs/app-role-architecture.md`,
`FEATURES.md`, `KNOWN_LIMITATIONS.md`, and `USER_FLOWS.md`.
