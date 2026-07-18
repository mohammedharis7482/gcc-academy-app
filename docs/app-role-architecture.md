# Application role architecture

## Shared authentication source

`ProfileProvider` remains the single authentication/session source for the application. A session has role `player` or `coach`; separate role-specific auth contexts are intentionally not used.

Session restoration completes before route rendering. Stored sessions with the original `{ playerId, signedInAt }` shape migrate safely to a schema-2 Player session. Unknown or malformed roles fail validation and are removed by the typed storage layer.

## Protected routing

The root Expo Router stack uses mutually exclusive protected branches:

| Condition | Available route family |
| --- | --- |
| No session | `/(auth)` |
| `role === 'player'` | `/(tabs)` and Player detail routes |
| `role === 'coach'` | `/(coach)` |

Sign-in uses a file-based `router.replace` destination chosen from the authenticated role. Role groups are not navigated as manually named React Navigation navigators. Direct access to the wrong protected family resolves to the available anchor route.

## Role navigation

- Player keeps the original Home, Progress, Sessions, Updates, and Profile tabs.
- Coach uses Dashboard, Players, Attendance, Training, and Profile.
- Both wrappers use the shared typed `AdaptiveTabBar` implementation.
- Player unread badges remain Player-only; Coach tabs do not show a fake badge.
- Coach detail routes remain inside the Coach stack and do not appear in either tab bar.

## Shared academy entities

Phase C1 defines typed Academy, Squad, Player, Coach, Training Session, Attendance Record, Skill Assessment, Coach Feedback, Session Reference, Academy Update, Fee Record, and Coach Task entities. `AcademyDataProvider` supplies stable read-only mock data to both role foundations.

Existing Player datasets are not broadly migrated during C1. Shared facts use the existing centralized demo configuration where overlap matters, which avoids destabilizing the frozen Player UI.

## Logout and role switching

Logout removes the complete stored session. Protected route availability changes immediately to auth-only, and Coach Profile additionally replaces the current route with Sign In. Android Back cannot return to a protected route because that route family is no longer mounted. Switching roles requires logout and a new sign-in during this MVP.
