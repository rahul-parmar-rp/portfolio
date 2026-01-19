# Gmail Send - Multi-Account Guide

## Live Demo

- **URL**: https://gestures-techs.github.io/everything/docs/micro-sites/gmail-send.html
- **Purpose**: Send emails from multiple Google accounts using Gmail API

---

## Quick Start

### Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Gmail API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `Gmail Send Multi-Account`

5. **IMPORTANT**: Configure Authorized JavaScript origins:

   ```
   https://gestures-techs.github.io
   ```

   - Do NOT add redirect URIs
   - This is for Implicit Flow (client-side only)

6. Copy your **Client ID** (format: `xxxxx-xxxxx.apps.googleusercontent.com`)

### Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. User Type: **External** (for personal Gmail accounts)
3. Fill in required fields:
   - App name: `Gmail Send App`
   - User support email: Your email
   - Developer contact: Your email
4. **Add Scopes** (click "Add or Remove Scopes"):
   - `https://www.googleapis.com/auth/gmail.send` ✅ **REQUIRED**
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
5. Save and continue
6. Add test users (your Gmail accounts you'll use)

### Step 3: Use the App

1. Open the app
2. Paste your Client ID
3. Save configuration
4. Click "Add Account" to authorize each Google account
5. Select account from dropdown
6. Compose email (To, Subject, Message)
7. Click "Send Email"

---

## How It Works

### OAuth 2.0 Implicit Flow

```
User clicks "Add Account"
    ↓
Redirect to Google OAuth with scope: gmail.send
    ↓
User grants permission
    ↓
Google redirects back with access_token in URL hash
    ↓
App stores token + user info in localStorage
    ↓
User can send emails using stored token
```

### Email Sending Process

```javascript
// 1. Format email (RFC 2822)
const email = `To: ${recipient}\nSubject: ${subject}\n\n${message}`;

// 2. Encode to base64url
const encoded = btoa(email).replace(/\+/g, '-').replace(/\//g, '_');

// 3. Send via Gmail API
POST https://www.googleapis.com/gmail/v1/users/me/messages/send
Headers: Authorization: Bearer {access_token}
Body: { "raw": "{encoded_email}" }
```

### Access Token Storage

- Stored in `localStorage` as `gmailSendAccounts`
- Each account has:
  - `email`: Account email
  - `name`: User's name
  - `accessToken`: OAuth token
  - `expiresAt`: Timestamp when token expires (usually 1 hour)
  - `grantedScopes`: List of permissions granted

---

## Console Logs

All major operations log to console with `===` markers:

```
=== GMAIL SEND INIT START ===
Current URL: https://...
Loaded 2 accounts
=== GMAIL SEND INIT COMPLETE ===

=== ADD ACCOUNT START ===
Generated state: xY7z...
OAuth URL: https://accounts.google.com/o/oauth2/v2/auth?...
=== ADD ACCOUNT - REDIRECTING ===

=== OAUTH CALLBACK ===
Access token: Present
Granted scopes: ["gmail.send", "userinfo.email", ...]
Account object: {email: "user@gmail.com", ...}
Accounts saved. Total: 2

=== SEND EMAIL START ===
From account index: 0
To: recipient@example.com
Subject: Test Email
Message length: 150
Using account: sender@gmail.com
Email formatted (RFC 2822)
Email encoded (base64url)
Calling Gmail API send endpoint...
Response status: 200
✅ Email sent successfully!
Message ID: 18d4f5e6a7b8c9d0
=== SEND EMAIL SUCCESS ===
```

---

## Troubleshooting

### ❌ "Gmail send scope not granted"

**Problem**: User denied Gmail send permission during OAuth flow

**Solution**:

1. Remove the account from the app
2. Click "Add Account" again
3. Make sure to **allow all permissions** in the consent screen
4. Check that `gmail.send` scope is in OAuth consent screen configuration

---

### ❌ "Token expired. Please re-add this account."

**Problem**: Access tokens expire after ~1 hour

**Solution**:

1. Remove the expired account
2. Click "Add Account" to re-authorize
3. Tokens are automatically refreshed on re-authentication

**Why?**: OAuth Implicit Flow doesn't support refresh tokens (security limitation of client-side apps)

---

### ❌ Failed to send: "Insufficient Permission"

**Problem**:

- Gmail API not enabled
- `gmail.send` scope not requested
- Token doesn't have send permission

**Solution**:

1. Verify Gmail API is enabled in Cloud Console
2. Check OAuth consent screen has `gmail.send` scope
3. Re-authenticate the account
4. Check console logs for `grantedScopes` array

---

### ❌ "Configuration Error: OAuth client not configured for Implicit Flow"

**Problem**: Using Authorization Code instead of Implicit Flow

**Solution**:

1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. **Remove all Redirect URIs**
4. **Add Authorized JavaScript origins**: `https://gestures-techs.github.io`
5. Save changes

---

### ❌ Email not sending (no error)

**Check Console Logs**:

```javascript
// Look for these in console:
Response status: 200  // Success
Response status: 400  // Bad request (malformed email)
Response status: 403  // Permission denied
Response status: 401  // Invalid/expired token
```

**Common Issues**:

- Token expired → Re-add account
- Invalid email format → Check To field is valid email
- No subject/message → Fill all required fields

---

### ❌ Cross-Origin Request Blocked

**Problem**: Accessing from wrong domain

**Solution**:

- Only works from: `https://gestures-techs.github.io`
- For local testing, add `http://localhost` to Authorized JavaScript origins
- Must match exactly (no trailing slashes)

---

## Security Notes

### ⚠️ Access Token Exposure

- Tokens stored in `localStorage` (visible in browser DevTools)
- **Never share localStorage dump or console logs publicly** (contains access tokens)
- Tokens expire in ~1 hour for security

### ⚠️ CSRF Protection

- App uses `state` parameter to prevent CSRF attacks
- State is cryptographically random and verified on callback
- If state mismatch detected, authentication is rejected

### ⚠️ Production Use

For production apps with sensitive data:

1. Use **Authorization Code Flow** with backend (not Implicit Flow)
2. Store tokens server-side (not in browser)
3. Implement token encryption
4. Use refresh tokens for long-lived access
5. Add rate limiting

---

## Email Format Reference

### RFC 2822 Format

```
To: recipient@example.com
Subject: Hello World

This is the email body.
Multiple lines are supported.
```

### Base64url Encoding

- Regular base64 but:
  - Replace `+` with `-`
  - Replace `/` with `_`
  - Remove padding `=`

### Example API Call

```javascript
POST https://www.googleapis.com/gmail/v1/users/me/messages/send
Content-Type: application/json
Authorization: Bearer ya29.a0AfH6...

{
  "raw": "VG86IHJlY2lwaWVudEBleGFtcGxlLmNvbQpTdWJqZWN0OiBIZWxsbyBXb3JsZAoKVGhpcyBpcyB0aGUgZW1haWwgYm9keS4"
}
```

---

## API Reference

### Gmail API v1

**Endpoint**: `https://www.googleapis.com/gmail/v1/users/me/messages/send`

**Method**: POST

**Headers**:

- `Authorization: Bearer {access_token}`
- `Content-Type: application/json`

**Request Body**:

```json
{
  "raw": "base64url_encoded_email"
}
```

**Response** (Success):

```json
{
  "id": "18d4f5e6a7b8c9d0",
  "threadId": "18d4f5e6a7b8c9d0",
  "labelIds": ["SENT"]
}
```

**Response** (Error):

```json
{
  "error": {
    "code": 403,
    "message": "Insufficient Permission",
    "errors": [...]
  }
}
```

---

## Gmail API Scopes

| Scope              | Description                            | Required? |
| ------------------ | -------------------------------------- | --------- |
| `gmail.send`       | Send emails on user's behalf           | ✅ Yes    |
| `userinfo.email`   | Get user's email address               | ✅ Yes    |
| `userinfo.profile` | Get user's name/picture                | Optional  |
| `gmail.readonly`   | Read emails (not needed for send-only) | ❌ No     |

---

## Feature Comparison

### Gmail Send vs Other Apps

| Feature                  | Gmail Send | Multi-Account Manager   | Simple Auth      |
| ------------------------ | ---------- | ----------------------- | ---------------- |
| Send Emails              | ✅ Yes     | ❌ No                   | ❌ No            |
| Read Emails              | ❌ No      | ✅ Yes (labels, drafts) | ❌ No            |
| Multi-Account            | ✅ Yes     | ✅ Yes                  | ✅ Yes           |
| Gmail API                | ✅ Yes     | ✅ Yes                  | ❌ No (GIS only) |
| OAuth Implicit Flow      | ✅ Yes     | ✅ Yes                  | ❌ No            |
| Google Identity Services | ❌ No      | ❌ No                   | ✅ Yes           |

---

## Testing

### Test Emails to Send

1. **Simple Test**:
   - To: your-email@gmail.com
   - Subject: Test from Gmail Send App
   - Message: Hello, this is a test!

2. **Multi-line Test**:
   - To: your-email@gmail.com
   - Subject: Multi-line Test
   - Message:
     ```
     Line 1
     Line 2
     Line 3
     ```

3. **Multiple Accounts**:
   - Add Account 1
   - Add Account 2
   - Send from Account 1 to your email
   - Send from Account 2 to your email
   - Verify both appear in your inbox

### Verify Sent Email

1. Check your Gmail inbox (recipient)
2. Open the sent email
3. Verify:
   - Sender matches selected account
   - Subject matches what you entered
   - Message body is correct
4. Check sender's "Sent" folder
   - Email should appear there too

---

## Related Files

- [Google Multi-Account Manager](google-multi-account-manager.html) - Read Gmail (labels, drafts, profile)
- [Google Multi-Account Manager Guide](google-multi-account-manager-guide.md) - OAuth setup guide
- [Simple Google Auth](simple-google-auth.html) - Minimal GIS auth
- [Google Identity Services Demo](google-identity-services-demo.html) - Full GIS demo

---

## Support

**Issues?** Check console logs and compare with examples in this guide.

**Console command**:

```javascript
// View stored accounts
console.log(JSON.parse(localStorage.getItem("gmailSendAccounts")));

// View config
console.log(JSON.parse(localStorage.getItem("gmailSendConfig")));

// Clear all data
localStorage.removeItem("gmailSendAccounts");
localStorage.removeItem("gmailSendConfig");
location.reload();
```
