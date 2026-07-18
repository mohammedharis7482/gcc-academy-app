# Feature Inventory

This document describes the GCC Football Academy frontend MVP prepared for client review.

## Shared application foundation

- Role-based Player/Parent and Coach sign-in
- Protected Expo Router route groups
- Persistent mock session restoration and logout
- Adaptive five-item bottom navigation for each role
- Shared GCC colors, typography, cards, spacing, icons, and motion
- Reusable loading, empty, error, information, and success states
- Offline awareness while retaining locally stored content
- Persistent Sessions progress, Updates read state, notification settings, attendance, assessments, and training plans
- Safe dynamic-route not-found states

## Player/Parent

### Home

- Player identity and notification access
- Next training summary and schedule link
- Progress, attendance, and coach feedback snapshots
- Assigned Session state linked to Session progress
- Fee reminder and latest academy update

### Progress

- Overall development and attendance summaries
- Coach skill ratings, radar view, and monthly trend
- Feedback timeline, achievements, and current goal
- Attendance, assessment, and feedback detail pages
- Goal-to-Sessions connection

### Sessions

- Continue Watching and goal-based academy recommendations
- Category filtering and local Session search
- Session detail with objectives, practice points, coach note, and related Sessions
- Simulated media progress and persistent completion state

### Updates

- Important-update summary, filtering, and read/unread state
- Persistent unread badge and Mark All Read
- Contextual links to training, progress, Sessions, and fees

### Profile

- Digital player identity, academy assignment, membership, and guardian summary
- Fee details and payment history
- Notification settings and language status
- Support, academy information, privacy, and terms pages
- Protected logout flow

## Coach

### Dashboard

- Today’s operational summary, pending tasks, recent activity, and quick actions
- Shared status updates from attendance, feedback, assessments, and training plans

### Players

- Typed U10, U13, and U15 rosters with 20 players per squad
- Search, category/status filters, and sorting
- Player detail with attendance, skills, assessment, goal, feedback, and assigned Sessions

### Attendance

- Session selection and 20-player roster workflow
- Present, absent, late, and not-marked states
- Mark All Present, notes, filtering, summaries, save confirmation, and history
- Persistent submitted records connected to Player attendance views

### Assessment and feedback

- Quick Feedback and Full Assessment modes
- Player selection, skill ratings, strengths, improvement areas, comments, goals, and Session recommendations
- Persistent publishing and feedback history
- Connected Player Home, Progress, Sessions, and Updates results

### Training

- Today’s session, drill timeline, focus areas, objectives, Session assignments, and coach notes
- Persistent completion state linked to the Coach dashboard and Player experience

## Deliberately excluded from this frontend MVP

- Backend APIs and multi-device synchronization
- Real payment processing
- Push notification delivery
- Production video streaming
- Coach–parent chat
- Admin workflows
- QR, GPS, or biometric attendance
- Full Malayalam localization

