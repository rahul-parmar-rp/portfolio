# Google Multi-Account OAuth Manager

Complete guide for setting up and using the Google OAuth Multi-Account Manager.

## 🔗 Live Demo

**[Open Google Multi-Account Manager](https://gestures-techs.github.io/everything/micro-sites/google-multi-account-manager.html)**

---

## 📋 What This Does

- Manage multiple Google accounts in one app
- OAuth 2.0 Implicit Flow (client-side only)
- Access Gmail API (Labels, Drafts, Profile)
- Store access tokens in browser localStorage
- No backend server required

---

## 🚀 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name (e.g., "My OAuth Manager")
4. Click **"Create"**

### Step 2: Enable Gmail API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Gmail API"**
3. Click on it and press **"Enable"**

### Step 3: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure consent screen:
   - User Type: **External**
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
   - Click **"Save and Continue"**
   - Skip scopes, click **"Save and Continue"**
   - Add test users (your email), click **"Save and Continue"**

### Step 4: Configure OAuth Client

1. Application type: **Web application**
2. Name: "OAuth Manager Client"
3. **IMPORTANT:** Under **"Authorized JavaScript origins"**, add:

   ```
   https://gestures-techs.github.io
   ```

   For localhost testing, also add:

   ```
   http://localhost:8080
   ```

4. **DO NOT add redirect URIs** (Implicit Flow uses JavaScript origins only)
5. Click **"Create"**
6. **Copy your Client ID** (looks like: `xxxxx-xxxxxx.apps.googleusercontent.com`)

---

## 💻 Using the App

### Step 1: Configure Client ID

1. Open [Google Multi-Account Manager](https://gestures-techs.github.io/everything/micro-sites/google-multi-account-manager.html)
2. Paste your **Client ID** in the input field
3. The **Redirect URI** should auto-populate with the current page URL
4. Click **"Save"**

### Step 2: Add Your First Account

1. Click **"+ Add Account"** button
2. You'll be redirected to Google's login page
3. Select or sign in to your Google account
4. Click **"Allow"** to grant permissions
5. You'll be redirected back to the app
6. Your account should now appear in the accounts list

### Step 3: Use Gmail Features

For each account, you can:

- **Labels**: Click to view all Gmail labels
- **Drafts**: Click to see draft emails
- **Profile**: Click to view Gmail profile info
- **Remove**: Click to remove the account from the app

### Step 4: Add More Accounts

1. Click **"+ Add Account"** again
2. Choose **"Use another account"** in Google's login
3. Sign in with a different Google account
4. Repeat to add as many accounts as needed

---

## 🐛 Debugging

All operations are logged to the browser console. To view logs:

1. Open Developer Tools: `F12` or `Right-click → Inspect`
2. Click the **"Console"** tab
3. Look for logs starting with `===`

### Common Console Logs

```
=== INIT START ===
Current URL: https://gestures-techs.github.io/everything/micro-sites/google-multi-account-manager.html
URL Hash:
Saved config from localStorage: {"clientId":"...","redirectUri":"..."}
Config loaded: {clientId: "...", redirectUri: "...", scope: "..."}
Accounts loaded: 2 accounts
=== INIT COMPLETE ===
```

---

## ⚠️ Troubleshooting

### Error: "Configuration Error: Your OAuth client is not configured for Implicit Flow"

**Problem:** Getting authorization code instead of access token

**Solution:**

1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Make sure **"Authorized JavaScript origins"** contains: `https://gestures-techs.github.io`
4. **Remove** any entries from "Authorized redirect URIs"
5. Save and try again

### Error: "redirect_uri_mismatch"

**Problem:** The redirect URI doesn't match what's configured in Google Cloud Console

**Solution:**

1. Check the "Redirect URI" field in the app matches your current URL
2. In Google Cloud Console, verify **"Authorized JavaScript origins"** has the correct domain
3. Make sure you're using JavaScript origins, NOT redirect URIs

### Error: "Token expired"

**Problem:** Access tokens expire after ~1 hour

**Solution:**

1. Click **"+ Add Account"**
2. Select the same account again
3. This will refresh the token for that account

### No accounts showing after login

**Solution:**

1. Open browser console (`F12`)
2. Look for errors
3. Check localStorage: `localStorage.getItem('googleAccounts')`
4. Copy console logs and share for debugging

---

## 🔒 Security Notes

- ⚠️ Tokens stored in browser localStorage (not encrypted)
- ⚠️ Access tokens expire in ~1 hour
- ⚠️ No automatic token refresh
- ⚠️ Client-side only (no backend)
- ✅ CSRF protection with state parameter
- ✅ For production apps, use backend with Authorization Code Flow

---

## 📊 API Scopes Used

The app requests these Google API scopes:

```
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
```

**Permissions granted:**

- Read Gmail labels and drafts (read-only)
- Access email address
- Access profile information (name, picture)

---

## 🔗 Related Files

- **Live App:** [google-multi-account-manager.html](https://gestures-techs.github.io/everything/micro-sites/google-multi-account-manager.html)
- **Alternative:** [Simple Google Auth](./simple-google-auth-guide.md) - Minimal version
- **Alternative:** [Google Identity Services Demo](./google-identity-services-guide.md) - Modern auth

---

## 📞 Support

If you encounter issues:

1. Check browser console for detailed logs
2. Copy all console output (especially lines with `===`)
3. Share the logs for debugging help

---

**Last Updated:** January 2026
