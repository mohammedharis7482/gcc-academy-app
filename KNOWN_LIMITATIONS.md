# Known Limitations

The RC2 build is a frontend demonstration. These limitations are intentional and should be explained during client review.

## Data and synchronization

- All records are typed demonstration data; there is no production database.
- State persists only on the current device through AsyncStorage.
- Player and Coach connections demonstrate the intended product flow but do not synchronize between two physical devices.
- Clearing app storage, uninstalling the app, or using Reset Demo Data removes local changes.
- The fixed demonstration timeline is centred on 11 July 2026 so every role sees a repeatable scenario.

## Authentication and security

- Authentication validates local demo credentials only.
- Password recovery, account provisioning, token refresh, and server-side authorization are not implemented.
- The build must not be used with real player, guardian, payment, or medical data.

## Communication and media

- Updates are generated locally; real push notifications are not sent.
- Session playback is a thumbnail-based simulated experience, not production video streaming.
- Coach–parent messaging, comments, and social interactions are outside MVP scope.

## Payments and administration

- Fees and receipts are mock records; there is no payment gateway or accounts integration.
- Attendance notes and assessments are local frontend records.
- Admin management, exports, reporting, and approval workflows are not included.

## Language and legal content

- English is the only available language; Malayalam is marked Coming Later.
- Privacy Policy and Terms and Conditions are draft frontend placeholders, not approved legal documents.
- Final academy policies, consent wording, data retention rules, and child-safeguarding requirements must be supplied before production.

## Platform and release

- RC2 targets Android client review first; iOS layout support exists but requires a separate device QA and release process.
- Offline mode keeps local content visible but does not provide background synchronization.
- Production monitoring, analytics, crash reporting, and remote feature configuration are not integrated.

## Before backend implementation

The academy must approve roles and permissions, data ownership, player/guardian consent, official schedule and fee sources, notification rules, video hosting, assessment visibility, and the API contract.

