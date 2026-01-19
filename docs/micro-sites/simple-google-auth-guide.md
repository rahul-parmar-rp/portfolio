# Simple Google Auth

Minimal Google authentication demo using Google Identity Services.

## 🔗 Live Demo

**[Open Simple Google Auth](https://gestures-techs.github.io/everything/micro-sites/simple-google-auth.html)**

---

## 📋 What This Does

- Simple Google Sign-In with One Tap
- Multi-account support
- JWT ID tokens (not OAuth access tokens)
- Uses Google Identity Services library
- Minimal code, no CSS styling

---

## 🚀 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name (e.g., "Simple Auth Demo")
4. Click **"Create"**

### Step 2: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. User Type: **External**
3. Fill in:
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
4. Click **"Save and Continue"**
5. Skip scopes (click **"Save and Continue"**)
6. Add test users: Your email
7. Click **"Save and Continue"**

### Step 3: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Application type: **Web application**
4. Name: "Simple Auth Client"
5. Under **"Authorized JavaScript origins"**, add:

   ```
   https://gestures-techs.github.io
   ```

   For localhost:

   ```
   http://localhost:8080
   ```

6. Click **"Create"**
7. **Copy your Client ID**

---

## 💻 Using the App

### Step 1: Enter Client ID

1. Open [Simple Google Auth](https://gestures-techs.github.io/everything/micro-sites/simple-google-auth.html)
2. Paste your Client ID in the input field
3. Click **"Save & Init"**

### Step 2: Sign In

**Option 1: One Tap**

- A popup will automatically appear
- Click your Google account
- Done!

**Option 2: Sign-In Button**

- Click the **"Sign in with Google"** button
- Select your Google account
- Click **"Continue"** or **"Allow"**

### Step 3: View Accounts

After signing in:

- Your account appears with name, email, and picture
- Account count updates automatically
- To add another account, click the button again and choose "Use another account"

### Step 4: Remove Accounts

Click **"Remove"** button on any account to delete it from the app.

---

## 🐛 Debugging

Open browser console (`F12`) to view detailed logs:

### Successful Sign-In Logs

```
=== INIT START ===
Current URL: https://gestures-techs.github.io/everything/micro-sites/simple-google-auth.html
Client ID: 123456-abc.apps.googleusercontent.com
Initializing Google Identity Services...
Sign-in button rendered
Prompting One Tap...
=== INIT COMPLETE ===

=== HANDLE RESPONSE ===
Response received: {credential: "eyJ..."}
Decoded payload: {sub: "...", name: "John Doe", email: "john@gmail.com", ...}
Account object: {id: "...", name: "John Doe", email: "john@gmail.com", ...}
Adding new account
Total accounts: 1
Accounts saved to localStorage
UI rendered
```

---

## ⚠️ Troubleshooting

### One Tap Not Showing

**Possible Causes:**

- Already signed in before (browser remembers choice)
- User dismissed One Tap multiple times (Google disables it temporarily)
- Cookie/privacy settings blocking

**Solutions:**

1. Use the **"Sign in with Google"** button instead
2. Clear cookies for `accounts.google.com`
3. Try in incognito mode
4. Wait a few minutes and refresh

### Error: "popup_closed_by_user"

**Problem:** User closed the popup without signing in

**Solution:** Click the sign-in button again

### Error: "Invalid client"

**Problem:** Client ID is wrong or not configured properly

**Solution:**

1. Double-check Client ID copied correctly
2. Verify JavaScript origins in Google Cloud Console
3. Make sure Client ID is from a "Web application" type

### No Picture Showing

**Problem:** Google account doesn't have a profile picture

**Solution:** This is normal, the initial letter will show instead

---

## 🔒 Security Notes

- ✅ JWT ID tokens (signed by Google)
- ✅ Tokens contain user identity only (no API access)
- ✅ Client-side only, no backend required
- ⚠️ Tokens stored in localStorage
- ⚠️ Tokens expire (check `exp` field in payload)

---

## 📊 What You Get

The JWT token contains:

```json
{
  "sub": "1234567890", // User ID
  "name": "John Doe", // Full name
  "email": "john@gmail.com", // Email
  "picture": "https://...", // Profile picture URL
  "given_name": "John", // First name
  "family_name": "Doe", // Last name
  "email_verified": true, // Email verification status
  "iat": 1234567890, // Issued at timestamp
  "exp": 1234567890 // Expiration timestamp
}
```

**Note:** These are ID tokens for authentication, NOT access tokens for API calls.

---

## 🔗 Related Files

- **Live App:** [simple-google-auth.html](https://gestures-techs.github.io/everything/micro-sites/simple-google-auth.html)
- **Full Version:** [Google Multi-Account Manager](./google-multi-account-manager-guide.md) - With Gmail API
- **Enhanced Version:** [Google Identity Services Demo](./google-identity-services-guide.md) - More features

---

## 📝 Code Structure

```
simple-google-auth.html
├── Client ID input & save
├── Google Sign-In button
├── Account list display
└── Functions:
    ├── saveAndInit() - Save config & initialize
    ├── init() - Load saved data & setup GIS
    ├── handleResponse() - Process sign-in
    ├── render() - Display accounts
    └── remove() - Delete account
```

---

## 📞 Support

Having issues? Check console logs:

1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Look for logs starting with `===`
4. Copy all output and share for help

---

**Last Updated:** January 2026
