# Player–Coach Workflow Release QA

## Terminology and navigation

- [ ] Player tabs are Home, Progress, Sessions, Updates, Profile.
- [ ] Coach tabs are Dashboard, Players, Attendance, Schedule, Profile.
- [ ] No active screen or route exposes the retired Learn or Training-tab labels.
- [ ] Academy video content uses Academy Sessions, Session Videos, Assigned Sessions, and Completed Sessions.

## Shared workflow checks

- [ ] Coach publishes a U13 schedule; Player Home and Training Schedule show the same date, time, pitch, category, and Coach.
- [ ] Coach edits or cancels a schedule; the Player schedule updates and a Schedule Change notice appears.
- [ ] Coach posts an update; it appears at the top of Player Updates with audience and creator metadata.
- [ ] Coach assigns a Session to Ayaan or U13; it appears on Player Home, Sessions > Assigned, and Player Updates.
- [ ] Coach attendance changes update Player Progress > Attendance, absence notes, and training history.
- [ ] Coach feedback and assessments update Player Home, Progress, Sessions recommendations, and Updates.

## Player checks

- [ ] Home summaries open Schedule, Attendance, Progress, Sessions, Updates, and Payments.
- [ ] Progress switches between Attendance and Performance without losing state.
- [ ] Sessions filters Assigned, All Sessions, and Completed.
- [ ] Session watch progress and completion persist.
- [ ] Payments show pending amount, due date, and chronological paid history without edit controls.

## Coach checks

- [ ] Dashboard actions are Mark Attendance, Add Schedule, Post Update, and Assign Session.
- [ ] Schedule Upcoming and History views render; Edit, Cancel, and Notify Players work.
- [ ] Standard Coach cannot post to All Players and cannot create fee reminders.
- [ ] Session assignment supports one category, one player, or selected players.

## Known frontend boundary

All records are typed, locally persisted demo data. Backend authorization, push delivery, payment administration, video upload/streaming, and multi-device synchronization remain future work.
