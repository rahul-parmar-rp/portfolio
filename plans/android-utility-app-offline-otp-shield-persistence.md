# Offline Message Persistence Strategy

This document outlines the approach for offline storage of SMS messages and user-defined rules in the "Offline OTP Shield" app. It covers database schema design and implementation details.

## Storage Options

Given the app requirements, the following options are considered:

1. **SQLite**: Lightweight and highly compatible with Expo apps.
2. **AsyncStorage**: Simplistic solution for lightweight data.
3. **Realm Database**: Recommended for complex offline apps.

### Chosen Option

**SQLite** will be used for this app due to ease of setup, compatibility, and local-first design.

---

## Database Schema

### SMS Messages Table

#### Columns

- `id`: Primary key (autoincrement).
- `messageBody`: Text data of intercepted SMS.
- `sender`: Sender ID.
- `otp`: Extracted OTP.
- `timestamp`: Date/time of SMS reception.

#### Example Schema

```sql
CREATE TABLE sms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  messageBody TEXT,
  sender TEXT,
  otp TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Rules Table

#### Columns

- `id`: Primary key (autoincrement).
- `keyword`: User-defined keyword for filtering.
- `sender`: Optional sender ID for rule application.
- `isActive`: Boolean indicating if the rule is active.

#### Example Schema

```sql
CREATE TABLE rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT,
  sender TEXT,
  isActive BOOLEAN DEFAULT 1
);
```

---

## Data Workflow

### 1. SMS Storage

- Intercepted SMS messages are stored locally in the `sms` table after parsing.
- OTPs extracted by the parsing engine are indexed.

### 2. Rule Storage

- User-defined rules are stored in the `rules` table.
- CRUD operations are available for adding, modifying, or deleting rules.

### 3. Data Query

- SMS messages are fetched based on user-defined rules and system regex.

---

## Example Code

### Initialize Database

```ts
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("offlineOtpShield.db");

db.transaction((tx) => {
  tx.executeSql(`CREATE TABLE IF NOT EXISTS sms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    messageBody TEXT,
    sender TEXT,
    otp TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );`);

  tx.executeSql(`CREATE TABLE IF NOT EXISTS rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT,
    sender TEXT,
    isActive BOOLEAN DEFAULT 1
  );`);
});
```

### Insert SMS

```ts
export const insertSms = (messageBody, sender, otp) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO sms (messageBody, sender, otp) VALUES (?, ?, ?);`,
      [messageBody, sender, otp],
    );
  });
};
```

### Query SMS

```ts
export const querySms = (rules) => {
  const { keyword, sender } = rules;
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM sms WHERE messageBody LIKE ? AND sender LIKE ?;`,
      [`%${keyword}%`, `%${sender}%`],
    );
  });
};
```
