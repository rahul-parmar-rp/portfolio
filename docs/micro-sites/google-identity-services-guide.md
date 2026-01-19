# Google Identity Services Demo

Complete multi-account demo using Google's modern authentication library.

## 🔗 Live Demo

**[Open Google Identity Services Demo](https://gestures-techs.github.io/everything/micro-sites/google-identity-services-demo.html)**

---

## 📋 What This Does

- Modern Google Sign-In with One Tap UI
- Multi-account management with rich UI
- JWT ID token decoding and display
- Token expiration tracking
- Profile information display
- Styled interface with account cards

---

## 🚀 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** dropdown
3. Click **"New Project"**
4. Enter:
   - Project name: "Identity Services Demo"
   - Organization: (optional)
5. Click **"Create"**
6. Wait for project creation to complete

### Step 2: Configure OAuth Consent Screen

1. In your new project, navigate to:
   - **"APIs & Services"** → **"OAuth consent screen"**
2. Select User Type: **External**
3. Click **"Create"**
4. Fill in App information:
   - **App name:** "Identity Services Demo"
   - **User support email:** Your email
   - **App logo:** (optional)
   - **App domain:** (optional)
   - **Authorized domains:** `gestures-techs.github.io`
   - **Developer contact:** Your email
5. Click **"Save and Continue"**
6. **Scopes:** Skip this step, click **"Save and Continue"**
7. **Test users:** Add your Gmail address
8. Click **"Save and Continue"**
9. Review and click **"Back to Dashboard"**

### Step 3: Create OAuth Client ID

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. Choose Application type: **Web application**
4. Enter Name: "GIS Demo Client"
5. Add **Authorized JavaScript origins:**

   ```
   https://gestures-techs.github.io
   ```

   For local testing, also add:

   ```
   http://localhost:8080
   ```

6. **Leave "Authorized redirect URIs" empty**
7. Click **"Create"**
8. A dialog appears with your credentials:
   - **Copy the Client ID** (format: `xxxxx-xxxxx.apps.googleusercontent.com`)
   - You can close the client secret (not needed for client-side apps)

---

## 💻 Using the App

### Step 1: Configure Client ID

1. Open [Google Identity Services Demo](https://gestures-techs.github.io/everything/micro-sites/google-identity-services-demo.html)
2. Locate the **"Configuration"** section at the top
3. Paste your **Client ID** into the input field
4. Click **"Save & Initialize"**
5. You should see a confirmation: "Configuration saved!"

### Step 2: Sign In with One Tap

**Automatic One Tap:**

- After initialization, a One Tap prompt may appear automatically
- Click on your Google account in the popup
- Click **"Continue as [Your Name]"**

**Manual Sign-In Button:**

- If One Tap doesn't appear, use the **"Sign in with Google"** button
- A new window opens with Google sign-in
- Select or sign in to your Google account
- Click **"Allow"** or **"Continue"**

### Step 3: View Account Information

After successful sign-in, an account card appears showing:

- **Profile Picture** (or initial letter if no picture)
- **Full Name**
- **Email Address**
- **Token Status** (Valid or Expired)
- **Account Details:**
  - User ID (sub)
  - Email Verified status
  - Locale
  - Added timestamp
  - Token expiration time
- **JWT Token** (truncated preview)

### Step 4: Add Multiple Accounts

1. Click **"Sign in with Google"** button again
2. In the Google sign-in window, click **"Use another account"**
3. Sign in with a different Google account
4. The new account card appears alongside existing ones
5. Repeat to add more accounts

### Step 5: Manage Accounts

**Remove Account:**

- Click **"Remove Account"** button on any account card
- Confirm the removal
- Account is deleted from the app

**View Token:**

- Check the "JWT Token" section in account details
- Shows first 100 characters of the token
- Full token is stored in localStorage

---

## 🐛 Debugging

All operations are logged to browser console. To view:

1. Press `F12` (Windows/Linux) or `Cmd+Option+I` (Mac)
2. Click **"Console"** tab
3. Look for detailed logs

### Example Console Output

**Initialization:**

```
Page loaded, initializing...
=== INIT START ===
Saved client ID: 123456-abc.apps.googleusercontent.com
Loaded 2 accounts
=== GIS INITIALIZATION ===
Initializing Google Identity Services with Client ID: 123456-abc...
GIS initialize() called
Rendering sign-in button...
Sign-in button rendered
Showing One Tap prompt...
One Tap notification: {isDisplayed: true, ...}
=== GIS INITIALIZATION COMPLETE ===
```

**Sign-In:**

```
Received credential response
JWT ID Token: eyJhbGciOiJSUzI1NiIsImtp...
Decoded payload: {
  sub: "123456789",
  email: "user@gmail.com",
  name: "John Doe",
  picture: "https://...",
  email_verified: true,
  ...
}
Account object: {id: "123456789", email: "user@gmail.com", ...}
Adding new account
Accounts saved to localStorage. Total accounts: 3
```

---

## ⚠️ Troubleshooting

### One Tap Not Appearing

**Causes:**

1. User previously dismissed One Tap multiple times
2. Already signed in (Google remembers)
3. Browser privacy settings blocking cookies
4. Previously signed in with this app

**Solutions:**

- Use the "Sign in with Google" button instead
- Clear cookies for `accounts.google.com`
- Try in Incognito/Private mode
- Wait a few hours and try again

### Error: "Invalid Client"

**Problem:** Client ID is incorrect or misconfigured

**Solutions:**

1. Verify Client ID copied correctly (no spaces)
2. Check Google Cloud Console:
   - Credentials → OAuth 2.0 Client IDs
   - Ensure it's a "Web application" type
   - Verify JavaScript origins are correct
3. Clear browser cache and try again

### Error: "Unauthorized JavaScript origin"

**Problem:** Current domain not in authorized JavaScript origins

**Solutions:**

1. Check current URL matches authorized origin
2. In Google Cloud Console:
   - Edit OAuth client
   - Add current domain to JavaScript origins
   - Save and wait 5 minutes
3. Refresh the page

### Token Shows "Expired"

**Problem:** JWT tokens expire (usually after 1 hour)

**Solutions:**

- Click "Sign in with Google" again
- Select the same account
- This refreshes the token

### No Profile Picture Showing

**Cause:** Google account doesn't have a profile picture set

**Solution:** This is normal - a letter avatar is shown instead

---

## 🔒 Security & Privacy

**What's Secure:**

- ✅ JWT tokens are signed by Google (verifiable)
- ✅ Tokens contain user identity (sub, email, name)
- ✅ Client-side only, no backend needed
- ✅ No password handling in your app

**What to Know:**

- ⚠️ Tokens stored in browser localStorage (client can access)
- ⚠️ JWT tokens are for authentication only (not for API calls)
- ⚠️ Tokens expire after ~1 hour
- ⚠️ No automatic token refresh
- ⚠️ Clear localStorage to remove all data

---

## 📊 JWT Token Contents

The ID token contains these fields:

```json
{
  "iss": "https://accounts.google.com",
  "sub": "1234567890",
  "aud": "your-client-id.apps.googleusercontent.com",
  "email": "user@gmail.com",
  "email_verified": true,
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "given_name": "John",
  "family_name": "Doe",
  "locale": "en",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Field Explanations:**

- `iss`: Issuer (always Google)
- `sub`: Unique user ID (never changes)
- `aud`: Your Client ID
- `email`: User's email address
- `email_verified`: Email verification status
- `name`: Full name
- `picture`: Profile picture URL
- `given_name`: First name
- `family_name`: Last name
- `locale`: User's language preference
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp

---

## 🔗 Related Files

- **Live App:** [google-identity-services-demo.html](https://gestures-techs.github.io/everything/micro-sites/google-identity-services-demo.html)
- **Minimal Version:** [Simple Google Auth](./simple-google-auth-guide.md)
- **OAuth Version:** [Google Multi-Account Manager](./google-multi-account-manager-guide.md) - With Gmail API

---

## 📝 Features Comparison

| Feature             | This Demo | Simple Auth | OAuth Manager |
| ------------------- | --------- | ----------- | ------------- |
| One Tap             | ✅ Yes    | ✅ Yes      | ❌ No         |
| Styled UI           | ✅ Yes    | ❌ No       | ❌ No         |
| JWT Display         | ✅ Yes    | ❌ No       | ❌ No         |
| Expiration Tracking | ✅ Yes    | ❌ No       | ✅ Yes        |
| Gmail API           | ❌ No     | ❌ No       | ✅ Yes        |
| Token Type          | ID Token  | ID Token    | Access Token  |

---

## 📞 Support

Need help? Follow these steps:

1. Open browser Developer Tools (`F12`)
2. Go to **Console** tab
3. Reproduce the issue
4. Copy ALL console logs
5. Share the logs for debugging help

---

**Last Updated:** January 2026
