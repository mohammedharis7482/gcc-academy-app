# User Flows

## Authentication and role routing

1. Launch the app.
2. The stored session is restored before routing.
3. An unauthenticated user sees Sign In.
4. A valid Player account opens the Player tabs; a valid Coach account opens the Coach tabs.
5. Logout clears the session and replaces the authenticated route with Sign In.

Android Back cannot reopen protected screens after logout. Direct access to a route owned by the other role is rejected by the protected root stack.

## Player/Parent demonstration flow

### Home to training

`Sign In → Home → Next Training → Training Schedule → Back`

Verify the Saturday U13 session, time change, ground, coach, and upcoming schedule.

### Academy Sessions

`Home → Assigned Session → Ball Control Basics → Continue/Mark Complete → Back → Sessions`

Session state is shared: completing a Session removes it from Continue Watching and adds it to Completed Sessions. Search and category filtering work together.

### Progress

`Home → View Full Progress → Attendance → Back → Feedback/Assessment → Recommended Session`

The Weak-foot Passing goal opens Weak-foot Passing Drill. Assessment and feedback IDs resolve to their matching details.

### Updates

`Home notification → Updates → Open update → Contextual action → Back`

Opening an update marks it read. Mark All Read clears the unread badge. Training, progress, Session development, and fee updates open their correct destinations.

### Profile and logout

`Profile → Fee Details → Settings/Support/About/Legal → Back → Logout`

Cancel keeps the session active. Confirm clears the session and returns to Sign In.

## Coach demonstration flow

### Roster and player detail

`Coach Sign In → Dashboard → Players → Search/filter → Ayaan Mohammed`

Verify Player detail data matches the Player account: ID, jersey, attendance, rating, goal, assessment, and Sessions.

### Attendance

`Dashboard/Attendance tab → U13 session → Mark statuses → Save Attendance → History`

Use Mark All Present for speed, adjust individual statuses, optionally add an absence/late note, then save. Submitted attendance persists and updates connected Player views.

### Quick feedback

`Dashboard Add Feedback → Select player → Quick Feedback → Save`

Choose one strength and improvement area, add a concise comment, optionally recommend a Session, and save. Player Home feedback and Updates change immediately.

### Full assessment

`Player Detail Add Feedback → Full Assessment → Rate skills → Goal/Academy Sessions → Publish`

Publishing updates Coach Player Detail and Player Progress without replacing skill ratings with Quick Feedback records.

### Training plan

`Schedule tab → Open Session Plan → Activities/Focus/Academy Sessions/Notes → Save`

The saved plan updates Coach dashboard status and connected Player Session development/update content.

## Shared-state checks

- Coach attendance submission appears in Player attendance history.
- Coach assessment publishing updates Player Progress skill ratings.
- Coach feedback updates Player Home and the feedback timeline.
- Assigned Sessions use existing Sessions Session IDs and do not duplicate Session content.
- Training completion updates Coach dashboard activity.
- State remains available after restarting the app on the same device.
