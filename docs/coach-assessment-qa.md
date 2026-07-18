# Coach Assessment and Feedback QA

## Routes and player selection

- [ ] Dashboard Add Feedback opens `/(coach)/feedback` with Quick Feedback selected.
- [ ] Player Detail Add Feedback opens the same route with the correct `playerId` already selected.
- [ ] Recent Players includes Ayaan Mohammed, Farhan Ali, Arjun Raj, and Nihal K.
- [ ] Search matches player name, ID, jersey number, and position.
- [ ] U10, U13, U15, and All filters work with search.
- [ ] Invalid `playerId` shows a safe Player not found state.
- [ ] Player accounts cannot enter Coach feedback routes.

## Quick Feedback

- [ ] Quick Feedback is the default mode.
- [ ] Exactly one strength and one improvement area can be selected.
- [ ] Custom selection reveals one short, labeled input only when selected.
- [ ] Comment suggestions populate the comment and remain editable.
- [ ] Comment input stops at 240 characters.
- [ ] Improvement selection displays relevant real Sessions Sessions.
- [ ] No matching Session displays a clear optional empty state.
- [ ] A maximum of two Sessions can be selected.
- [ ] Save rejects missing required fields and announces the validation message.
- [ ] Save publishes once even after rapid repeated taps.

## Full Assessment

- [ ] Mode switches between Quick and Full without route changes.
- [ ] Monthly Review is the default period; all four period choices work.
- [ ] Every skill exposes 1–5 and the selected rating meaning.
- [ ] Set all On Track sets all seven skills to 3.
- [ ] Copy Previous restores all available previous ratings and is disabled when none exist.
- [ ] Goal presets select and deselect correctly.
- [ ] Review summarizes player, period, ratings, strength, improvement, comment, goal, and Sessions.
- [ ] Publish is only available after the review step.

## Persistence and history

- [ ] Quick Feedback and Full Assessment survive an Expo Go restart.
- [ ] Invalid stored player/Session IDs are ignored safely.
- [ ] Storage failure reports that the record is session-only and does not blank the form.
- [ ] Feedback History uses a FlatList and filters All, Quick, Full, U10, U13, and U15.
- [ ] History rows open the matching record and invalid IDs show a recovery action.
- [ ] Developer Reset Demo Data removes Coach-created records and restores seeded history.

## Unsaved changes

- [ ] Header Back with edits shows Discard unsaved feedback.
- [ ] Android Back with edits shows the same warning.
- [ ] Continue editing retains every field.
- [ ] Discard performs the original back action once.
- [ ] Changing player with edits requires confirmation.
- [ ] No warning appears before any form field changes.

## Connected Coach screens

- [ ] Dashboard pending feedback decreases once per newly assessed player, from four toward zero.
- [ ] Dashboard Recent Player Feedback displays the latest Coach-created item first.
- [ ] Feedback History action opens the history route.
- [ ] Coach Players reflects the latest full rating and current focus.
- [ ] Coach Player Detail updates assessment, all seven skills, goal, recent feedback, and assigned Sessions.
- [ ] Full Assessment and View Progress open the correct Coach assessment record.

## Connected Player screens

- [ ] Ayaan Quick Feedback replaces Player Home Latest Coach Feedback.
- [ ] Home View Report opens the matching Quick Feedback or Full Assessment detail.
- [ ] Full Assessment updates Progress score and skill rows.
- [ ] Quick Feedback adds to the feedback timeline without erasing full skill ratings.
- [ ] Development goal updates Current Goal.
- [ ] Recommended Session opens the exact shared Sessions ID.
- [ ] Player Sessions recommendations place coach-selected Sessions first without changing watched/completed state.
- [ ] Publishing creates one unread Player Update with the correct action target.
- [ ] Update tab badge increments; opening the update marks it read.

## Responsive, accessibility, and performance

- [ ] Test 360×800, 390×844, 412×915, and 440×956.
- [ ] Mode cards, chips, rating controls, comment field, Session cards, review, and save area never overflow.
- [ ] Keyboard does not hide the comment or save action.
- [ ] Ratings and chips expose role, selected state, value, and readable labels.
- [ ] Validation and success are announced without relying on color.
- [ ] Player selection and history FlatLists have stable keys and no nested-list warning.
- [ ] Rapid rating and chip taps remain responsive on an average Android device.
- [ ] Reduced-motion settings preserve all form behavior.
