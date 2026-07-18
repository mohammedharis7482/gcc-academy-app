# Player/Parent user-flow map

This file documents the frontend MVP route contract. Dynamic IDs below must exist in the typed datasets under `data/`.

## Bottom tabs

| Tab | Route | Back behavior |
| --- | --- | --- |
| Home | `/(tabs)` | Android root behavior |
| Progress | `/(tabs)/progress` | Android root behavior |
| Sessions | `/(tabs)/sessions` | Android root behavior |
| Updates | `/(tabs)/updates` | Android root behavior; preserves provider state |
| Profile | `/(tabs)/profile` | Android root behavior |

Only these five screens are tab items. All other routes are authenticated stack screens.

## Home actions

| Action | Destination | Target ID / state | Back |
| --- | --- | --- | --- |
| Notification button | `/(tabs)/updates` | none | tab history |
| View training schedule | `/training/schedule` | none | source, fallback Home |
| View full progress | `/(tabs)/progress` | none | tab history |
| View report | `/progress/assessment/[assessmentId]` | `assessment-july-2026` | source, fallback Progress |
| Browse library | `/(tabs)/sessions` | none | tab history |
| Continue Session | `/sessions/[sessionId]` | `ball-control-basics`; advances shared progress | source, fallback Sessions |
| Fee reminder | `/profile/fees` | July 2026 fee | source, fallback Profile |
| Latest academy update | `/updates/[updateId]` | `weekend-training-time-updated`; marks read | source, fallback Updates |

## Progress actions

| Action | Destination | Target ID / state | Back |
| --- | --- | --- | --- |
| Attendance Summary | `/progress/attendance` | July 2026 | source, fallback Progress |
| Skill rating row | `/progress/assessment/[assessmentId]` | `assessment-july-2026`, optional `skillId` highlight | source, fallback Progress |
| Feedback timeline row | `/progress/feedback/[feedbackId]` | row feedback ID | source, fallback Progress |
| Current Goal | `/sessions/[sessionId]` | `weak-foot-passing-drill` | source, fallback Sessions |
| Sessions Before Next Session | `/sessions/[sessionId]` | `weak-foot-passing-drill` | source, fallback Sessions |

Radar and development trend charts are intentionally visual-only.

## Sessions actions

| Action | Destination / state | Back |
| --- | --- | --- |
| Continue, recommended, latest, completed Session | `/sessions/[sessionId]` using the card Session ID | source, fallback Sessions |
| Category chip | Filters the immutable Session collection locally | stays on Sessions |
| Play / Continue | Advances watched minutes in `LearningProvider` | n/a |
| Mark Complete | Sets completed state in `LearningProvider`; Sessions Home and the Home Session development section reflect it on return | n/a |
| Related Session | Pushes its own `/sessions/[sessionId]` | previous Session remains in stack |

Unknown or missing Session IDs render a safe error state with a Sessions fallback.

## Updates actions

| Update type | Destination | Required target / state | Back |
| --- | --- | --- | --- |
| Update card | `/updates/[updateId]` | card update ID; opening marks it read | source, fallback Updates |
| Mark all read | stays on Updates | marks all IDs read and clears tab badge | n/a |
| Training | `/training/schedule` | none | Update Detail |
| Progress assessment | `/progress/assessment/[assessmentId]` | update `targetId` | Update Detail |
| Coach feedback | `/progress/feedback/[feedbackId]` | update `targetId` | Update Detail |
| Academy Sessions | `/sessions/[sessionId]` | update `targetId` | Update Detail |
| Fee | `/profile/fees` | shared July 2026 fee | Update Detail |

Unknown or missing update IDs render a safe error state with an Updates fallback.

## Profile actions

| Action | Destination / state | Back |
| --- | --- | --- |
| Fee Summary | `/profile/fees` | shared July 2026 fee | source, fallback Profile |
| Notification Settings | `/profile/notifications` | session preferences in `ProfileProvider` | source, fallback Profile |
| Language | `/profile/settings` | English selected; Malayalam unavailable | source, fallback Profile |
| Help and Support | `/profile/support` | validated external link or inline failure | source, fallback Profile |
| About | `/profile/about` | none | source, fallback Profile |
| Privacy | `/profile/privacy` | draft frontend content | source, fallback Profile |
| Terms | `/profile/terms` | draft frontend content | source, fallback Profile |
| Logout / Cancel | closes dialog | no navigation |
| Logout / Confirm | clears mock auth in `ProfileProvider` | protected stack is removed; Login cannot go back to tabs |
| Sign in | authenticated protected tab stack | Home becomes available |

## Shared data invariants

- Player: Ayaan Mohammed, U13 Development Squad, jersey 10.
- Coach: Sandeep; coach rating 4.3 / 5.
- Attendance: 94%.
- Current goal: Weak-foot Passing.
- Current fee: ₹1,200 pending, due 15 July 2026.
- Next session: Saturday, 11 July, 4:30 PM–6:00 PM. It is listed as a time-changed session within the regular Tuesday/Thursday/Saturday schedule.
