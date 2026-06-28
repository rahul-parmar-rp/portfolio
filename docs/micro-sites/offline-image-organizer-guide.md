# Offline Image Organizer Guide

## Live Demo

- **URL**: https://gestures-techs.github.io/everything/docs/micro-sites/offline-image-organizer.html
- **Purpose**: Browse local folders, analyze image file properties, and preview organization by date

---

## Quick Start

### Step 1: Select Folder

1. Click "1. Select Folder" button
2. Browser will show folder picker dialog
3. Select the folder containing your images
4. App will scan all files recursively and display folder tree

### Step 2: Read Images

1. Click "2. Read Images" button
2. App filters image files (jpg, png, gif, bmp, webp, heic, raw, tiff)
3. Select organization type:
   - **Monthly Albums**: Groups by YYYY-MM (e.g., 2025-08)
   - **Daily Albums**: Groups by YYYY-MM-DD (e.g., 2025-08-30)

### Step 3: Visualize Organization

1. Click "2.5. Visualize Organization"
2. Preview shows how images will be organized
3. Click folders to expand/collapse file lists

---

## How It Works

### File System Access API

This app uses the browser's [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) to:

- Read local folders without uploading files
- Access file metadata (name, size, lastModified, type)
- Browse directory structure recursively

```javascript
// Request folder access
const rootHandle = await window.showDirectoryPicker();

// Read entries
for await (const entry of rootHandle.values()) {
  if (entry.kind === "file") {
    const file = await entry.getFile();
    console.log(file.name, file.size, file.lastModified);
  }
}
```

### File Properties Collected

The app reads ALL properties from file objects:

| Property             | Description               | Example            |
| -------------------- | ------------------------- | ------------------ |
| `name`               | File name                 | `IMG_1234.jpg`     |
| `size`               | File size in bytes        | `2048576` (2 MB)   |
| `type`               | MIME type                 | `image/jpeg`       |
| `lastModified`       | Last modified timestamp   | `1704067200000`    |
| `lastModifiedDate`   | Last modified Date object | `Mon Jan 01 2024`  |
| `webkitRelativePath` | Path (if available)       | `photos/vacation/` |
| `path`               | Custom path property      | `photos/vacation`  |

### Organization Logic

**Monthly Organization** (2025-08):

```javascript
const date = new Date(file.lastModified);
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const folderName = `${year}-${month}`;
// Result: "2025-08"
```

**Daily Organization** (2025-08-30):

```javascript
const date = new Date(file.lastModified);
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");
const folderName = `${year}-${month}-${day}`;
// Result: "2025-08-30"
```

---

## Console Logs

All operations log to console with `===` markers:

```
=== IMAGE ORGANIZER INIT ===

=== SELECT FOLDER CLICKED ===
Folder selected: Photos
Building tree for: root
Directory found: Vacation
File found: IMG_1234.jpg
Getting properties for: IMG_1234.jpg
Properties for IMG_1234.jpg: {name: "IMG_1234.jpg", size: 2048576, ...}
Total files found: 150
=== FOLDER READING COMPLETE ===

=== READ FILES CLICKED ===
Image files found: 142
Image files: ["IMG_1234.jpg", "IMG_1235.jpg", ...]
=== READ FILES COMPLETE ===

=== VISUALIZE CLICKED ===
Organization type: monthly
Groups created: ["2025-01", "2025-02", "2025-08"]
Group details: {
  "2025-01": ["IMG_0001.jpg", "IMG_0002.jpg"],
  "2025-08": ["IMG_1234.jpg", "IMG_1235.jpg"]
}
Sorted folders: ["2025-01", "2025-02", "2025-08"]
=== VISUALIZE COMPLETE ===
```

---

## Supported Image Formats

| Extension       | Format | Supported |
| --------------- | ------ | --------- |
| `.jpg`, `.jpeg` | JPEG   | ✅ Yes    |
| `.png`          | PNG    | ✅ Yes    |
| `.gif`          | GIF    | ✅ Yes    |
| `.bmp`          | Bitmap | ✅ Yes    |
| `.webp`         | WebP   | ✅ Yes    |
| `.heic`         | HEIC   | ✅ Yes    |
| `.raw`          | RAW    | ✅ Yes    |
| `.tiff`, `.tif` | TIFF   | ✅ Yes    |

**Detection Regex**:

```javascript
/\.(jpe?g|png|gif|bmp|webp|heic|raw|tiff?)$/i;
```

---

## Browser Compatibility

### File System Access API Support

| Browser | Version | Supported  |
| ------- | ------- | ---------- |
| Chrome  | 86+     | ✅ Yes     |
| Edge    | 86+     | ✅ Yes     |
| Opera   | 72+     | ✅ Yes     |
| Safari  | 15.2+   | ⚠️ Partial |
| Firefox | -       | ❌ No      |

**Check Support**:

```javascript
if ("showDirectoryPicker" in window) {
  console.log("✅ File System Access API supported");
} else {
  console.log("❌ Not supported - use Chrome/Edge");
}
```

---

## Troubleshooting

### ❌ "showDirectoryPicker is not defined"

**Problem**: Browser doesn't support File System Access API

**Solution**:

1. Use Chrome 86+, Edge 86+, or Opera 72+
2. Firefox doesn't support this API
3. Safari has limited support (15.2+)

---

### ❌ "User cancelled folder selection"

**Problem**: User clicked "Cancel" in folder picker

**Solution**:

- Click "1. Select Folder" again
- Grant permission when prompted
- Some browsers require user gesture (can't auto-trigger)

---

### ❌ No images found (0 images)

**Problem**: Selected folder has no image files

**Check**:

1. Look at "File Details" table
2. Verify files have image extensions (jpg, png, etc.)
3. Check console logs for file names
4. Ensure files aren't in unsupported formats

**Console Debug**:

```javascript
// View all files found
console.log(allFiles);

// Check file extensions
allFiles.forEach((f) => console.log(f.name, f.type));
```

---

### ❌ Cannot read file properties

**Problem**: Permission denied or file access error

**Solution**:

1. Ensure browser has permission to access folder
2. Close file if open in another program
3. Check file isn't locked or encrypted
4. Try selecting parent folder instead

---

### ⚠️ File table shows "undefined" values

**Problem**: Some properties not available for certain files

**Explanation**:

- Not all properties exist on all File objects
- Browser/OS dependent
- `webkitRelativePath` only available for `<input type="file" webkitdirectory>`
- Custom properties like `path` added by app

---

### ❌ Organization button disabled

**Problem**: Feature currently disabled (noted in code)

**Status**:

- App focuses on file property display and preview
- Actual file organization (moving files) temporarily disabled
- Visualization still works

---

## Privacy & Security

### ⚠️ Data Stays Local

- **No uploads**: All processing happens in browser
- **No server**: Files never leave your computer
- **No network**: Works completely offline (after loading page)
- **No storage**: File data not saved in localStorage or cookies

### ⚠️ Permissions

- Browser requests permission each time you select folder
- Permission is temporary (per session)
- No persistent access to your files
- You can revoke permission by closing tab

### ⚠️ Security Considerations

- Only works on HTTPS (GitHub Pages is HTTPS)
- Can't access system folders without explicit permission
- Can't modify files (read-only access via getFile())
- Organization feature disabled to prevent accidental changes

---

## Use Cases

### 📸 Photo Library Analysis

1. Select your photos folder
2. View all image files with metadata
3. See file sizes, dates, types
4. Preview organization by month/day

### 🗂️ Folder Structure Review

1. Select any folder
2. See complete directory tree
3. Click folders to expand/collapse
4. View file details in table

### 📅 Date-Based Organization Planning

1. Read images from folder
2. Choose organization type (monthly/daily)
3. Visualize how images would be grouped
4. See which dates have most photos

### 🔍 Metadata Inspection

1. Select folder with files
2. View comprehensive file properties table
3. Check lastModified dates
4. Verify file types and sizes

---

## Technical Details

### File Object Properties

Full File object typically contains:

```javascript
{
  name: "IMG_1234.jpg",
  size: 2048576,
  type: "image/jpeg",
  lastModified: 1704067200000,
  lastModifiedDate: Date,
  webkitRelativePath: "",
  path: "photos/vacation"  // Added by app
}
```

### Directory Traversal

```javascript
async function buildTree(dirHandle, parentElement, currentPath) {
  for await (const entry of dirHandle.values()) {
    if (entry.kind === "directory") {
      // Recurse into subdirectory
      await buildTree(entry, childUl, fullPath);
    } else {
      // Process file
      const file = await entry.getFile();
      allFiles.push(getFileProperties(file));
    }
  }
}
```

### Date Formatting

**Display Name Examples**:

- Monthly: `2025-08 (August 2025)`
- Daily: `2025-08-30 (Saturday, August 30, 2025)`

**Code**:

```javascript
// Monthly
const date = new Date(year, month - 1);
date.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
});

// Daily
const date = new Date(year, month - 1, day);
date.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
```

---

## Feature Status

| Feature               | Status      | Notes                         |
| --------------------- | ----------- | ----------------------------- |
| Folder selection      | ✅ Working  | File System Access API        |
| File property display | ✅ Working  | Shows all properties in table |
| Folder tree view      | ✅ Working  | Expandable/collapsible        |
| Image filtering       | ✅ Working  | 8 formats supported           |
| Organization preview  | ✅ Working  | Monthly/daily grouping        |
| Actual file moving    | ⚠️ Disabled | Currently disabled            |
| Console logging       | ✅ Working  | All operations logged         |

---

## Related Files

- [Android XML XPath Validator](android-xml-xpath-validator.html) - Parse and validate XML
- [Gmail Send](gmail-send.html) - Send emails from multiple accounts
- [Google Multi-Account Manager](google-multi-account-manager.html) - OAuth demo

---

## Support

**Console Debug Commands**:

```javascript
// View all files
console.table(allFiles);

// View image files only
console.table(imageFiles);

// View file count by extension
const counts = {};
allFiles.forEach((f) => {
  const ext = f.name.split(".").pop();
  counts[ext] = (counts[ext] || 0) + 1;
});
console.table(counts);

// View files by date
imageFiles
  .sort((a, b) => a.lastModified - b.lastModified)
  .forEach((f) => console.log(new Date(f.lastModified), f.name));
```

**Check Browser Support**:

```javascript
const support = {
  "File System Access API": "showDirectoryPicker" in window,
  "File API": "File" in window,
  FileReader: "FileReader" in window,
};
console.table(support);
```
