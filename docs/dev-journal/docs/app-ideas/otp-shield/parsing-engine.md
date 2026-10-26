# Layered SMS Parsing Engine Design

This document outlines the design for the SMS parsing engine in the "Offline OTP Shield" app. The engine processes intercepted SMS messages in multiple layers, facilitating user-defined rules application and system regex parsing.

## Parsing Engine Workflow

### 1. Data Validation Layer

- Validates intercepted SMS for structure and content.
- Filters out non-OTP messages based on predefined characteristics.
- Example criteria: Contains numeric strings, matches keywords like "OTP", "code".

#### Components

- `smsValidator.ts`: Parses SMS body and checks against predefined criteria.

### 2. User-Defined Rules Layer

- Applies custom rules set by the user.
- Supports case-sensitive and case-insensitive text matching.
- Enables custom filtering like ignoring certain sender IDs or keywords.

#### Components

- `ruleService.ts`
  - Dynamic rule application logic.
  - CRUD operations for user-defined rules.

### 3. System Regex Layer

- Parses the validated and user-filtered messages using predefined regex patterns.
- Extracts OTPs, if present.
- Example Regex:
  - `\b\d{6}\b`: Matches 6-digit OTPs.

#### Components

- `regexService.ts`: Contains regex pattern library and application logic.

### 4. Data Pipeline

- Combines the layers to process SMS data iteratively.

#### Workflow

1. **Intercepted Data**: SMS messages are received.
2. **Validation**: Input is validated and irrelevant data is filtered.
3. **Custom Rules**: User-defined rules are applied.
4. **Regex Parsing**: Extracts OTPs from filtered data.

## Technical Implementation

The parsing engine will use asynchronous functions to manage the processing pipeline efficiently.

### Example Parsing Pipeline Code

```ts
const parseSms = async (sms) => {
  const validated = await validateSms(sms);
  const filteredByRules = await applyRules(validated);
  const parsedOtp = await applyRegex(filteredByRules);

  return parsedOtp;
};
```
