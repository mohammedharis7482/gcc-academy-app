# Coach module plan

## Coach UX principles

- Put the next operational action before secondary information.
- Keep common training-ground tasks reachable within one or two taps.
- Use high-contrast, outdoor-readable labels and practical touch targets.
- Keep the Coach experience compact and avoid Player-style analytical depth.
- Reuse GCC typography, color, radius, border, motion, and safe-area systems.

## Phase C1 route and tab map

| Area | Route | Purpose |
| --- | --- | --- |
| Coach stack | `/(coach)` | Role-protected Coach route group |
| Dashboard | `/(coach)/(tabs)` | Today’s training, actions, attendance, squads, tasks, feedback, update |
| Players | `/(coach)/(tabs)/players` | U13 squad and player preview |
| Attendance | `/(coach)/(tabs)/attendance` | Read-only current attendance status |
| Training | `/(coach)/(tabs)/training` | Current session and plan preview |
| Profile | `/(coach)/(tabs)/profile` | Coach identity, assignment, support, logout |
| Update | `/(coach)/update` | Role-safe academy update detail |
| Support | `/(coach)/support` | Role-safe academy contact actions |

The adaptive Coach tabs are Dashboard, Players, Attendance, Training, and Profile. Detail routes are owned by the Coach stack and never appear as tabs.

## Dashboard structure

1. Coach header
2. Today’s Training
3. Quick Actions
4. Attendance Status
5. Assigned Squads
6. Pending Tasks
7. Recent Player Feedback
8. Latest Academy Update
9. Coach adaptive pill navigation

Every active Dashboard action has a Coach-owned destination. Attendance, feedback, and training-plan actions now open their completed Coach workflows.

## Role authentication

- `GCC-U13-024` with `demo123` creates a Player session.
- `GCC-COACH-001` with `coach123` creates a Coach session.
- Credentials map to roles automatically; there is no role picker.
- The single stored session includes a schema version, user ID, role, display name, academy ID, and role assignment IDs.
- Legacy stored Player sessions are migrated to role `player` without clearing Sessions, Updates, or settings state.
- Logout removes the shared session. Protected routes then expose only Sign In, preventing Android Back from reopening protected tabs.

## Shared Player–Coach data flow

`AcademyDataProvider` exposes typed read access to the academy, squads, roster, current session, attendance, assessments, feedback, assigned Sessions, academy updates, fees, and Coach tasks. Phase C1 uses static mock data and does not pretend to synchronize edits.

Future write paths:

- Coach Attendance → shared attendance service/state → Player attendance summary
- Coach Feedback → shared assessment/feedback service/state → Player Home and Progress
- Coach Training Plan → shared training service/state → Player Home and schedule
- Coach Session Assignment → training-plan selectors → Player Sessions recommendations

These should become API-backed domain services when Django integration begins. Avoid one global mutable context; split write-heavy attendance, feedback, training, and assignment domains as their workflows are implemented.

## Scope and future phases

- **C1 (complete):** role auth, route protection, Coach navigation, dashboard, typed shared read model, useful tab previews.
- **C2 (complete):** 60-player roster search, category/status filters, sorting, Coach player detail, and typed future-workflow handoffs.
- **C3 (complete):** fast squad attendance, draft protection, persistence, history, and shared Player/Coach summaries.
- **C4 (complete):** Quick Feedback, Full Assessment, validation, persistence, history, and shared Player/Coach effects.
- **C5 (complete):** fixed-order drill plan, session completion state, objectives, Coach notes, and Sessions Session assignment.
- **C6 (release gate pending):** final Player–Coach device QA and frontend freeze. Backend integration, server authorization, conflict handling, audit history, and production notifications remain later work and are not part of the frontend freeze.

### Final integration status

C1–C5 are implemented in the active Expo Router files. The shared attendance, assessment, training-plan, Sessions, Updates, settings, and auth providers are connected across the Player and Coach route families. Automated validation and Android export are required before C6 can be marked complete; physical Android testing remains a separate mandatory release gate.

## Mock and backend-dependent limitations

- Coach and Player credentials are local demo credentials.
- The 60-player roster and operational counts are mock data.
- Attendance, feedback, and training plans persist locally on the current device.
- Data does not synchronize between devices or roles.
- Support contacts remain demo values.
- Production role authorization must be enforced by the backend, not only by frontend route guards.

## Phase C2 — Players and Player Detail

Phase C2 replaces the Players preview with an operational 60-player roster and role-safe Coach player detail flow.

### Routes

| Screen | Route |
| --- | --- |
| Players tab | `/(coach)/(tabs)/players` |
| Player Detail | `/(coach)/players/[playerId]` |
| Future action handoff | `/(coach)/players/[playerId]/action/[action]` |
| Role-safe Session detail | `/(coach)/sessions/[sessionId]` |

Player Detail contains identity, quick actions, attendance, assessment, six skill rows, current goal, recent feedback, assigned Sessions, and academy metadata. Unknown player, action, and Session IDs show safe error states.

### Roster design

The shared academy dataset contains 20 unique players each for U10, U13, and U15. Names deliberately mix Kerala/Indian Muslim, Hindu, and Christian naming patterns, including initials and full names. Player data contains football and academy fields only; guardian contact data is not included in Coach roster cards.

Ayaan uses the existing Player demo configuration, Progress ratings, assessment IDs, feedback IDs, and Sessions Session IDs. Pure lookup helpers provide roster, category, search, attendance, assessment, feedback, and Session relationships without side effects.

### C3/C4/C5 handoffs

- Mark Attendance and Attendance History open the C3 Coach Attendance tab with `sessionId` and `playerId` focus.
- Add Feedback, Feedback History, Assessment, and Progress preserve `playerId` for Phase C4.
- Assign Session preserves `playerId` for Phase C5.
- Assigned Sessions open a Coach-owned Session detail using the real shared Sessions `lessonId`.

The handoff screens do not simulate edits or submission. Their purpose is to validate route ownership and parameter continuity before write workflows exist.

### C2 limitations

- Roster data is local mock data.
- Avatar rendering uses stable initials because individual approved player photographs are unavailable.
- Attendance, feedback, assessment, and Session assignment remain read-only or prepared handoffs.
- Search, filters, and sort state persist while Player Detail is pushed because the Players tab remains mounted; they are not stored across app restarts.

## Phase C3 — Fast Attendance

### Scope and route flow

The active workflow remains the Coach Attendance tab at `/(coach)/(tabs)/attendance`. It accepts optional `sessionId` and `playerId` parameters. Dashboard actions pass the current U13 session; Player Detail passes the appropriate U10, U13, or U15 session plus a focused player. Invalid parameters show recoverable states and Coach route protection remains owned by the root protected stack.

The screen provides a compact session selector rather than a calendar. The demo includes current/upcoming/recent U10, U13, and U15 sessions assigned to Coach Sandeep.

### Shared state flow

`AttendanceProvider` owns two deliberately separate context values:

- Draft state contains the selected session, editable entries, dirty state, note edits, and save status. Rapid status taps do not notify Player or Dashboard consumers.
- Submitted data contains restored records and typed selectors for session totals, player totals, current status, and history. It changes only after a successful save.

The existing academy player attendance counts are the historical baseline. Submitted records apply status deltas against seeded history, so Ayaan begins at 94% and later Coach submissions adjust the percentage logically. Home, Progress, Player Attendance Detail, Coach Dashboard, Players, and Coach Player Detail read the submitted selectors.

### Persistence and save rules

- Submitted records use the versioned `samp.attendance.records` AsyncStorage key.
- Stored records are validated, restricted to known session/squad/player IDs, and completed with safe Not Marked entries when needed.
- Draft animation/UI state is never stored.
- Save is guarded against double submission and only updates shared data after device persistence succeeds.
- An incomplete roster may be saved after explicit confirmation.
- Mark All Present only asks before replacing Absent or Late selections.
- Reset always requires destructive confirmation.
- Absence/late notes are optional, private to Coach views, limited to 80 characters, and removed when status changes to Present or Not Marked.

### Unsaved-change handling

Session switches, Coach tab changes, and Android Back show Continue Editing, Discard Changes, and Save Attendance whenever the draft differs from its last loaded/submitted baseline. The Coach tab bar owns tab-switch interception; the Attendance route owns session-switch and hardware-back interception.

### Player and Dashboard effects

- Dashboard status, marked count, task state, and Take/View Attendance label derive from the current submitted record.
- Coach Player Detail and Players derive current status, last recorded date, and recalculated percentage.
- Player Home and Progress derive their attendance percentage from the same selector.
- Player Attendance Detail merges submitted sessions into the existing deterministic history without exposing private Coach notes.

### C3 frontend limitations

- Attendance is local to one device and has no multi-coach conflict resolution.
- There is no backend authorization, audit log, QR, GPS, or guardian notification.
- Session definitions are typed demo data rather than API/calendar records.
- Submitted attendance can be reopened and edited for MVP testing.

## Phase C4 — Assessment and Feedback

### Scope and routes

| Screen | Route | Purpose |
| --- | --- | --- |
| Feedback entry | `/(coach)/feedback` | Recent-player selection, search, Quick Feedback, and Full Assessment |
| Feedback history | `/(coach)/feedback/history` | Filterable published assessment history |
| Assessment detail | `/(coach)/feedback/[assessmentId]` | Read-only Coach assessment/feedback record |

Dashboard Add Feedback opens the entry route without a player. Player Detail Add Feedback passes `playerId`, bypassing selection. Unknown player or assessment IDs render safe recovery states. All routes remain inside the role-protected Coach stack and never appear as tabs.

### Quick Feedback flow

Quick Feedback is the default and requires one strength, one improvement area, and a coach comment. Strength and improvement use six common single-select presets with an optional Custom field. Three horizontally scrolling comment suggestions reduce typing. A coach can optionally recommend up to two existing Sessions Sessions. Skill ratings are intentionally omitted, allowing completion in roughly 30–45 seconds.

### Full Assessment flow

Full Assessment adds a compact period selector and six visible one-tap core skill ratings. `Set all to 3` initializes the visible ratings; `Copy Previous` restores the player’s latest full ratings when available. The coach sees one improvement-matched goal at a time and up to two matching Sessions. Publishing happens from one sticky action on the single scrollable form; the stored Discipline value remains compatible with existing Player progress records without adding a seventh visible form row.

### Shared state and persistence

`AssessmentProvider` owns the published Coach records and exposes typed player/record selectors. It deliberately does not own the transient form draft, preventing every rating tap from rerendering Player, Dashboard, Updates, and Sessions consumers. Records are schema-validated, restricted to known players/Sessions, versioned through the shared storage envelope, and stored under `samp.assessments.records`.

Publishing derives connected UI rather than copying mutable records:

- Coach Dashboard pending feedback count and recent activity
- Coach Players rating/focus and Player Detail assessment, skills, goal, feedback, and Sessions
- Player Home latest feedback and coach rating
- Player Progress ratings, feedback timeline, goal, and recommended Session
- Player Sessions goal recommendations without marking a Session started
- Player Updates unread assessment/feedback notices and tab badge

Only Ayaan’s Coach record creates an update in the current Player demo session. Other roster feedback remains Coach-visible, avoiding cross-player data leakage.

### Save, validation, and unsaved changes

- Quick Feedback requires player, strength, improvement area, and a comment of at most 240 characters.
- Full Assessment additionally requires all six visible core ratings and a period.
- Session selection is capped at two and uses existing Sessions IDs only.
- A save lock prevents duplicate publication.
- Android Back, header Back, and player changes warn before discarding dirty form state.
- Device persistence failure keeps the just-published record available in memory and reports the limitation.
- Developer Reset Demo Data removes Coach-created assessment records and restores seeded history.

### C4 frontend limitations

- Records are local to one device and have no multi-coach conflict resolution or server audit trail.
- Push notifications are represented by a local unread Updates record only.
- Custom goal authoring and draft persistence are intentionally deferred; goal presets cover the MVP.
- Session recommendation uses deterministic improvement-area mapping, not AI.
- Backend authorization must validate Coach/player/squad relationships before production writes.

## Phase C5 — Coach Session Plan Workspace

### Scope and route

The Session Plan workspace remains available at `/(coach)/(tabs)/training`, but is deliberately hidden from the five-item Coach tab bar. Coaches reach it from Schedule through **Open Session Plan**. It is a compact workspace, not a calendar or planning ERP: page header, Today’s Session, Session Plan, Focus Areas, Assigned Academy Sessions, Coach Note, and one sticky action. There is no history, drag-and-drop, drill editor, or duplicated status selector.

The shared `training-1` record represents the U13 Development Squad session on Saturday, 11 July 2026. Its fixed plan is Warm-up, First Touch, Passing, Small-sided Game, and Cool Down. Coaches may select at most three focus areas, assign at most two existing Sessions Sessions, and add an optional 200-character note.

### Session-state flow

- Upcoming → `Start Session` persists the In Progress state.
- In Progress with local edits → `Save Session` persists the draft.
- In Progress without local edits → `Complete Session` shows the attendance, drill, Session, and feedback summary, then persists completion.
- Completed → controls are read-only until the Coach intentionally chooses `Edit Session`.
- Completion does not require all drills, Sessions, attendance, or feedback to be finished.

Draft interactions stay in the route. The shared context changes only after a successful save, keeping drill taps scoped to the Training screen. The versioned `samp.training.plans` AsyncStorage record restores drill state, focus, assigned Session IDs, note, status, and `completedAt`; legacy C5 drill metadata is normalized to the current fixed plan during restore.

### Shared connections

- Coach Dashboard reads Upcoming, In Progress, saved, and Completed status directly from `TrainingPlanProvider`.
- Player Home reads session date, time, ground, Coach, focus, and status from the same plan.
- Player Training Schedule reads the same session and supports the In Progress state.
- Player Sessions prioritizes the two saved assigned Session IDs without marking them started.
- Player Updates receives one current unread Training Plan Updated or Session Completed record, not one update per draft toggle.
- Developer Demo reset restores the seeded training workspace.

### C5 frontend limitations

- Only the current U13 demo session is editable; session creation and a calendar are intentionally deferred.
- Data is local to one device with no multi-coach conflict resolution or backend audit log.
- Player Updates is a local unread record rather than a production push notification.
- Session matching is deterministic against the existing Sessions library; no Session upload or AI planning is included.

## Coach UX simplification pass

The active Coach routes now share the `coachLayout` density tokens: 16 px page padding, 14 px page top, 18 px header clearance, 20 px section gaps, 10 px card gaps, and 14 px card padding. Dashboard repeats were merged into Today’s Session, roster cards were reduced to operational identity/status data, and Player Detail now presents one snapshot before secondary information.

Attendance history moved to `/(coach)/attendance/history`. Working attendance keeps one state-aware sticky action: Save for a new draft, Edit for an unchanged submission, and Update only after submitted data changes. Roster rows expose Present, Absent, and Late directly; tapping the selected value clears it and notes remain available for Absent/Late.

Quick Feedback and Full Assessment use the page header as their only mode switch. Both keep a single sticky save action, with content clearance calculated from the same shared sticky-action component. The simplification changes presentation only: Attendance, Assessment, Training, Sessions recommendations, Player Updates, and Dashboard status still derive from the same persisted shared contexts.
