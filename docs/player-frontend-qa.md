# Player/Parent Frontend QA

## Feature checklist

- [ ] Fresh install opens Sign In
- [ ] Demo credentials authenticate once without double submission
- [ ] Session restores after process restart
- [ ] Logout clears the stored session
- [ ] Home, Progress, Learn, Updates, and Profile tabs open
- [ ] Learn watched/completed state restores after restart
- [ ] Update read state and tab badge restore after restart
- [ ] Notification preferences restore after restart
- [ ] English remains selected; Malayalam is labelled Coming later
- [ ] Development-only Reset Demo Data restores defaults without logout

## Route checklist

- [ ] `/`, `/progress`, `/learn`, `/updates`, `/profile`
- [ ] `/training/schedule`, `/progress/attendance`
- [ ] Valid and invalid assessment/feedback routes
- [ ] Valid and invalid lesson routes
- [ ] Valid and invalid update routes
- [ ] Fee, notifications, language, support, about, privacy, and terms
- [ ] Protected deep links resolve to Sign In when logged out
- [ ] Android Back cannot return to protected screens after logout

## Persistence checklist

- [ ] `samp.auth.session`
- [ ] `samp.learn.progress`
- [ ] `samp.updates.readState`
- [ ] `samp.settings.notifications`
- [ ] `samp.settings.language`
- [ ] Invalid JSON, unknown IDs, and old schema versions fail safely

## State and offline checklist

- [ ] Branded restoration state appears before route guards
- [ ] Offline banner appears when connectivity is lost
- [ ] Existing mock and locally persisted data remains readable offline
- [ ] Loading, empty, error, retry, and not-found states never render blank pages
- [ ] Failed lesson images load the fallback or expose Retry

## Accessibility checklist

- [ ] Inputs have labels, errors are announced, and password visibility is accessible
- [ ] Buttons, cards, switches, chips, and Back actions expose roles and labels
- [ ] Selected categories and switch values expose state
- [ ] Read, unread, pending, complete, and progress states include text
- [ ] Touch targets are approximately 44–48 px or larger

## Responsive Android checklist

- [ ] 360 × 800
- [ ] 390 × 844
- [ ] 412 × 915
- [ ] 440 × 956
- [ ] No horizontal overflow or clipped tab labels
- [ ] Keyboard does not obscure Sign In submission
- [ ] Dialogs, detail headers, charts, and final content clear system UI

## Known frontend limitations

- Authentication and all academy records are mock data.
- Lesson playback is a thumbnail-based simulated progress experience.
- Offline support is local-read continuity, not queued synchronization.
- Malayalam, online payment, receipt download, push delivery, and backend persistence require future platform work.
- Reset Demo Data is development-only and does not appear in production builds.

## APK device pass

Run the checklist on the target Samsung device using an APK/release candidate. Test a process kill, full relaunch, airplane mode, Android Back, keyboard resizing, notification switches, lesson completion, Mark All Read, logout, and protected deep links.
