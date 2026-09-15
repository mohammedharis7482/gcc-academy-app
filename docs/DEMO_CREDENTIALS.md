# Demo Credentials

Use these accounts only with the GCC Football Academy client demonstration build.

| Role | Account ID | Password | Opens |
| --- | --- | --- | --- |
| Player/Parent | `GCC-U13-024` | `demo123` | Player Home |
| Coach | `GCC-COACH-001` | `coach123` | Coach Dashboard |
| Admin | `GCC-ADMIN-001` | `admin123` | Admin Overview |

## Player scenario

- Ayaan Mohammed
- U13 Development Squad
- Jersey 10
- Head coach Sandeep
- Attendance 94%
- Coach rating 4.3/5
- Current goal: Weak-foot Passing
- July 2026 fee: ₹1,200 pending; due 15 July 2026

## Coach scenario

- Coach Sandeep
- Technical Coach
- Primary assignment: U13 Development Squad
- Demo roster access includes U10, U13, and U15 records for client review

## Admin scenario

- Sreerag Ambadi
- Academy Owner
- Academy-wide scope: members, coaching staff, squads, finance, approvals, and reports
- July 2026 billing period, with coach salaries pending for the current month
- Announcements posted to players appear in the Player Updates tab

## Reset guidance

Authentication and interaction state are stored on the test device. To demonstrate a first launch again, use the development-only Reset Demo Data action when available, or clear the app’s storage. Clearing storage also removes Sessions progress, read updates, settings, attendance submissions, assessments, training-plan edits, and Admin operations (payments, expenses, income, enrolments, member edits, approvals, and announcements).

Player and Coach credentials are defined once in `config/demo.ts`; the Admin credentials live in `config/admin.ts`. All three are consumed by the mock authentication service and the development sign-in hint.

