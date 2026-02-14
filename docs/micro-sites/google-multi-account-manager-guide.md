# Google Multi-Account OAuth Manager

Complete guide for setting up and using the Google OAuth Multi-Account Manager.

## 🔗 Live Demo

**[Open Google Multi-Account Manager](https://gestures-techs.github.io/everything/micro-sites/google-multi-account-manager.html)**

---

## 📋 What This Does

- Manage multiple Google accounts in one app
- OAuth 2.0 Implicit Flow (client-side only)
- Access Gmail API (Labels, Drafts, Profile)
- View Google Drive storage quota
- Browse Google Photos albums and recent media
- Store access tokens in browser localStorage
- No backend server required

---

## 🚀 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name (e.g., "My OAuth Manager")
4. Click **"Create"**

### Step 2: Enable APIs

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for and enable each of these:
   - **Gmail API**
   - **Google Drive API**
   - **Photos Library API**

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
- **Storage Quota**: Click to view Drive storage usage
- **📷 Albums**: Click to browse Google Photos albums, then click **View** on any album to see its photos
- **📸 Recent**: Click to see your 25 most recent photos/videos with thumbnails
- **📸 Fetch ALL Photos**: Full paginated library fetch — downloads metadata for your entire Google Photos library (100 items/page with progress tracking, rate-limit handling, and cancel support)
- **🖼️ Photo Picker**: Opens Google's Picker API UI to manually select photos — works even after April 2025 restrictions
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

## 🚨 403 Forbidden Troubleshooting (Google Photos API, 2025+)

If you get a 403 error from any Google Photos API endpoint (Library or Picker), follow this checklist:

### 1️⃣ Check OAuth Scopes

- For Library API: `https://www.googleapis.com/auth/photoslibrary.readonly`
- For Picker API: `https://www.googleapis.com/auth/photospicker.mediaitems.readonly`
- Your access token **must** include the correct scope(s).
- Check your token at: https://oauth2.googleapis.com/tokeninfo?access_token=YOUR_TOKEN
- If missing, re-authenticate with both scopes and `&prompt=consent`.

### 2️⃣ Test User Setup

- App must be in **Testing** mode (not published)
- Your Gmail must be added under **OAuth consent screen → Test Users**
- If not, you will get 403.

### 3️⃣ APIs Enabled

- Both **Photos Library API** and **Photos Picker API** must be enabled in Google Cloud Console → APIs & Services → Library.

### 4️⃣ Use OAuth, Not API Key

- Only use `Authorization: Bearer ACCESS_TOKEN` in your requests.
- Do **not** use `?key=API_KEY` — this will 403.

### 5️⃣ App Verification & Sensitive Scopes

- Photos scopes are sensitive. If your consent screen is incomplete, Google may block access.
- For personal use, keep app in Testing mode.

### 6️⃣ Project Creation Date

- If your project was created **after April 2025**, Google may block full-library access for new apps, even with correct scopes. Only Picker API may work for your existing photos.

### 7️⃣ Inspect the Error Message

- In DevTools, click the failed request and check the response body. Google returns JSON like:

```json
{
  "error": {
    "code": 403,
    "message": "Request had insufficient authentication scopes.",
    "status": "PERMISSION_DENIED"
  }
}
```

- The message tells you the real cause (scope, test user, etc).

### ⚡ Fast Fix

- Re-authenticate with BOTH scopes:
  - `https://www.googleapis.com/auth/photoslibrary.readonly`
  - `https://www.googleapis.com/auth/photospicker.mediaitems.readonly`
- Add `&prompt=consent` to force Google to show the consent screen again.
- Make sure you are a test user and both APIs are enabled.

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

The app currently requests these Google API scopes:

```
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/drive.metadata.readonly
https://www.googleapis.com/auth/photoslibrary.readonly
```

---

## 📸 Google Photos Access (Post-April 2025)

After April 2025, Google restricted the Photos Library API. Here's what still works for personal use:

### Option A: Library API in Testing Mode (Full Library Fetch)

**This is what "Fetch ALL Photos" uses.** Still works for personal/test apps.

**Requirements:**

1. App must be in **Testing** mode (not published) in Google Cloud Console
2. Your Google account must be added as a **test user** in OAuth Consent Screen
3. Scope: `photoslibrary.readonly`

**How it works:**

- Paginates through `mediaItems:search` at 100 items per page
- Shows real-time progress (count, pages, elapsed time)
- Handles 429 rate limits with automatic retry (5s backoff)
- Cancel button to stop mid-fetch
- Results can be exported as JSON or download URLs

**Limitations:**

- Access token expires in ~1 hour (re-authenticate for long fetches)
- Large libraries (10k+ photos) take several minutes
- Google may rate-limit heavy use
- Only works while app stays in Testing mode

### Option B: Picker API (User-Selected Photos)

**This is what "Photo Picker" uses.** Works regardless of app publishing status.

**How it works:**

1. Creates a Picker session via `photospicker.googleapis.com`
2. Opens Google's native photo selection UI
3. User selects photos manually
4. App retrieves selected media items

**Limitations:**

- Must manually select each photo (no silent full-library access)
- Requires `photospicker.mediaitems.readonly` scope (may need to add & re-auth)

### Option C: Google Takeout (Offline Alternative)

If API headaches aren't worth it:

1. Use [Google Takeout](https://takeout.google.com) to download your full library
2. Use the [Offline Image Organizer](offline-image-organizer.html) to browse locally
3. No API, no tokens, no rate limits

---

**Permissions granted:**

- Read Gmail labels and drafts (read-only)
- Access email address
- Access profile information (name, picture)
- View storage quota via Drive API
- View Google Photos albums and media items (read-only)

---

## 📚 Available Google API Scopes Reference

Below is a reference of additional scopes you can request depending on what features you need. Add them to the `scope` string in the app config to request extra permissions.

### Drive Labels API

| Scope                                  | Permission                                                                        |
| -------------------------------------- | --------------------------------------------------------------------------------- |
| `.../auth/drive.admin.labels.readonly` | See all Google Drive labels and label-related admin policies in your organisation |

### Google Drive API

| Scope                              | Permission                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `.../auth/drive`                   | See, edit, create and delete all of your Google Drive files                                  |
| `.../auth/drive.file`              | See, edit, create and delete only the specific Google Drive files that you use with this app |
| `.../auth/drive.meet.readonly`     | See and download your Google Drive files that were created or edited by Google Meet          |
| `.../auth/drive.readonly`          | See and download all your Google Drive files                                                 |
| `.../auth/docs`                    | See, edit, create and delete all of your Google Drive files                                  |
| `.../auth/drive.appdata`           | See, create and delete its own configuration data in your Google Drive                       |
| `.../auth/drive.metadata`          | View and manage metadata of files in your Google Drive                                       |
| `.../auth/drive.metadata.readonly` | View metadata for files in your Google Drive (used for storage quota)                        |
| `.../auth/drive.photos.readonly`   | View the photos, videos and albums in your Google Photos                                     |
| `.../auth/drive.apps.readonly`     | View your Google Drive apps                                                                  |
| `.../auth/drive.scripts`           | Modify your Google Apps Script scripts' behaviour                                            |
| `.../auth/drive.apps`              | View and manage your Google Drive apps                                                       |
| `.../auth/activity`                | View the activity history of your Google apps                                                |
| `.../auth/drive.activity`          | View and add to the activity record of files in your Google Drive                            |
| `.../auth/drive.activity.readonly` | View the activity record of files in your Google Drive                                       |
| `.../auth/drive.install`           | Connect itself to your Google Drive                                                          |

### Gmail API

| Scope                     | Permission                            |
| ------------------------- | ------------------------------------- |
| `.../auth/gmail.readonly` | View your email messages and settings |

### Google Photos Library API

> **⚠️ Important (April 2025 Change):** Google restricted the Photos Library API so that all endpoints — `albums.list`, `mediaItems.list`, `mediaItems:search`, etc. — now only return content **created by your app**. Existing user photos/albums are **not accessible**. See the [official notice](https://developers.google.com/photos/library/guides/overview).

| Scope                                        | Permission                                                |
| -------------------------------------------- | --------------------------------------------------------- |
| `.../auth/photoslibrary.readonly`            | View your Google Photos library (read-only)               |
| `.../auth/photoslibrary`                     | View and manage your Google Photos library                |
| `.../auth/photoslibrary.appendonly`          | Add photos and videos to your library and albums          |
| `.../auth/photoslibrary.sharing`             | Manage and add to shared albums on your behalf            |
| `.../auth/photoslibrary.edit.appcreateddata` | Edit media items (descriptions, etc.) created by your app |

**Photos Library API Endpoints:**

All endpoints are relative to `https://photoslibrary.googleapis.com`. After April 2025, all methods only return **app-created** content.

| Method  | Endpoint                                     | Description                            |
| ------- | -------------------------------------------- | -------------------------------------- |
| `GET`   | `/v1/albums`                                 | List app-created albums                |
| `GET`   | `/v1/albums/{albumId}`                       | Get app-created album details          |
| `POST`  | `/v1/albums`                                 | Create a new album                     |
| `PATCH` | `/v1/albums/{album.id}`                      | Update app-created album properties    |
| `POST`  | `/v1/albums/{albumId}:batchAddMediaItems`    | Add app-created media to album         |
| `POST`  | `/v1/albums/{albumId}:batchRemoveMediaItems` | Remove app-created media from album    |
| `POST`  | `/v1/albums/{albumId}:addEnrichment`         | Add enrichment (maps, text) to album   |
| `GET`   | `/v1/mediaItems`                             | List app-created media items           |
| `GET`   | `/v1/mediaItems/{mediaItemId}`               | Get a specific app-created media item  |
| `GET`   | `/v1/mediaItems:batchGet`                    | Batch get app-created media items      |
| `POST`  | `/v1/mediaItems:search`                      | Search app-created media items         |
| `POST`  | `/v1/mediaItems:batchCreate`                 | Upload and create media items          |
| `PATCH` | `/v1/mediaItems/{mediaItem.id}`              | Update app-created media item metadata |

**Album Resource Fields:**

| Field                   | Type    | Description                                                   |
| ----------------------- | ------- | ------------------------------------------------------------- |
| `id`                    | string  | Persistent album identifier                                   |
| `title`                 | string  | Album name (max 500 chars)                                    |
| `productUrl`            | string  | Google Photos URL (user must be signed in)                    |
| `isWriteable`           | boolean | Whether app can add media to this album                       |
| `mediaItemsCount`       | string  | Number of media items in the album                            |
| `coverPhotoBaseUrl`     | string  | Cover photo URL (append `=w{W}-h{H}` params before use)       |
| `coverPhotoMediaItemId` | string  | Media item ID for the cover photo                             |
| `shareInfo`             | object  | Sharing details (only if app-created & sharing scope granted) |

**MediaItem Resource Fields:**

| Field             | Type   | Description                                                    |
| ----------------- | ------ | -------------------------------------------------------------- |
| `id`              | string | Persistent media item identifier                               |
| `filename`        | string | Original filename                                              |
| `mimeType`        | string | MIME type (e.g., `image/jpeg`, `video/mp4`)                    |
| `description`     | string | User-set description (max 1000 chars)                          |
| `productUrl`      | string | Google Photos URL (user must be signed in)                     |
| `baseUrl`         | string | Media bytes URL (append `=w{W}-h{H}` params before use)        |
| `mediaMetadata`   | object | Contains `creationTime`, `width`, `height`, `photo` or `video` |
| `contributorInfo` | object | Contributor info (only in shared album searches)               |

**Photo Metadata:** `cameraMake`, `cameraModel`, `focalLength`, `apertureFNumber`, `isoEquivalent`, `exposureTime`

**Video Metadata:** `cameraMake`, `cameraModel`, `fps`, `status` (`PROCESSING`, `READY`, `FAILED`)

### Service Management API

| Scope                                  | Permission                                            |
| -------------------------------------- | ----------------------------------------------------- |
| `.../auth/service.management`          | Manage your Google API service configuration          |
| `.../auth/service.management.readonly` | View your Google API service configuration            |
| `.../auth/iam.test`                    | Test Identity and Access Management (IAM) Permissions |

> **Note:** All scopes are prefixed with `https://www.googleapis.com`. You must enable the corresponding API in Google Cloud Console before requesting its scopes. Users will need to re-authenticate after adding new scopes.

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

**Last Updated:** February 2026

---

## 🔑 Google OAuth Scopes Reference

Below is a reference of available Google OAuth scopes, grouped by sensitivity, with their user-facing descriptions. Use this table to decide which permissions to request for your app.

### Non-sensitive Scopes

| API       | Scope                                        | User-facing Description                                                                                              |
| --------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| User Info | .../auth/userinfo.email                      | See your primary Google Account email address                                                                        |
| User Info | .../auth/userinfo.profile                    | See your personal info, including any personal info you've made publicly available                                   |
| OpenID    | openid                                       | Associate you with your personal info on Google                                                                      |
| Drive     | .../auth/drive.file                          | See, edit, create, and delete only the specific Google Drive files you use with this app                             |
| Drive     | .../auth/drive.appdata                       | See, create, and delete its own configuration data in your Google Drive                                              |
| Drive     | .../auth/drive.install                       | Connect itself to your Google Drive                                                                                  |
| Gmail     | .../auth/gmail.addons.current.action.compose | Manage drafts and send emails when you interact with the add-on                                                      |
| Gmail     | .../auth/gmail.addons.current.message.action | View your email messages when you interact with the add-on                                                           |
| Gmail     | .../auth/gmail.labels                        | See and edit your email labels                                                                                       |
| Photos    | .../auth/photoslibrary.edit.appcreateddata   | Edit the info in your photos, videos, and albums created within this app, including titles, descriptions, and covers |

### Sensitive Scopes

| API    | Scope                                          | User-facing Description                                       |
| ------ | ---------------------------------------------- | ------------------------------------------------------------- |
| Drive  | .../auth/docs                                  | See, edit, create, and delete all of your Google Drive files  |
| Drive  | .../auth/drive.photos.readonly                 | View the photos, videos and albums in your Google Photos      |
| Drive  | .../auth/drive.apps.readonly                   | View your Google Drive apps                                   |
| Drive  | .../auth/drive.apps                            | View and manage your Google Drive apps                        |
| Drive  | .../auth/activity                              | View the activity history of your Google apps                 |
| Gmail  | .../auth/gmail.addons.current.message.metadata | View your email message metadata when the add-on is running   |
| Gmail  | .../auth/gmail.addons.current.message.readonly | View your email messages when the add-on is running           |
| Gmail  | .../auth/gmail.send                            | Send email on your behalf                                     |
| Photos | .../auth/photoslibrary                         | See, upload, and organize items in your Google Photos library |
| Photos | .../auth/photoslibrary.appendonly              | Add to your Google Photos library                             |

### Restricted Scopes

| API   | Scope                            | User-facing Description                                                              |
| ----- | -------------------------------- | ------------------------------------------------------------------------------------ |
| Drive | .../auth/drive                   | See, edit, create, and delete all of your Google Drive files                         |
| Drive | .../auth/drive.meet.readonly     | See and download your Google Drive files that were created or edited by Google Meet. |
| Drive | .../auth/drive.readonly          | See and download all your Google Drive files                                         |
| Drive | .../auth/drive.metadata          | View and manage metadata of files in your Google Drive                               |
| Drive | .../auth/drive.metadata.readonly | See information about your Google Drive files                                        |
| Drive | .../auth/drive.scripts           | Modify your Google Apps Script scripts' behavior                                     |
| Drive | .../auth/drive.activity          | View and add to the activity record of files in your Google Drive                    |
| Drive | .../auth/drive.activity.readonly | View the activity record of files in your Google Drive                               |
| Gmail | .../auth/gmail.settings.basic    | See, edit, create, or change your email settings and filters in Gmail                |
| Gmail | .../auth/gmail.settings.sharing  | Manage your sensitive mail settings, including who can manage your mail              |
| Gmail | .../auth/gmail.readonly          | View your email messages and settings                                                |
| Gmail | https://mail.google.com/         | Read, compose, send, and permanently delete all your email from Gmail                |
| Gmail | .../auth/gmail.modify            | Read, compose, and send emails from your Gmail account                               |
| Gmail | .../auth/gmail.compose           | Manage drafts and send emails                                                        |
| Gmail | .../auth/gmail.metadata          | View your email message metadata such as labels and headers, but not the email body  |
| Gmail | .../auth/gmail.insert            | Add emails into your Gmail mailbox                                                   |

---

Good — your code is actually structured properly.
The 403 is not a coding bug. It’s a policy/config issue.

Let’s break this down precisely.

🚨 Why You’re Getting 403

You are:

Using Implicit Flow (response_type=token)

Calling Photos Library API from browser

Hosting on GitHub Pages

Requesting photoslibrary.readonly

After April 2025, Google heavily restricted:

Browser-only OAuth + full-library read access

Even for testing apps.

🔎 The Real Problem

Google Photos API now behaves like this:

Scenario Result
Published app ❌ Only app-created content
Testing app (new project) ❌ Often blocked for full library
Backend OAuth flow ⚠️ Sometimes allowed
Picker API ✅ Works

Your 403 is almost certainly:

{
"error": {
"code": 403,
"status": "PERMISSION_DENIED",
"message": "Request had insufficient authentication scopes."
}
}

OR

"Access to this API has been restricted."

Even if the scope is correct.

⚠️ Critical Issue In Your Setup

You are using:

response_type = token

That is Implicit Flow.

Google is slowly killing implicit flow for sensitive scopes.

For sensitive APIs (Photos, Drive, Gmail):

👉 You should now use Authorization Code Flow + PKCE

Implicit flow + sensitive scope = 403 in many cases.

🔥 The Actual Fix
Switch from:
response_type=token

To:
response_type=code
code_challenge=...
code_challenge_method=S256

And exchange code server-side.

Yes — that means you need a small backend.

🧠 Why Gmail Works But Photos Doesn’t

Gmail works because:

It still allows implicit flow

It has broader legacy compatibility

Photos API:

More restricted

New enforcement layer

Stricter OAuth validation

📌 Also Important

In your scope you included:

gmail.readonly
drive.metadata.readonly
photoslibrary.readonly

Google may reject if:

App not verified

Too many sensitive scopes

Not in testing mode

Not added as test user

🧪 Quick Debug Step

Open DevTools → Network → click 403 request →
Copy the exact JSON response body.

That message tells exactly which rule you hit.

🎯 What Will Definitely Work

For your personal wrapper:

Option A (Cleanest & Stable)

Use Picker API only

Add scope:

https://www.googleapis.com/auth/photospicker.mediaitems.readonly

Remove full library calls

Option B (Full Library Personal Access)

Build small Node backend

Use Authorization Code Flow + PKCE

Keep app in Testing mode

Add your account as test user

⚠️ Brutal Truth

Google is intentionally blocking:

Pure browser apps

Multi-account wrappers

Mass library export tools

Even for personal use.

Your code is fine.
The policy changed.

If You Want

Tell me:

Do you want to keep this fully static (GitHub Pages)?

Or can you run a tiny Node server?

I’ll give you the exact working architecture that bypasses the 403 correctly — without violating ToS.
