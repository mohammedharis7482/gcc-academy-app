# Admin module (frontend only)

The Admin module is the academy-management role experience. It is a **frontend-only** module:
there is no backend, no API client, and no real authentication. Everything it shows is typed
local mock data, and everything it saves is written to device storage.

It was added without modifying a single existing file. `git diff` against the commit that
introduced it touches no Player file, no Coach file, and no shared file — only new files are added.

## Scope and constraints

| Constraint | How it is met |
| --- | --- |
| No backend | `services/admin-service.ts` reads a typed local directory and device storage only |
| No API calls | No `fetch`, `axios`, or network client anywhere in the module |
| No new libraries | Uses only the packages already in `package.json` |
| No real auth | `services/admin-auth-service.ts` compares against a local demo account |
| Existing Player/Coach files untouched | Every Admin file is new; shared components are imported, never edited |
| Reuse design tokens and components | `@/design/tokens`, `components/common/*`, `components/states/*`, `components/profile/profile-shared`, and the shared `AdaptiveTabBar` |

## Route group

The module follows the same Expo Router route-group style as `(auth)`, `(tabs)`, and `(coach)`.

```text
app/(admin)/
  _layout.tsx                 Stack + Admin providers + protected branches
  admin-sign-in.tsx           Mock admin gate            -> /admin-sign-in
  (tabs)/
    _layout.tsx               Tabs with the shared AdaptiveTabBar
    overview.tsx              Overview                   -> /overview
    members.tsx               Members                    -> /members
    coaches.tsx               Coaches                    -> /coaches
    finance.tsx               Finance                    -> /finance
    settings.tsx              Settings                   -> /settings
  members/[memberId].tsx      Member record
  members/new.tsx             Enrol member
  coaches/[coachId].tsx       Coach record
  coaches/new.tsx             Add coach
  squads/index.tsx            Squad list
  squads/[squadId].tsx        Squad settings and roster
  finance/[feeId].tsx         Fee record and record-payment flow
  announcements/new.tsx       Academy announcement       -> /announcements/new
  approvals.tsx               Approval queue
  reports.tsx                 Academy reports
  admin-support.tsx           Admin support              -> /admin-support
```

### Why the route names are namespaced

A route group contributes no URL segment, so `(admin)/…` files compete for the same URLs as
`(auth)/…`, `(tabs)/…`, and `(coach)/…`. The Player and Coach groups can share URLs such as `/` and
`/profile` because the root layout declares them inside mutually exclusive `Stack.Protected`
branches. `(admin)` is not declared in the root layout — that file was left untouched — so its
routes are always mounted and must not claim a URL another module already owns.

Four names are therefore namespaced: the tab entry is `overview.tsx` rather than `index.tsx` (so it
never claims `/`), the gate is `admin-sign-in.tsx` rather than `sign-in.tsx`, support is
`admin-support.tsx`, and the announcement form lives under `announcements/` rather than the Coach
module's `announcement/`. Every other Admin URL is already unique.

`app/(admin)/_layout.tsx` uses `Stack.Protected` for the signed-in and signed-out branches, the
same pattern the root layout uses for the Player, Coach, and auth families. Detail pages are stack
routes so they never appear in the bottom navigation.

## Opening the module

The root layout (`app/_layout.tsx`) was deliberately left untouched, so the shared Sign In screen
has no Admin entry point. Expo Router still mounts `(admin)` because it is a filesystem route that
no root-level `Stack.Protected` excludes, so the module opens by URL:

- Web: `/admin-sign-in` (or `/overview` once an admin session exists)
- Native build: `gccacademyapp://admin-sign-in`

To add the Admin role to the shared sign-in later, three additive changes are needed in files this
module did not touch: add `'admin'` to `UserRole` in `types/profile.ts`, add the admin demo account
to `services/mock-auth-service.ts`, and add a `<Stack.Protected guard={isAdmin}><Stack.Screen name="(admin)" /></Stack.Protected>`
branch to `app/_layout.tsx`.

## Demo account

| Role | Account ID | Password |
| --- | --- | --- |
| Admin | `GCC-ADMIN-001` | `admin123` |

The credentials live in `config/admin.ts` and are frontend demo values only.

## Data

`data/admin.ts` derives the academy directory from the existing `sharedAcademyData` dataset, so the
Admin roster, squads, and fee amounts stay consistent with what the Player and Coach modules show.
Admin-only facts (enrolment status, guardians, billing periods, coaching staff, approvals, activity)
are added on top.

| Concern | File |
| --- | --- |
| Types | `types/admin.ts` |
| Demo configuration | `config/admin.ts` |
| Seed directory and selectors | `data/admin.ts` |
| Local persistence | `utils/admin-storage.ts` (`samp.admin.session`, `samp.admin.operations`) |
| Services | `services/admin-service.ts`, `services/admin-auth-service.ts` |
| State | `contexts/admin-session-context.tsx`, `contexts/admin-data-context.tsx` |
| Tokens | `design/tokens/admin.ts` (`adminLayout`, `adminTabBarMetrics`) |

The Admin providers are mounted inside `app/(admin)/_layout.tsx` rather than the root layout, so the
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

Overview, collection summary, and squad reports are derived from that merged state, so a recorded
payment is visible on Overview, Finance, Reports, the member record, and the squad roster at once.

## Flows

1. **Sign in** — `GCC-ADMIN-001` / `admin123` opens the Admin tabs; the session is restored on relaunch.
2. **Overview** — academy snapshot, member/coach/attendance/approval metrics, fee collection, quick actions, pending approvals, recent activity.
3. **Members** — search by name, ID, guardian, or squad; filter by category and enrolment; open a member for billing, training, enrolment, guardian, and fee history.
4. **Enrol member** — squad, name, age, position, plan, enrolment type, and guardian details; capacity is enforced and a jersey number is allocated.
5. **Coaches** — workload summary, uncovered-squad warning, search and engagement filter, coach records with assigned squads.
6. **Add coach** — role, engagement, multi-squad assignment, contact details.
7. **Finance** — billing period selector, collection card, squad collection report, fee list filtered by status, and a fee record with a Record Payment flow.
8. **Approvals** — pending, approved, and declined queues with a confirmation dialog on each decision.
9. **Squads** — capacity bars, head coach reassignment, enrolment status, schedule, and roster.
10. **Reports** — billed, collected, outstanding, capacity, squad performance, enrolment mix, and squad attendance per period.
11. **Logout** — clears the admin session and returns to the Admin sign-in screen.

## Known limitations

- Admin announcements are recorded in the Admin module only. They are not written into the Player
  Updates feed, because that would require changing the shared updates context.
- Attendance percentages and squad training data are read-only in the Admin module; attendance is
  still owned by the Coach module.
- Fee amounts, periods, and the academy timeline are fixed demo values from `config/admin.ts`.
- The module is reachable by URL only until the shared sign-in is wired up, as described above.
