# Coach Training Workspace QA

## Active route and structure

- [ ] Sign in with the Coach demo account and open `/(coach)/(tabs)/training`.
- [ ] Confirm the page contains only Header, Today’s Session, Session Plan, Focus Areas, Assigned Academy Sessions, Coach Note, and the sticky action.
- [ ] Confirm no placeholder, objectives, calendar, history, status selector, or inline duplicate save action remains.
- [ ] Confirm the U13 squad, Friday 11 July 2026, 5:00 PM–6:30 PM, GCC Football Ground, 20 players, and Coach Sandeep render.

## Session state and drills

- [ ] Confirm Upcoming exposes `Start Session` and one tap changes/persists In Progress.
- [ ] Confirm completed sessions are read-only until `Edit Session` is intentionally chosen.
- [ ] Confirm Warm-up, First Touch, Passing, Small-sided Game, and Cool Down render in fixed order.
- [ ] Toggle every drill and confirm the textual `n of 5 completed` line and progress bar update immediately.
- [ ] Confirm a session can complete with one or more drills unfinished.

## Focus, Sessions, and note

- [ ] Confirm Passing, First touch, and Weak foot are selected by default.
- [ ] Confirm selecting a fourth focus area is blocked with a clear explanation.
- [ ] Confirm Session recommendations change with the selected focus and use valid shared Sessions IDs.
- [ ] Confirm no more than two Sessions can be assigned.
- [ ] Confirm saved assignments appear in Player Sessions but do not start or complete a Session.
- [ ] Apply each of the three note suggestions, type a custom note, and confirm the 200-character limit.
- [ ] Confirm the keyboard can dismiss by dragging and does not hide final content.

## Save, completion, and persistence

- [ ] Make a change and confirm the sticky label becomes `Save Session`.
- [ ] Save once and confirm duplicate submission is prevented.
- [ ] With no unsaved changes, tap `Complete Session` and verify the concise confirmation summary.
- [ ] Confirm Attendance, drill count, Session count, and feedback-pending count are readable as text.
- [ ] Complete and confirm `completedAt` and Completed status restore after restart.
- [ ] Confirm storage failure reports an error without clearing the local draft or showing a blank screen.
- [ ] Use Reset Demo Data and confirm the upcoming seed plan returns.

## Shared Player and Coach connections

- [ ] Confirm Coach Dashboard changes from plan pending to session in progress and then session completed.
- [ ] Confirm the Dashboard training task uses the shared status and drill/Session summary.
- [ ] Sign in as Ayaan and confirm Home reflects the saved date, time, ground, Coach, focus, and status.
- [ ] Confirm Player Training Schedule supports the In Progress and Completed labels.
- [ ] Confirm Player Sessions prioritizes the two assigned Sessions.
- [ ] Confirm Player Updates contains one current unread Training Plan Updated or Session Completed item and its action opens Training Schedule.

## Sticky action, responsive, and accessibility

- [ ] Confirm the sticky action sits 10 px above the Coach tab bar and never floats in the screen centre.
- [ ] Confirm Coach Note and all final content scroll completely above the sticky action.
- [ ] Verify 360×800, 390×844, 412×915, and 440×956 with no horizontal overflow.
- [ ] Confirm Training’s active pill and all five Coach tab labels remain stable.
- [ ] Confirm drill/focus/Session selected state is exposed to screen readers and is not color-only.
- [ ] Confirm controls meet practical touch sizes and progress/status are announced as text.
- [ ] Confirm reduced-motion and offline local mode remain fully usable.

## Runtime and performance

- [ ] Rapidly toggle all five drills and confirm no lag or broad app rerender is visible.
- [ ] Confirm there are no nested VirtualizedList, route, image, AsyncStorage, or provider warnings.
- [ ] Run TypeScript, lint, Expo Doctor, and Expo dependency checks successfully.
