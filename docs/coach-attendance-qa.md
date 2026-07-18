# Coach Attendance QA

## Sessions and routing

- [ ] Coach Attendance opens with `training-1`, U13 Development Squad, and 20 players.
- [ ] The session selector shows current/upcoming/recent U10, U13, and U15 sessions.
- [ ] Dashboard Take/Continue/View Attendance opens `training-1`.
- [ ] Player Detail opens the correct squad session and highlights the selected player.
- [ ] Unknown `sessionId` and `playerId` parameters show recoverable errors.
- [ ] Player accounts cannot enter Coach attendance routes.

## Status workflow

- [ ] P, A, L, and Clear set Present, Absent, Late, and Not Marked in one tap.
- [ ] Selected state is unmistakable and announced by accessibility services.
- [ ] Live totals and marked progress update immediately.
- [ ] Status and search filters preserve all hidden draft changes.
- [ ] Search matches partial name, full player ID, and exact jersey number.
- [ ] Rapidly mark all 20 players without lag or missed taps.

## Bulk actions and notes

- [ ] Mark All Present needs no confirmation on a completely unmarked roster.
- [ ] Mark All Present confirms before replacing Absent or Late values.
- [ ] Reset always confirms and returns every player to Not Marked.
- [ ] Absent and Late expose an optional note action.
- [ ] Note text is limited to 80 characters and survives filtering/session draft state.
- [ ] Changing a noted entry to Present or Not Marked removes the private note.
- [ ] Coach notes do not appear in Player Home or Player Attendance Detail.

## Unsaved changes

- [ ] Switching session with edits shows Unsaved Attendance.
- [ ] Switching Coach tabs with edits shows Unsaved Attendance.
- [ ] Android Back with edits shows Unsaved Attendance.
- [ ] Continue Editing stays on the draft.
- [ ] Discard restores the last submitted/loaded baseline and continues navigation.
- [ ] Save persists once and continues navigation only after success.
- [ ] No warning appears when the draft is unchanged.

## Save and persistence

- [ ] Save with all players marked succeeds without an extra incomplete warning.
- [ ] Save with unmarked players asks for confirmation.
- [ ] A rapid double tap creates one submitted record.
- [ ] Success feedback shows the exact saved totals.
- [ ] Reopening the session restores submitted statuses and notes.
- [ ] Restarting Expo Go restores the submitted record and completed Dashboard state.
- [ ] Invalid stored session/player IDs are ignored safely.
- [ ] Storage failure leaves the draft visible with a retryable error.
- [ ] Developer Reset Demo Data restores seeded attendance without signing out.

## Connected screens

- [ ] Dashboard attendance card becomes Completed and action becomes View Attendance.
- [ ] Dashboard attendance task becomes completed with the saved count.
- [ ] Coach Players cards use the submitted current-session status.
- [ ] Coach Player Detail uses submitted status, last date, and recalculated percentage.
- [ ] Player Home and Progress show the recalculated percentage after role change/restart.
- [ ] Player Attendance Detail contains the submitted session and updated counts.
- [ ] Seeded 8 July history is replaced rather than duplicated for Ayaan.

## Responsive, accessibility, and performance

- [ ] Test 360×800, 390×844, 412×915, and 440×956.
- [ ] Session cards, five summary metrics, status controls, sticky save, and dialogs do not overflow.
- [ ] Long names use two lines without colliding with status or note actions.
- [ ] The sticky save area sits above the adaptive Coach tab bar and final roster rows clear both.
- [ ] Note keyboard does not hide the dialog actions.
- [ ] Search/filter/status controls expose role, label, and selected state.
- [ ] Summary and player status are understandable without color.
- [ ] FlatList produces no nested-list, key, or clipping warnings.
- [ ] Reduced-motion mode retains all status and navigation behavior.
