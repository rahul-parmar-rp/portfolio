# State Management Workflow for Offline OTP Shield

This document outlines the state management plan for the "Offline OTP Shield" app, focusing on SMS parsing, user-defined rules, and offline storage.

## State Management Library

We recommend using **Redux** with **Redux Toolkit** to structure the state. Alternatively, Expo Router’s built-in Context API could be used for lightweight state management.

## State Modules

### 1. **SMS State**

#### Structure

- **Parsed OTPs**: Stores extracted OTPs for immediate display.
- **Interception Status**: Tracks whether SMS interception is active.

#### Actions

- `INTERCEPT_SMS`: Parses SMS messages and adds them to the parsed OTPs.
- `CLEAR_ALL_SMS`: Clears stored SMS from state.

#### Example

```ts
State: {
  parsedOtps: [];
  isIntercepting: false;
}
Action: {
  (INTERCEPT_SMS, CLEAR_ALL_SMS);
}
```

### 2. **Rules State**

#### Structure

- **User Rules**: Stores user-created rule definitions.
- **Active Status**: Status of applied rules.

#### ExampleModules:

Command states. internal.
