# Changelog

All notable frontend changes are documented here.

## [Unreleased]

- Backend and production-service integration remain intentionally out of scope.

## [1.0.0-rc.2] - 2026-07-16

### Added

- Client-facing project, feature, flow, limitations, credential, and feedback documentation.
- Complete Player/Parent and Coach frontend MVP flows.
- Persistent local authentication, preferences, learning, update, attendance, assessment, and training state.
- Shared loading, empty, error, information, and success-state components.

### Changed

- Centralized the scripted academy timeline, primary training ground, player identity, credentials, and fee facts.
- Corrected weekday/date combinations across schedule, attendance, updates, and assessment records.
- Aligned Learn age suitability with the supported U10, U13, and U15 squads.
- Aligned Ayaan Mohammed’s Coach roster position and identity with the Player experience.
- Replaced demo-only support contact values with the centralized academy contact.
- Standardized the July 2026 fee record ID across Home, Profile, and shared academy data.

### Validated

- Strict TypeScript compilation
- Expo lint rules
- Expo project health checks
- Android Expo bundle and asset resolution

## [1.0.0-rc.1] - 2026-07-15

### Added

- Player Home, Progress, Learn, Updates, Profile, and supporting detail routes.
- Coach Dashboard, Players, Attendance, Assessment/Feedback, Training, and Profile flows.
- Role-protected routing, adaptive tab navigation, shared GCC design system, accessibility labels, and responsive Android layouts.
