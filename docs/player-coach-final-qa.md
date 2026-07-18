# Player and Coach final integration QA

Audit date: 15 July 2026  
Scope: shared authentication, complete Player/Parent frontend, Coach C1–C5, persistence, and cross-role local-demo integration  
Release target: Android internal preview APK

## Freeze status

- C1–C5 implementation: **complete in active source**
- Route and provider audit: **pass**
- TypeScript, lint, Expo Doctor, dependency, and Android export: **pass**
- Physical Android interaction/performance pass: **pending**
- Final C6/frontend freeze: **do not approve until the physical Android checklist passes**

## Active route map

### Authentication

- Sign In: `app/(auth)/sign-in.tsx`
- Auth layout: `app/(auth)/_layout.tsx`
- Root role guards and providers: `app/_layout.tsx`

### Player/Parent

- Tabs: `app/(tabs)/_layout.tsx`
- Home: `app/(tabs)/index.tsx`
- Progress: `app/(tabs)/progress.tsx`
- Sessions: `app/(tabs)/sessions.tsx`
- Updates: `app/(tabs)/updates.tsx`
- Profile: `app/(tabs)/profile.tsx`
- Supporting routes: `app/training`, `app/progress`, `app/sessions`, `app/updates`, and `app/profile`

### Coach

- Stack: `app/(coach)/_layout.tsx`
- Tabs: `app/(coach)/(tabs)/_layout.tsx`
- Dashboard: `app/(coach)/(tabs)/index.tsx`
- Players: `app/(coach)/(tabs)/players.tsx`
- Attendance: `app/(coach)/(tabs)/attendance.tsx`
- Training: `app/(coach)/(tabs)/training.tsx`
- Profile: `app/(coach)/(tabs)/profile.tsx`
- Player Detail: `app/(coach)/players/[playerId].tsx`
- Feedback entry/history/detail: `app/(coach)/feedback`
- Coach Session, attendance history, support, and update detail: `app/(coach)`

No conflicting `screen.tsx`/`screen/index.tsx`, duplicate dynamic route, stale template tab, or detail route registered as a tab was found.

## Authentication and role safety

- Player credential: `GCC-U13-024` / `demo123`
- Coach credential: `GCC-COACH-001` / `coach123`
- Credentials map to roles; there is no client role picker.
- The versioned session persists under `samp.auth.session`.
- `Stack.Protected` exposes only the route family matching the restored session role.
- Logout removes only the auth session. The protected stack owns the transition back to Sign In, preventing duplicate replace actions and protected-screen Back access.
- Player and Coach local domain records remain intact when switching roles through logout/sign-in.

## Shared provider and persistence map

The root provider order is Academy Data → Attendance → Profile/Auth → Sessions → Updates → Assessment → Training Plan. Providers mount above role tabs and are not remounted by tab changes.

| Domain | Storage key | Shared consumers |
| --- | --- | --- |
| Auth | `samp.auth.session` | route guards, Sign In, both Profiles |
| Sessions progress | `samp.learn.progress` | Player Home, Sessions Home/Detail |
| Updates read state | `samp.updates.readState` | Player Updates list/detail and tab badge |
| Notification settings | `samp.settings.notifications` | Player Notification Settings |
| Language | `samp.settings.language` | Player Language |
| Attendance | `samp.attendance.records` | Coach Attendance/Dashboard/Players, Player Home/Progress/Attendance |
| Assessments | `samp.assessments.records` | Coach Dashboard/Player Detail, Player Home/Progress/Sessions/Updates |
| Training plans | `samp.training.plans` | Coach Dashboard/Training/Player Detail, Player Home/Schedule/Sessions/Updates |

All stored domains use the shared versioned storage envelope, validate restored values, and fail to safe seeded/local states when storage is missing or malformed.

## Player regression checklist

- [x] Five Player tabs retain the shared adaptive navigation.
- [x] Home actions target schedule, Progress, feedback/assessment, Sessions, fee details, and matching update details.
- [x] Progress reads submitted attendance and latest published Coach assessment.
- [x] Sessions restores watched/completed state and merges assessment plus saved-training recommendations.
- [x] Updates restores read state and includes current Coach assessment/training records.
- [x] Profile settings persist and logout is confirmation-protected.
- [x] Invalid Session, update, assessment, and feedback IDs render safe recovery states.
- [ ] Re-run every interaction on the preview APK.

## Coach C1–C5 checklist

- [x] Dashboard contains one Today card, Quick Actions, Today’s Tasks, and Latest Academy Update.
- [x] Players uses a 60-record FlatList with search, category/status filtering, and sorting.
- [x] Player Detail reads shared attendance, assessment, training-assigned Sessions, and academy data.
- [x] Attendance provides the 20-player operational roster, status controls, notes, summary, draft protection, save, and history.
- [x] Quick Feedback omits skill ratings; Full Assessment uses the compact visible rating set and shared publication flow.
- [x] Training uses one fixed-order drill plan, focus selection, Session assignment, note, state-aware sticky action, and completion summary.
- [x] Coach Profile is limited to identity, assignment, support, and logout.
- [ ] Re-run rapid attendance marking, assessment publication, and training completion on the preview APK.

## Cross-role integration matrix

| Coach mutation | Player result | Coach result |
| --- | --- | --- |
| Save attendance | Home/Progress percentage and Attendance Detail recalculate | Dashboard task/status, Players, Player Detail, and history update |
| Publish Quick Feedback | Home latest feedback, Progress timeline, unread Update | Dashboard pending count/activity and Player Detail feedback update |
| Publish Full Assessment | Progress ratings/goal/history, Sessions recommendations, unread Update | Dashboard and Player Detail assessment/skills/goal update |
| Save training plan | Home session details, Schedule, Sessions recommendations, unread Update | Dashboard task/Today card and Player Detail Session assignment update |
| Complete training session | Home advances to the next scheduled session | Dashboard and Training become completed/read-only until edit |

## Confirmed final audit repairs

1. Coach Player Detail now merges Sessions assigned by the shared Training Plan provider instead of showing only static/assessment Sessions.
2. The primary ground label is centralized as `GCC Football Ground` and reused by active Home, Profile, schedule, attendance, Coach training, academy, and Updates records.
3. The seeded Coach task now says `Review today’s training plan`, matching the active Friday session.
4. Coach logout no longer issues an explicit route replace in addition to the protected-stack transition.
5. Expo was aligned from `54.0.35` to the SDK-required `~54.0.36`; the lockfile was regenerated by Expo CLI.

## Navigation and Back checklist

- [x] Player and Coach detail routes live outside their tab navigators.
- [x] Dynamic params normalize string/array values and invalid IDs expose recovery actions.
- [x] Role guards reject direct wrong-role route access.
- [x] Logout changes the protected route family after session removal.
- [x] Attendance intercepts dirty Android Back and Coach tab changes.
- [x] Feedback intercepts dirty form Back/player changes.
- [x] Detail headers use `router.back()` with role-safe fallback routes.
- [ ] Verify gesture Back and three-button Back on physical Android.

## Accessibility and responsive checks

- Selected tabs, chips, ratings, attendance statuses, switches, read state, completion, and progress expose text/accessibility state beyond color.
- Operational actions use practical touch targets and shared press feedback.
- FlatList rows use stable IDs; images reserve stable dimensions and have fallbacks.
- Shared page/sticky/tab clearance accounts for safe-area insets.
- Static layouts are designed for 360, 390, 412, and 440 px widths.
- Physical checks remain required for large font scale, TalkBack order, outdoor contrast, gesture navigation, and OEM rendering.

## Client-facing content review

- Demo identity, U13 category, Coach Sandeep, fee, attendance baseline, current goal, Session IDs, session time, and primary ground are consistent across active data sources.
- Coach list/detail screens do not expose guardian phone numbers.
- Legal pages remain clearly marked frontend draft content.
- No production payment, chat, AI feedback, push delivery, backend synchronization, or Admin behavior is implied.

## Final validation commands

```sh
npx tsc --noEmit
npm run lint
npx expo-doctor
npx expo install --check
npx expo export --platform android
git diff --check
git status --short
git diff --stat
```

Final run evidence:

- `npx tsc --noEmit`: pass
- `npm run lint`: pass
- `npx expo-doctor`: pass, 18/18 checks
- `npx expo install --check`: pass, dependencies up to date
- `npx expo export --platform android`: pass, 1,600 modules bundled and 38 assets exported
- `git diff --check`: pass
- `npm audit --omit=dev`: reports 14 moderate advisories in the Expo SDK 54 build/configuration dependency chain; npm's only automatic resolution is the breaking Expo 57 upgrade, so no forced upgrade was applied during this SDK 54 freeze
- Pixel 8 AVD + Expo Go smoke: pass for cold JavaScript bundle and the branded Sign In screen; no route, navigation, or React Native fatal error was observed during that smoke run
- Full Player/Coach emulator matrix: not completed; the AVD later exited under host memory/graphics pressure before the role, persistence, and operational workflows could be verified end to end
- Attached physical Android device: none; the physical checks below remain the release gate

## Physical Android release checklist

1. Clear app data and confirm Sign In appears.
2. Sign in as Player; verify all five tabs and supporting details.
3. Complete/start a Session, read an update, toggle a setting, restart, and confirm restoration.
4. Logout, confirm Android Back cannot reopen Player routes, and sign in as Coach.
5. Verify Dashboard, 60-player roster filters/search/sort, and three Player Details.
6. Mark a full attendance roster rapidly, exercise dirty Back/discard/save, restart, and verify Player attendance effects.
7. Save Quick Feedback and Full Assessment; verify Dashboard, Player Detail, Player Home, Progress, Sessions, Updates, and unread badge.
8. Start/save/complete Training; verify Dashboard plus Player Home/Schedule/Sessions/Updates and Coach Player Detail Sessions.
9. Check 360 px layout, long names, keyboard, dialogs, sticky actions, both adaptive tab bars, gesture and three-button navigation.
10. Enable TalkBack and Reduce Motion; confirm labels, focus order, selected states, and no motion-dependent information.
11. Confirm no Metro, route, list-key, image, Reanimated, or navigation warning.

## Known limitations and Admin readiness

- Auth and academy data are local demo data; frontend guards are not production authorization.
- Persistence is device-local and has no multi-device conflicts or server audit trail.
- Updates are local records, not push notifications.
- Session media is a simulated thumbnail/progress experience.
- Production legal copy, payments, localization, and backend support contacts remain out of scope.
- Admin development may reuse the typed domain boundaries, but it should not start until the physical Android gate passes and backend ownership/authorization rules are agreed.

## Commit and preview APK commands

After the physical checklist passes and the diff has been reviewed:

```sh
git add app components config contexts data design docs hooks services types utils app.json eas.json package.json package-lock.json
git commit -m "feat: complete and freeze player and coach frontend"
npx eas-cli@latest build --platform android --profile preview
```
