# Coach UX Simplification QA

## Active route checklist

- Dashboard: `/(coach)/(tabs)`
- Players: `/(coach)/(tabs)/players`
- Player Detail: `/(coach)/players/[playerId]`
- Attendance: `/(coach)/(tabs)/attendance`
- Attendance History: `/(coach)/attendance/history`
- Feedback: `/(coach)/feedback`
- Feedback History and Detail: `/(coach)/feedback/history`, `/(coach)/feedback/[assessmentId]`
- Training: `/(coach)/(tabs)/training`
- Profile: `/(coach)/(tabs)/profile`

## Dashboard and roster

- [ ] Dashboard order is Header, Today’s Session, Quick Actions, Today’s Tasks, Latest Academy Update.
- [ ] Session card contains squad, time, ground, roster count, focus, attendance, and feedback status.
- [ ] Players defaults to U13 and jersey order; search/category/status filters combine correctly.
- [ ] Player rows show one secondary metric and do not expose private or guardian data.
- [ ] Player Detail shows three quick actions, one snapshot, one goal, two feedback entries, one priority Session, and expandable More Information.

## Attendance

- [ ] P/A/L controls fit at 360 px and tapping the selected status clears it.
- [ ] Notes remain available for Absent and Late.
- [ ] Submitted unchanged state shows Edit Attendance, not Save Attendance.
- [ ] Submitted edited state shows Update Attendance.
- [ ] Sticky action never covers the last roster row or Coach tab bar.
- [ ] History is available from the header and opens a submitted session safely.

## Feedback and assessment

- [ ] Quick Feedback is default and has no large mode card.
- [ ] Header action switches between Quick Feedback and Full Assessment.
- [ ] Strength and improvement show six common choices plus Custom.
- [ ] Only three compact comment suggestions appear horizontally.
- [ ] Full Assessment period control fits on one row at 360 px.
- [ ] Six visible skill rows accept 1–5 ratings; Set all and Copy Previous work.
- [ ] One recommended goal and at most two matching Sessions are visible.
- [ ] Sticky Save/Publish remains keyboard- and safe-area-aware.

## Shared state and regression

- [ ] Saved attendance updates Coach Dashboard, Coach Player Detail, and Player attendance views.
- [ ] Quick Feedback updates Player Home, feedback timeline, and Updates.
- [ ] Full Assessment updates Player Progress without erasing prior skill data.
- [ ] Recommended Sessions appear in Player Sessions without being marked started.
- [ ] Training saves still update Dashboard, Player Home, Sessions, and Updates.
- [ ] Logout and role protection remain unchanged.

## Device, accessibility, and performance

- [ ] Verify 360×800, 390×844, 412×915, and 440×956.
- [ ] No horizontal overflow, clipped tab labels, or hidden sticky content.
- [ ] Status/rating/chip controls expose selected state and text labels.
- [ ] Validation errors and save success are announced.
- [ ] Players, Attendance, and Feedback History lists scroll without nested-list warnings.
- [ ] Rapid attendance marking remains responsive on Android.
