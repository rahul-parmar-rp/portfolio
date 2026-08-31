# IPO Application Planner — Comprehensive Product Plan

## 1. Objective

Build a **personal IPO application management web app** that helps manage multiple people, bank accounts, brokers, IPOs, quotas, applications, funding requirements, and eventually allotment/results.
Intial phase less focus on styling and more focus on functionalities.

The primary question the app should answer:

> **Who is applying for what, through which bank/broker account, under which quota, for how many lots, and how much money is required?**

---

# 2. Core Concepts

The app should be built around **5 main entities**:

```text
Person
   ↓
Account
   ↓
Application
   ↓
IPO
   ↓
Quota
```

### Person

The actual individual.

Example:

- Rahul
- Kiran
- Narendra
- Miral

### Account

A person's specific bank/broker combination.

Example:

```text
Rahul
 ├── SBI → Zerodha
 └── HDFC → Groww
```

Accounts must be separate because the same person can have multiple accounts.

### IPO

The IPO being applied for.

Example:

- Lumino
- ESDS

### Quota

The category under which the application is made.

Examples:

- Retail / Small
- SHNI / Big
- Shareholder
- Employee
- Other applicable quota

### Application

The actual IPO application.

An application connects:

```text
Person
+ Account
+ IPO
+ Quota
+ Lots
+ Amount
```

---

# 3. IPO Configuration

When creating an IPO:

### Basic Information

- IPO name
- Company name
- Symbol
- Open date
- Close date
- Listing date
- Price range
- Final price
- Lot size

### Quotas

Each IPO can have different quotas.

Example:

| Quota       | Minimum Lots | Maximum Lots | Price |
| ----------- | -----------: | -----------: | ----: |
| Retail      |            1 |           13 |  Auto |
| SHNI        |           14 |           67 |  Auto |
| Shareholder |            1 | Configurable |  Auto |

The app should **never assume every IPO has the same quota structure**.

---

# 4. Automatic Calculations

The calculation engine should determine the amount from the IPO configuration.

### Application amount

```text
Price × Lot Size × Lots
```

### Example

```text
Price = ₹3,731
Lot Size = 4
Lots = 14

Amount = ₹3,731 × 4 × 14
       = ₹2,08,936
```

The user should not manually enter the amount.

---

# 5. People & Accounts

## Person Management

Fields:

- Name
- Optional notes
- Active/inactive

## Account Management

Fields:

- Person
- Bank
- Broker
- Account nickname
- Available funds
- UPI ID
- Demat identifier
- Notes
- Active/inactive

Example:

| Person | Bank  | Broker  | Available |
| ------ | ----- | ------- | --------: |
| Rahul  | SBI   | Zerodha | ₹1,00,000 |
| Rahul  | HDFC  | Groww   |   ₹50,000 |
| Kiran  | ICICI | Zerodha | ₹3,00,000 |

---

# 6. Application Creation

Create application:

### Select

1. Person
2. Bank account
3. Broker
4. IPO
5. Quota
6. Number of lots

The app automatically calculates:

- Shares
- Amount
- Minimum/maximum validation

Example:

```text
Person: Rahul
Bank: SBI
Broker: Zerodha
IPO: Lumino
Quota: Small
Lots: 1

Shares: 4
Amount: ₹14,924
```

---

# 7. Multiple Applications

The app must support multiple applications.

Example:

| Application | Person | Bank  | IPO    | Quota       | Lots |    Amount |
| ----------- | ------ | ----- | ------ | ----------- | ---: | --------: |
| #001        | Rahul  | SBI   | Lumino | Small       |    1 |   ₹14,924 |
| #002        | Rahul  | HDFC  | Lumino | Shareholder |    1 |   ₹14,924 |
| #003        | Kiran  | ICICI | Lumino | SHNI        |   14 | ₹2,08,936 |

This makes the system flexible instead of limiting each person to one application.

---

# 8. Application Status

Each application should have a lifecycle:

```text
Draft
↓
Applied
↓
Mandate Pending
↓
Mandate Approved
↓
Allotment Pending
↓
Allotted / Not Allotted
↓
Completed
```

The user can manually update the status.

---

# 9. Dashboard

The dashboard is the most important screen.

## Overall Summary

```text
Active IPOs             2
Total Applications      7
Small Applications      4
SHNI Applications       3
Total Required          ₹6,76,702
```

If available funds are entered:

```text
Available Funds          ₹7,00,000
Required                 ₹6,76,702
Remaining                ₹23,298
```

---

# 10. Account Funding View

This should be one of the most useful parts of the application.

| Person   | Bank  | Broker  |  Required | Available | Status |
| -------- | ----- | ------- | --------: | --------: | ------ |
| Rahul    | SBI   | Zerodha |   ₹29,848 |   ₹50,000 | ✓      |
| Kiran    | HDFC  | Zerodha | ₹4,13,140 | ₹3,00,000 | ⚠️     |
| Narendra | ICICI | Groww   | ₹2,19,128 | ₹2,50,000 | ✓      |

If insufficient:

> ⚠️ ₹1,13,140 additional funding required

---

# 11. IPO View

Click an IPO and see every application.

### Lumino

| Person   | Bank  | Broker  | Quota | Lots |    Amount | Status  |
| -------- | ----- | ------- | ----: | ---: | --------: | ------- |
| Rahul    | SBI   | Zerodha | Small |    1 |   ₹14,924 | Applied |
| Kiran    | HDFC  | Zerodha |  SHNI |   14 | ₹2,08,936 | Applied |
| Narendra | ICICI | Groww   | Small |    1 |   ₹14,924 | Pending |

Bottom:

```text
Applications: 3
Capital Required: ₹2,38,784
```

---

# 12. Account View

Click an account to see everything being funded through it.

### Rahul — SBI → Zerodha

| IPO    | Quota | Lots |  Amount | Status  |
| ------ | ----- | ---: | ------: | ------- |
| Lumino | Small |    1 | ₹14,924 | Applied |
| ESDS   | Small |    1 | ₹14,586 | Applied |

**Total: ₹29,510**

---

# 13. Quota View

Useful for seeing the distribution.

```text
Small
4 applications
₹59,510

SHNI
3 applications
₹6,17,192

Shareholder
1 application
₹14,924
```

This also makes it easy to see how much capital is being used in each category.

---

# 14. Validation Rules

The application should automatically catch mistakes.

### IPO validation

- IPO is open
- IPO has not closed
- Price exists
- Lot size exists
- Selected quota exists

### Application validation

- Minimum lots
- Maximum lots
- Valid lot multiple
- Account is active
- Required funds
- Duplicate application warnings

### Account validation

Warn when:

```text
Required Amount > Available Funds
```

Example:

> ⚠️ Kiran requires ₹4,13,140 but only has ₹3,00,000 available.

---

# 15. Important Duplicate/Eligibility Handling

The app should **warn rather than silently block** potentially valid scenarios.

For example:

> ⚠️ This person already has an application for Lumino.

Then allow the user to decide whether the second application is legitimate.

For quota eligibility:

```text
Shareholder quota
→ Eligible ✓
→ Not eligible ✕
→ Unknown ?
```

This should be configurable because eligibility depends on the specific IPO.

---

# 16. Money Management

The app should distinguish:

### Available funds

Money currently available in the account.

### Required funds

Money needed for current applications.

### Locked funds

Money associated with pending mandates/applications.

### Remaining funds

```text
Available
− Required
= Remaining
```

Later this can become more sophisticated with mandate tracking.

---

# 17. Application Tracking

Each application can eventually contain:

- Application number
- IPO
- Account
- Quota
- Lots
- Amount
- UPI ID
- Mandate status
- Application status
- Allotment status
- Shares allotted
- Refund amount
- Notes

---

# 18. Allotment Tracking

After allotment:

```text
Applied
14 lots
₹2,08,936

↓
Allotted
14 lots
56 shares
```

or:

```text
Applied
14 lots

↓
Not Allotted
```

This allows historical tracking of applications.

---

# 19. Profit/Loss Tracking

Later, once shares are allotted:

- IPO price
- Allotted shares
- Listing price
- Current price
- Investment
- Current value
- Profit/loss
- Profit percentage

Example:

```text
Investment     ₹2,08,936
Current Value  ₹3,25,000
Profit         ₹1,16,064
Return         55.55%
```

This should be **V2**, not part of the initial calculator.

---

# 20. Export

Provide:

### CSV Export

```text
Person
Bank
Broker
IPO
Quota
Application #
Lots
Shares
Amount
Status
```

### Copy Summary

Generate something easy to send on WhatsApp/Teams.

Example:

```text
Lumino

Rahul — SBI — Small — ₹14,924
Kiran — HDFC — SHNI — ₹2,08,936
Narendra — ICICI — Small — ₹14,924

Total: ₹2,38,784
```

---

# 21. Main Screens

Keep the application simple.

### 1. Dashboard

Overall picture.

### 2. IPOs

Manage IPOs and view applications.

### 3. Applications

Master list of every application.

### 4. Accounts

Manage people, banks, brokers and funds.

### 5. Settings

General app configuration and data management.

That's enough for V1.

---

# 22. Dashboard Layout

```text
┌──────────────────────────────────────┐
│ IPO Application Planner              │
├──────────────────────────────────────┤
│                                      │
│ Active IPOs     Applications         │
│ 2               7                    │
│                                      │
│ Required        Available            │
│ ₹6,76,702       ₹7,00,000            │
│                                      │
│ Remaining       SHNI Applications    │
│ ₹23,298         3                    │
├──────────────────────────────────────┤
│ Upcoming / Active IPOs               │
│                                      │
│ Lumino             ₹2,53,708         │
│ ESDS               ₹4,22,994         │
├──────────────────────────────────────┤
│ Account Funding                      │
│                                      │
│ Rahul       ₹29,510       ✓          │
│ Kiran       ₹4,13,140     ⚠️         │
│ Narendra    ₹2,19,128     ✓          │
└──────────────────────────────────────┘
```

---

# 23. Data Model

A clean relational-style model:

```text
Person
 ├── id
 └── name

Account
 ├── id
 ├── personId
 ├── bank
 ├── broker
 ├── availableFunds
 └── upiId

IPO
 ├── id
 ├── name
 ├── price
 ├── lotSize
 ├── openDate
 ├── closeDate
 └── listingDate

Quota
 ├── id
 ├── ipoId
 ├── name
 ├── minLots
 ├── maxLots
 └── eligibility

Application
 ├── id
 ├── accountId
 ├── ipoId
 ├── quotaId
 ├── applicationNumber
 ├── lots
 ├── amount
 └── status
```

---

# 24. Technology

For this application:

### Frontend

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

### V1 Storage

**localStorage**

No backend required.

### V2

If you want access from multiple devices:

- PostgreSQL
- Supabase
- Authentication
- Cloud sync

---

# 25. V1 Development Phases

### Phase 1 — Foundation

- Next.js setup
- TypeScript
- UI structure
- Data models
- LocalStorage layer

### Phase 2 — IPO Management

- Add IPO
- Edit IPO
- Delete IPO
- Configure quotas
- Lot calculations

### Phase 3 — People & Accounts

- Add person
- Add bank account
- Add broker
- Available funds
- Account management

### Phase 4 — Applications

- Create application
- Select account
- Select IPO
- Select quota
- Enter lots
- Automatic calculation
- Validation

### Phase 5 — Dashboard

- Total applications
- Capital required
- Account funding
- IPO summaries
- Quota summaries

### Phase 6 — Tracking

- Application status
- Mandate status
- Allotment status

### Phase 7 — Export

- CSV
- Copy summary

### Phase 8 — Polish

- Responsive/mobile UI
- Empty states
- Error handling
- Confirmation dialogs
- Data backup/import

---

# 26. V1 Definition of Done

The first version is complete when you can:

1. Add **Rahul, Kiran, Narendra, Miral**
2. Add multiple bank/broker accounts for each person
3. Add **Lumino and ESDS**
4. Configure their different quotas
5. Create Small/SHNI/Shareholder applications
6. Automatically calculate lots and amounts
7. See total money required
8. See money required **per bank account**
9. See applications **per IPO**
10. See applications **per person**
11. Track application status
12. Detect insufficient funds
13. Export the complete application list
14. Close/reopen or archive old IPOs
15. Keep all data after refreshing the browser

---

## 27. Future V2/V3

Once V1 works well:

**V2**

- Cloud sync
- Login
- Multiple devices
- UPI/mandate tracking
- Allotment tracking
- Profit/loss

**V3**

- IPO data API
- GMP
- Subscription data
- Automatic IPO discovery
- Notifications
- Historical performance
- Application/allotment analytics

### Most important architectural decision

Don't build this as a **"Lumino/ESDS calculator."**

Build a generic **IPO application management system** where Lumino and ESDS are simply data entered into it.

That way the same app works for the next 50 IPOs without changing the code.
