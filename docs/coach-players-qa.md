# Coach Players QA

## Roster and search

- [ ] Players opens with U13 selected and 20 players.
- [ ] All displays 60 unique players; U10, U13, and U15 display 20 each.
- [ ] Search matches full/partial name, GCC player ID, exact jersey number, and position.
- [ ] Clear search restores the filtered roster.
- [ ] A no-result search shows a clear empty state.
- [ ] Ayaan shows GCC-U13-024, jersey 10, 94% attendance, 4.3 rating, and Weak-foot Passing.

## Filters and sorting

- [ ] Category chips expose selected state to accessibility services.
- [ ] Present, Absent, Late, and Not Marked match the current-session status.
- [ ] U13 summary reads 16 present, 2 absent, 1 late, and 1 not marked.
- [ ] Search, category, and status filters combine correctly.
- [ ] Sort cycles through Jersey, Name, Attendance, and Rating.
- [ ] Default sort is jersey number.
- [ ] Search/filter/sort state remains after opening Player Detail and returning.

## Player cards

- [ ] Long and initial-based names render without horizontal overflow.
- [ ] Initial avatar and jersey badge remain aligned.
- [ ] Category, position, attendance, rating, focus, status, and arrow render.
- [ ] Status is communicated by text as well as color.
- [ ] Card screen-reader labels include the important football data.

## Player Detail

- [ ] Ayaan, one U10 player, and one U15 player open their own data.
- [ ] Invalid player ID shows Player not found and a safe exit.
- [ ] Identity, attendance, assessment, skills, goal, feedback, Sessions, and academy details render.
- [ ] Ayaan’s goal is Weak-foot Passing with target 100 passes and 64% progress.
- [ ] Ayaan’s assigned Session is Weak-foot Passing Drill.
- [ ] Missing assessment, feedback, or Session data uses an empty state rather than a blank card.
- [ ] Android Back returns to the prior Players state.

## Navigation handoffs

- [ ] Mark Attendance opens Coach Attendance and shows the selected player.
- [ ] Add Feedback, View Progress, and Assign Session preserve `playerId`.
- [ ] Attendance History, Full Assessment, and Feedback History preserve `playerId`.
- [ ] Goal and assigned Session actions open the correct Coach Session route.
- [ ] Invalid action and Session IDs show safe error states.
- [ ] No Coach action opens Player tabs.

## Performance and responsive checks

- [ ] FlatList scrolls smoothly through all 60 players on Android.
- [ ] No nested VirtualizedList warning appears.
- [ ] Test at 360×800, 390×844, 412×915, and 440×956.
- [ ] Search, chip rows, cards, quick-action grid, skill rows, and Sessions do not overflow.
- [ ] Final content clears the adaptive Coach tab bar.
- [ ] Keyboard does not hide search controls and dismisses on list drag.

## Accessibility

- [ ] Search and clear controls have meaningful labels.
- [ ] Filter chips expose selected state.
- [ ] Player cards and quick actions are announced as buttons.
- [ ] Attendance percentages, ratings, goal progress, and statuses are available as text.
- [ ] Touch targets remain practical at narrow widths.
- [ ] Reduced-motion mode retains all functionality.
