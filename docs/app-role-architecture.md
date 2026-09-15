# Application role architecture

The app serves three roles from one codebase: Player/Parent, Coach, and Admin.

## Shared authentication source

`ProfileProvider` (`contexts/profile-context.tsx`) is the single authentication and session source
for the application. A session has role `player`, `coach`, or `admin`; separate role-specific auth
contexts are intentionally not used.

All three roles sign in on the same Sign In screen. `services/mock-auth-service.ts` holds the demo
accounts, and the account ID determines the role — there is no role picker.

Session restoration completes before route rendering. Stored sessions with the original
`{ playerId, signedInAt }` shape migrate safely to a schema-2 Player session. `isStoredSession`
validates the role, so a new role must be added there as well as to `UserRole`, or restored sessions
are silently discarded on relaunch. Unknown or malformed roles fail validation and are removed by the
typed storage layer.

## Protected routing

The root Expo Router stack uses mutually exclusive protected branches:

| Condition | Available route family |
| --- | --- |
| No session | `/(auth)` |
| `role === 'player'` | `/(tabs)` and Player detail routes |
| `role === 'coach'` | `/(coach)` |
| `role === 'admin'` | `/(admin)` |

Role groups are not navigated as manually named React Navigation navigators. Direct access to the
wrong protected family resolves to the available anchor route.

A route group contributes no URL segment, so `(tabs)/index.tsx`, `(coach)/(tabs)/index.tsx`, and
`(admin)/(tabs)/index.tsx` all claim `/`, and `(coach)/support.tsx` and `(admin)/support.tsx` both
claim `/support`. This is safe only because the root layout mounts exactly one branch at a time.
Mounting a role group outside a `Stack.Protected` guard would let its routes hijack URLs from the
other modules.

## Role navigation

- Player keeps the original Home, Progress, Sessions, Updates, and Profile tabs.
- Coach uses Dashboard, Players, Attendance, Training, and Profile.
- Admin uses Overview, Members, Coaches, Finance, and Settings.
- All three wrappers use the shared typed `AdaptiveTabBar` implementation.
- Player unread badges remain Player-only; Coach and Admin tabs do not show a fake badge.
- Detail routes stay inside their own role stack and never appear in a tab bar.

## Providers

Role-specific providers mount inside their own group layout rather than the root layout, so the
other roles carry no extra state. `AdminDataProvider` mounts in `app/(admin)/_layout.tsx`.

There is one sanctioned exception, recorded in CLAUDE.md §7: a provider whose job is to reach
**another** role's screens mounts in the root layout, because its own group is unmounted when that
audience is signed in.

| Provider | Carries | Why root |
| --- | --- | --- |
| `AcademyOperationsProvider` | Coach announcements, schedules, session assignments → Player Updates | `(coach)` is unmounted while a player is signed in |
| `AdminAnnouncementsProvider` | Admin announcements → Player Updates | `(admin)` is unmounted while a player is signed in |

Neither holds state that the other roles' screens consume.

## Shared academy entities

Typed Academy, Squad, Player, Coach, Training Session, Attendance Record, Skill Assessment, Coach
Feedback, Session Reference, Academy Update, Fee Record, and Coach Task entities are defined once.
`AcademyDataProvider` supplies stable read-only mock data to all three role foundations.

The Admin directory in `data/admin.ts` derives its members, squads, and fee amounts from
`sharedAcademyData`, so the three roles agree on the same facts rather than duplicating them.

## Cross-role writes

A write in one module surfaces in the others through the shared contexts:

| Write | Reaches |
| --- | --- |
| Coach publishes assessment, training plan, schedule, or announcement | Player Updates, via `AcademyOperationsProvider` / `AssessmentProvider` / `TrainingPlanProvider` |
| Admin posts an announcement | Player Updates, via `AdminAnnouncementsProvider`, filtered by audience |
| Admin records a fee payment | Member record, Finance, Money In, and Reports |
| Admin pays a coach salary | Coach salary status and Money Out |
| Admin enrols or edits a member | Member list, member record, and squad roster |

`contexts/updates-context.tsx` merges four domain channels into the Player feed, each keyed by an id
prefix (`coach-assessment-update-`, `coach-training-update-`, `coach-operation-update-`,
`admin-announcement-update-`) so a sync in one channel never overwrites another.

## Logout and role switching

Logout removes the complete stored session. Protected route availability changes immediately to
auth-only. Android Back cannot return to a protected route because that route family is no longer
mounted. Switching roles requires logout and a new sign-in during this MVP.
