# Directory Structure for Offline OTP Shield

This plan defines the modular file organization for building the Offline OTP Shield app using React Native and Expo. It considers layers of SMS interception, user-defined rules, regex processing, and offline storage.

## Root Directory

```
/OfflineOTPShield/
├── app/                # Main application entry point and screens
├── components/         # UI components (Material Design 3-compliant)
├── services/           # SMS Interception, Notification Handling, etc.
├── utils/              # Helper functions and Regex patterns
├── assets/             # Images, Icons, and Fonts
├── db/                 # Offline storage for SMS and rules
├── states/             # State management (Context/Redux)
├── native/             # Native stubs for permissions/SMS
├── tests/              # Unit and Integration Tests
├── README.md           # Documentation
├── package.json        # Dependencies
├── app.json            # Expo config
└── tsconfig.json       # TypeScript configuration
```

### `/app`

Contains the screens and entry points:

- `MainScreen.tsx`: Lists intercepted SMS messages with parsed OTPs.
- `CustomRulesScreen.tsx`: Allows users to define rules.
- `RuleManagementScreen.tsx`: Edits or removes rules.

### `/components`

Reusable UI components designed:

- `OTPDisplay.tsx`: Render parsed OTPs.
- `RuleEditor.tsx`: Rule input form.
- `Navbar.tsx`: Bottom navigation.
- `Toast.tsx`: System messages.

### `/services`

Features application logic layers:

- `smsService.ts`: Native interception stubs and SMS processing.
- `ruleService.ts`: Handles user-defined rules.
- `regexService.ts`: Built-in system regex.

### `/utils`

Encapsulates helper tools like:

- `regexHelpers.ts`: Regex matching logic.
- `smsValidator.ts`: Validate intercepted data.
- `storageKeys.ts`: Keys for Realm/SQLite tables.

### `/db`

Defines offline persistence models:

- `smsModel.ts`: Schema for SMS storage.
- `ruleModel.ts`: Schema for rules.

### `/states`

Manages app-wide state:

- `AppState.ts`: General state.
- `RulesContext.ts`: Rules logic.
- `SMSContext.ts`: SMS parsing.

### `/native`

Contains integrations:

- `LaunchPermissions.ts`: Handles permissions at app launch.

### `/tests`

Includes unit and integration testing:

- `services/`
  - `smsService.test.ts`
  - `regexService.test.ts`
- `db/`
  - `smsModel.test.ts`
