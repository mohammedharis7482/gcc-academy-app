# Admin module (frontend only)

The Admin module is the academy-management role experience. It is a **frontend-only** module:
there is no backend and no API client. Everything it shows is typed local mock data, and everything
it saves is written to device storage.

Sign-in is **not** owned by this module. Player, Coach, and Admin all authenticate through the same
Sign In screen and the same `ProfileProvider` session, exactly as the Player and Coach roles always
have.

## Scope and constraints

| Constraint | How it is met |
| --- | --- |
| No backend | `services/admin-service.ts` reads a typed local directory and device storage only |
| No API calls | No `fetch`, `axios`, or network client anywhere in the module |
| No new libraries | Uses only the packages already in `package.json` |
| No real auth | `services/mock-auth-service.ts` compares against local demo accounts |
| Player and Coach behaviour unchanged | No Player or Coach screen was modified; the shared auth files gained an `admin` role but no existing branch changed |
| Reuse design tokens and components | `@/design/tokens`, `components/common/*`, `components/states/*`, `components/profile/profile-shared`, and the shared `AdaptiveTabBar` |

## Authentication and role routing

`ProfileProvider` is the single session source for all three roles. `UserRole` is
`'player' | 'coach' | 'admin'`, the admin demo account lives in `services/mock-auth-service.ts`
beside the player and coach accounts, and the stored session validator accepts all three roles so an
admin session is restored on relaunch.

The root Expo Router stack guards three mutually exclusive role families:

| Condition | Available route family |
| --- | --- |
| No session | `/(auth)` |
| `role === 'player'` | `/(tabs)` and Player detail routes |
| `role === 'coach'` | `/(coach)` |
| `role === 'admin'` | `/(admin)` |

Because the guards are mutually exclusive, the three role groups can share URLs. `(admin)` claims
`/`, `/support`, and `/announcement/new` the same way `(coach)` already shares `/` and `/profile`
with `(tabs)` — only one family is ever mounted, so only one screen can own a URL at a time. The
Admin routes therefore use their natural names; no namespacing workaround is needed.

Logout calls `ProfileProvider.logout()`, which clears the stored session. The root guard flips
immediately, `(admin)` unmounts, and Sign In is the only available route — so Android Back cannot
reopen an Admin screen, identical to Player and Coach logout.

## Route group

The module follows the same Expo Router route-group style as `(auth)`, `(tabs)`, and `(coach)`.

```text
app/(admin)/
  _layout.tsx                 Stack + AdminDataProvider
  (tabs)/
    _layout.tsx               Tabs with the shared AdaptiveTabBar
    index.tsx                 Overview
    members.tsx               Members
    coaches.tsx               Coaches
    finance.tsx               Finance
    settings.tsx              Settings
  members/[memberId].tsx      Member record
  members/new.tsx             Enrol member
  coaches/[coachId].tsx       Coach record
  coaches/new.tsx             Add coach
  squads/index.tsx            Squad list
  squads/[squadId].tsx        Squad settings and roster
  finance/[feeId].tsx         Fee record and record-payment flow
  finance/money-in.tsx        Money In list (player fees plus other income)
  finance/money-out.tsx       Money Out list, filterable by category
  finance/new-expense.tsx     Add Expense form
  finance/new-income.tsx      Add Income form
  finance/salaries.tsx        Coach salary status with a Pay action
  announcement/new.tsx        Academy announcement
  approvals.tsx               Approval queue
  reports.tsx                 Academy reports
  support.tsx                 Admin support
```

`app/(admin)/_layout.tsx` is a plain Stack wrapped in `AdminDataProvider`, mirroring
`app/(coach)/_layout.tsx`. It holds no session logic — the root layout guards the whole group.
Detail pages are stack routes so they never appear in the bottom navigation.

## Demo accounts

| Role | Account ID | Password | Signs in to |
| --- | --- | --- | --- |
| Player/Parent | `GCC-U13-024` | `demo123` | Player tabs |
| Coach | `GCC-COACH-001` | `coach123` | Coach tabs |
| Admin | `GCC-ADMIN-001` | `admin123` | Admin tabs |

All three are entered on the same Sign In screen. Player and Coach credentials live in
`config/demo.ts`; the admin credentials and admin identity (Sreerag Ambadi, Academy Owner) live in
`config/admin.ts`. They are frontend demo values only.

## Data

`data/admin.ts` derives the academy directory from the existing `sharedAcademyData` dataset, so the
Admin roster, squads, and fee amounts stay consistent with what the Player and Coach modules show.
Admin-only facts (enrolment status, guardians, billing periods, coaching staff, approvals, activity)
are added on top.

| Concern | File |
| --- | --- |
| Types | `types/admin.ts` |
| Demo configuration | `config/admin.ts` |
| Seed directory and selectors | `data/admin.ts` (members, coaches, squads, fees, expenses, incomes) |
| Local persistence | `utils/admin-storage.ts` (`samp.admin.operations`) |
| Services | `services/admin-service.ts` |
| State | `contexts/admin-data-context.tsx` |
| Player feed bridge | `contexts/admin-announcements-context.tsx` (root layout) |
| Tokens | `design/tokens/admin.ts` (`adminLayout`, `adminTabBarMetrics`) |

The admin session is **not** stored here. It lives under the shared `samp.auth.session` key with the
Player and Coach sessions. `samp.admin.operations` holds only academy changes, so a logout clears the
session while recorded payments, approvals, and enrolments survive.

`AdminDataProvider` is mounted inside `app/(admin)/_layout.tsx` rather than the root layout, so the
Player and Coach trees carry no extra providers.

### Read model

`AdminDataProvider` merges the seed directory with the operations saved on the device and exposes one
consistent state to every screen:

- a recorded payment marks its fee record paid and clears the member's outstanding balance
- an approved enrolment request moves a trial member to active
- an approved squad transfer moves the member, category, and monthly fee to the target squad
- an approved fee concession reduces the current-period fee amount
- a squad override changes the head coach, batch, ground, fee, or enrolment status
- new members, new coaches, and announcements are appended to the directory
- a recorded expense raises Money Out and lowers Net for its period
- a recorded other-income entry raises Money In and Net
- paying a coach salary adds a Coach Salary expense, which marks that salary paid

Overview, collection summary, money summary, expense breakdown, coach salaries, and squad reports are
all derived from that merged state, so a recorded payment, expense, or salary is visible on Overview,
Finance, Money In, Money Out, Coach Salaries, Reports, the member record, and the squad roster at
once.

## Money In and Money Out

Finance covers both directions in plain language: **Money In**, **Money Out**, **Net**, **Pending**,
and **Paid**. There is no double-entry, no journal, no ledger, and no tax handling.

| Concept | Meaning |
| --- | --- |
| Money In | Player fees actually collected in the period, plus other income |
| Other income | Camp Fees, Tournament Fees, Sponsorship, Merchandise, Other |
| Money Out | Every expense recorded against the period |
| Expense categories | Coach Salary, Ground Rent, Equipment, Transportation, Tournament, Events, Marketing, Maintenance, Office, Other |
| Net | Money In minus Money Out |

Each expense records a category, amount, date, who it was paid to, a payment method
(Cash / Bank Transfer / UPI), a note, and who recorded it. Other income has the same shape with
"received from" in place of "paid to".

### Coach salaries

Every coach carries a `monthlySalary`. The Coach Salaries screen lists each coach's status for the
selected period as Pending or Paid.

**Paying a salary writes exactly one record: a Coach Salary expense tagged with that coach's id.**
The salary status is then read back from that expense, so the salary screen and Money Out are the
same fact viewed two ways and cannot drift apart. Seed salaries for May and June exist as expenses,
which is why those periods show as paid; July starts unpaid so the Pay action has work to do.

Records are stamped with the scripted demo date from `config/admin.ts`, never the device clock.

## Announcements reach the Player Updates feed

An Admin announcement is written into the shared Player Updates feed through a fourth sync channel,
added alongside the three that already existed in `contexts/updates-context.tsx`:

| Channel | Id prefix |
| --- | --- |
| Coach assessments | `coach-assessment-update-` |
| Coach training plans | `coach-training-update-` |
| Coach operations | `coach-operation-update-` |
| Admin announcements | `admin-announcement-update-` |

Each channel replaces only the updates carrying its own prefix, so the four merge without
overwriting one another or the seeded academy updates.

### Where the bridge lives, and why

`AdminAnnouncementsProvider` (`contexts/admin-announcements-context.tsx`) sits in the **root layout**,
inside `UpdatesProvider`, not inside `(admin)`.

That placement is deliberate. `AdminDataProvider` is mounted inside `app/(admin)/_layout.tsx`, which
is unmounted whenever a player is signed in — and the player is the audience. Syncing from there
alone would never reach them. The bridge mirrors `AcademyOperationsProvider`, which is in the root
layout for exactly the same reason and carries Coach announcements the same way.

The bridge reads `samp.admin.operations` on mount and whenever the signed-in account changes, and
`AdminDataProvider` calls its `refresh()` after publishing, so a new announcement appears without an
app restart. It holds no state that any Player or Coach screen consumes.

This is a deliberate exception to the CLAUDE.md rule that role-specific providers mount inside their
own group layout. It is not a role provider: its audience is the Player feed, and the Announcement
chain in CLAUDE.md §8 ("Author posts → audience targeting → recipients see it") cannot complete from
inside `(admin)`. `AcademyOperationsProvider` is the existing precedent for the same trade-off.

### Audience targeting

| Audience | Reaches |
| --- | --- |
| `all-players` | Every player |
| `selected-categories` | Only players whose own category is in `categoryIds` |
| `coaches` | Nobody in the Player feed; stays in the Admin log |

The player's categories come from their `ProfileProvider` session (`categoryIds`), so a U13 player
sees a U13-targeted announcement but not one aimed at U10 and U15.

The announcement form picks an `AcademyUpdateCategory` (General Notice, Match, Camp, Holiday,
Schedule Change, Academy Event, Payment Reminder), which is the label the Player feed files it
under. Announcements saved before that field existed fall back to General Notice.

Unread counts, individual mark-as-read, and Mark All Read work on these exactly as on any other
update, and the read state persists under the existing `samp.updates.readState` key.

## Flows

1. **Sign in** — `GCC-ADMIN-001` / `admin123` on the shared Sign In screen opens the Admin tabs; the session is restored on relaunch.
2. **Overview** — academy snapshot, member/coach/attendance/approval metrics, fee collection, quick actions, pending approvals, recent activity.
3. **Members** — search by name, ID, guardian, or squad; filter by category and enrolment; open a member for billing, training, enrolment, guardian, and fee history.
4. **Enrol member** — squad, name, age, position, plan, enrolment type, and guardian details; capacity is enforced and a jersey number is allocated.
5. **Coaches** — workload summary, uncovered-squad warning, search and engagement filter, coach records with assigned squads.
6. **Add coach** — role, engagement, multi-squad assignment, contact details.
7. **Finance** — billing period selector, Money In / Money Out / Net summary, quick actions for Add Expense and Coach Salaries, collection card, squad collection report, fee list filtered by status, and a fee record with a Record Payment flow.
8. **Money Out** — period selector, spend by category, search and category filter, full expense list, and Add Expense.
9. **Add Expense** — category, amount, paid to, payment method, and note; saved against the current period.
10. **Coach Salaries** — period selector, pending and paid totals, payment method, and a Pay action per coach that also records Money Out.
11. **Money In** — period selector, Money In / fees / other income / Net metrics, source filter, a combined list of collected fees and other income, and Add Income.
12. **Add Income** — category (Camp Fees, Tournament Fees, Sponsorship, Merchandise, Other), amount, received from, payment method, and note; saved against the current period.
13. **Post Announcement** — category, audience, priority, title, and message; player-facing announcements appear in the Player Updates tab.
14. **Reports** — money summary, Money Out by category, billed/collected/outstanding/capacity, squad performance, enrolment mix, and squad attendance per period.
15. **Approvals** — pending, approved, and declined queues with a confirmation dialog on each decision.
16. **Squads** — capacity bars, head coach reassignment, enrolment status, schedule, and roster.
17. **Logout** — clears the shared session and returns to Sign In; Android Back cannot reopen Admin screens.

## Shared files this module touches

The Admin module is otherwise self-contained. These shared files carry the role wiring:

| File | Change |
| --- | --- |
| `types/profile.ts` | `UserRole` gained `'admin'` |
| `services/mock-auth-service.ts` | Admin demo account added beside player and coach |
| `contexts/profile-context.tsx` | Stored-session validator accepts the `admin` role |
| `app/_layout.tsx` | `Stack.Protected` branch for `(admin)` |
| `app/(auth)/sign-in.tsx` | Field label reads "Academy account ID"; the `__DEV__` hint lists the admin account |
| `types/updates.ts` | New `sync-admin-announcement-updates` action |
| `contexts/updates-context.tsx` | Fourth prefix-keyed sync channel for Admin announcements |
| `app/_layout.tsx` | `AdminAnnouncementsProvider` mounted inside `UpdatesProvider` |

No Player or Coach screen was modified. `contexts/updates-context.tsx` gained a fourth channel
alongside its existing three; the three are untouched and each channel is isolated by id prefix.

## Known limitations

- Admin announcements reach the Player Updates feed but are not delivered as push notifications;
  there is no notification transport in this build.
- Attendance percentages and squad training data are read-only in the Admin module; attendance is
  still owned by the Coach module.
- Fee amounts, coach salaries, periods, and the academy timeline are fixed demo values from
  `config/admin.ts` and `data/admin.ts`.
- Expenses and other income are always recorded against the current period; there is no back-dating,
  editing, or deleting in this build.
- `utils/app-storage.ts`'s `clearDemoStorage` does not clear `samp.admin.operations`; the Admin
  module exposes `clearAdminStorage` for that.
- `README.md` and `docs/DEMO_CREDENTIALS.md` still list two demo accounts and do not mention the
  admin account.
