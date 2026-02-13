Skip to main content
Google Photos APIs
Photos APIs
Overview
Picker API

Ambient API
Library API

Support
Partner Program
Search
/

English

Overview
Filter

On April 1st, 2025, some scopes in the Library API were removed. Read about the details here.
Home
Products
Google Photos APIs
Overview
Was this helpful?

Authorization scopes

Spark icon
Page Summary
The Google Photos APIs contain multiple scopes used to access media items and albums. The responses returned from various calls are different based on which scopes have been requested by the developer.

Note: If your application accesses the Google Photos APIs, it must pass the OAuth verification review. If you see unverified app on the screen when testing your application, you must submit a verification request to remove it. Find out more about unverified apps and get answers to frequently asked questions about app verification in the Help Center.

This verification is independent and in addition to any reviews conducted as part of the Google Photos APIs partner program.

Every request your application sends to the Google Photos APIs must include an authorization token. The token also identifies your application to Google.

About authorization protocols
Your application must use OAuth 2.0 to authorize requests. No other authorization protocols are supported. If your application uses Sign In With Google, some aspects of authorization are handled for you.

Authorizing requests with OAuth 2.0
All requests to the Google Photos APIs must be authorized by an authenticated user.

The details of the authorization process, or "flow," for OAuth 2.0 vary somewhat depending on what kind of application you're writing. The following general process applies to all application types:

When you create your application, you register it using the Google API Console. Google then provides information you'll need later, such as a client ID and a client secret.
Activate the Google Photos APIs in the Google API Console. (If the API isn't listed in the API Console, then skip this step.)
When your application needs access to user data, it asks Google for a particular scope of access.
Google displays a consent screen to the user, asking them to authorize your application to request some of their data.
If the user approves, then Google gives your application a short-lived access token.
Your application requests user data, attaching the access token to the request.
If Google determines that your request and the token are valid, it returns the requested data.
Some flows include additional steps, such as using refresh tokens to acquire new access tokens. For detailed information about flows for various types of applications, see Google's OAuth 2.0 documentation.

Here's the OAuth 2.0 scope information for the Google Photos APIs:

Picker API scopes
Scope Meaning
https://www.googleapis.com/auth/photospicker.mediaitems.readonly
Access to create, get, and delete sessions, and to list media items for sessions.

Library API scopes
Scope Meaning
https://www.googleapis.com/auth/photoslibrary.readonly

https://www.googleapis.com/auth/photoslibrary.sharing

https://www.googleapis.com/auth/photoslibrary
Warning: These scopes are being removed as part of the updates to the Google Photos APIs. After March 31, 2025, you will only be able to access content created by your application. Please review the other available scopes and adjust your application's authorization requests accordingly.
If your app needs to select photos from a user's library, use the new Picker API.
For new development, use the updated Library API documentation.
If you're migrating an existing application, refer to the legacy Library API documentation for additional support.
https://www.googleapis.com/auth/photoslibrary.appendonly
Write access only.

Access to upload bytes, create media items, create albums, and add enrichments. Only allows new media to be created in the user's library and in albums created by the app.

https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata
Read access to media items and albums created by the developer. For more information, see Access media items and List library contents, albums, and media items.

Intended to be requested together with the photoslibrary.appendonly scope.

https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata
Edit access only.

Access to change these details for albums and media items created by the developer:

Organize the photos and videos in your albums (Add to albums , remove from albums, and update position).
Album titles and cover photos
Media item descriptions
To request access using OAuth 2.0, your application needs the scope information, as well as information that Google supplies when you register your application (such as the client ID and the client secret).

Tip: The Google APIs client libraries can handle some of the authorization process for you. They are available for a variety of programming languages; check the page with libraries and samples for more details.

Selecting scopes
As a general rule, choose the most restrictive scope possible and avoid requesting scopes that your app does not need. Users more readily grant access to limited, clearly described scopes. Users may hesitate to grant broad access to their media unless they trust your app and understand why it needs the information.

Incrementally requesting scopes
Following best practices for authorization, your application should only request scopes as they are needed. Avoid requesting all scopes for your application up-front at sign-in. Instead, provide justification and make the request in context. Clearly explain what you will do with your users' data and how they will benefit by granting access, as per the UX Guidelines and best practices to provide notice and ask for consent.

Service accounts
The Google Photos APIs don't support service accounts. Your application must use the other OAuth 2.0 flows available such as OAuth 2.0 for web server applications or OAuth 2.0 for mobile and desktop apps.

Was this helpful?

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-08-28 UTC.

Connect
Blog
Bluesky
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Program
Google Developer Groups
Google Developer Experts
Accelerators
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console
Google Developers
Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy

English
Page info
bug_report
fullscreen
close
On this page

Skip to main content
Google Photos APIs
Photos APIs
Overview
Picker API

Ambient API
Library API

Support
Partner Program
Search
/

English

Library API
Guides
Reference
Samples
Filter

On April 1st, 2025, some scopes in the Library API were removed. Read about the details here.
Home
Products
Google Photos APIs
Library API
Reference
Was this helpful?

Photos Library API

Spark icon
Page Summary
Manage photos, videos, and albums created by your app in Google Photos

Service: photoslibrary.googleapis.com
Service endpoint
A service endpoint is a base URL that specifies the network address of an API service. One service might have multiple service endpoints. This service has the following service endpoint and all URIs below are relative to this service endpoint:

https://photoslibrary.googleapis.com
REST Resource: v1.albums
Methods
addEnrichment POST /v1/albums/{albumId}:addEnrichment
Adds an enrichment at a specified position in an app created created album.
batchAddMediaItems POST /v1/albums/{albumId}:batchAddMediaItems
Adds one or more app created media items in a user's Google Photos library to an app created album.
batchRemoveMediaItems POST /v1/albums/{albumId}:batchRemoveMediaItems
Removes one or more app created media items from a specified app created album.
create POST /v1/albums
Creates an album in a user's Google Photos library.
get GET /v1/albums/{albumId}
Returns the app created album based on the specified albumId.
list GET /v1/albums
Lists all albums created by your app.
patch PATCH /v1/albums/{album.id}
Update the app created album with the specified id.
REST Resource: v1.mediaItems
Methods
batchCreate POST /v1/mediaItems:batchCreate
Creates one or more media items in a user's Google Photos library.
batchGet GET /v1/mediaItems:batchGet
Returns the list of app created media items for the specified media item identifiers.
get GET /v1/mediaItems/{mediaItemId}
Returns the app created media item for the specified media item identifier.
list GET /v1/mediaItems
List all media items created by your app from a user's Google Photos library.
patch PATCH /v1/mediaItems/{mediaItem.id}
Update the app created media item with the specified id.
search POST /v1/mediaItems:search
Searches for app created media items in a user's Google Photos library.
Was this helpful?

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-04-01 UTC.

Connect
Blog
Bluesky
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Program
Google Developer Groups
Google Developer Experts
Accelerators
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console
Google Developers
Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy

English
Page info
bug_report
fullscreen
close
On this page
The new page has loaded.

Skip to main content
Google Photos APIs
Photos APIs
Overview
Picker API

Ambient API
Library API

Support
Partner Program
Search
/

English

Library API
Guides
Reference
Samples
Filter

On April 1st, 2025, some scopes in the Library API were removed. Read about the details here.
Home
Products
Google Photos APIs
Library API
Was this helpful?

Search and apply filters

Spark icon
Page Summary
Required authorization scopes
The photoslibrary.readonly scope allows access to all media items in the user's library.

Searching and applying filters to app-created content requires the photoslibrary.readonly.appcreateddata scope. For more information on scopes, see Authorization scopes.

Available filters
You can search a user's library of app-created media items for specific kinds of media. For example, you might only want items that are of animals, from a certain day, or you may want to exclude photos of receipts. You can exclude or include specific items by applying filters to an album or library listing. There are five available filters based on media item properties:

Content categories (includedContentCategories, excludedContentCategories)
Dates and date ranges (dates, ranges)
Features (featureFilter)
Media types (mediaTypeFilter)
Archived state (includeArchivedMedia)
Filters shouldn't be used in a mediaItems.search request if the albumId is set. If a filter is used when the albumId is set, an INVALID_ARGUMENT error (400) is returned.

Results are sorted according to the media item creation time. The sort order can be modified for queries using date filters.

Allow some time for newly uploaded media to appear in your searches. The media appears in unfiltered searches immediately.

Media items that have a date in the future don't appear in filtered searches. They appear in unfiltered searches and album searches.

Applying a filter
To apply a filter, call mediaItems.search and specify the filter property.

REST
Java
PHP
Here is a POST request:

POST https://photoslibrary.googleapis.com/v1/mediaItems:search
Content-type: application/json
Authorization: Bearer oauth2-token
{
"pageSize": "100",
"filters": {
...
}
}
The POST request returns the following response:

{
"mediaItems": [
...
],
"nextPageToken": "token-for-pagination"
}
For details, see List library contents, albums, and media items.

Content categories
All media items are processed and assigned labels. You can include and exclude any of the following categories.

ANIMALS FASHION LANDMARKS RECEIPTS WEDDINGS
ARTS FLOWERS LANDSCAPES SCREENSHOTS WHITEBOARDS
BIRTHDAYS FOOD NIGHT SELFIES
CITYSCAPES GARDENS PEOPLE SPORT
CRAFTS HOLIDAYS PERFORMANCES TRAVEL
DOCUMENTS HOUSES PETS UTILITY
Utility photos cover a broad range of media. This category generally includes items the user has captured to perform some task and is unlikely to want after that task is completed. It includes documents, receipts, screenshots, sticky notes, menus, and other similar media items.

The categories are only as accurate as the equivalent labels in Google Photos. On occasion, items may be mislabeled, so we don't guarantee the accuracy of the content category filters.

Including categories
When you include multiple categories, media items that match any of the categories are included. A maximum of 10 categories can be included per request. This example filter returns any items of LANDSCAPES or LANDMARKS.

REST
Java
PHP
{
"filters": {
"contentFilter": {
"includedContentCategories": [
"LANDSCAPES",
"LANDMARKS"
]
}
}
}
Excluding categories
Only media items that don't match any of the excluded categories are shown. Similar to the included categories, a maximum of 10 categories can be excluded per request.

This filter returns any items that aren't PEOPLE or SELFIES:

REST
Java
PHP
{
"filters": {
"contentFilter": {
"excludedContentCategories": [
"PEOPLE",
"SELFIES"
]
}
}
}
Including and excluding multiple categories
You can include some categories and exclude others. The following example returns LANDSCAPES and LANDMARKS, but removes any media items that contain PEOPLE or that are SELFIES:

REST
Java
PHP
{
"filters": {
"contentFilter": {
"includedContentCategories": [
"LANDSCAPES",
"LANDMARKS"
],
"excludedContentCategories": [
"PEOPLE",
"SELFIES"
]
}
}
}
Dates and date ranges
Date filters restrict the date of the returned results to a specified set of days. There are two ways to specify a date filter: dates, or ranges. Dates and ranges can be used together. Media items that match any of the dates or date ranges are returned. Optionally, the sort order of results can be modified.

Note: Media items uploaded without metadata specifying the date the media item was captured will not be returned in queries using date filters. Google Photos server upload time is not used as a fallback in this case.
Dates
A date contains a year, month, and day. The following formats are acceptable:

Year
Year, month
Year, month, day
Month, day
Month
Where a component of the date is empty or set to zero, it's treated as a wildcard. For example, if you set the day and month, but not the year, you're requesting items from that day and month of any year:

REST
Java
PHP
{
"filters": {
"dateFilter": {
"dates": [
{
"month": 2,
"day": 15
}
]
}
}
}
Date ranges
Date ranges provide more flexibility than dates. For example, rather than adding multiple dates, a date range can be used to see a set of days within a month.

A date range has a startDate and endDate, both of which must be set. Each date in the range has the same format constraints as described in Dates. The dates must have the same format: if the start date is a year and a month, the end date must also be a year and a month. The ranges are applied inclusively, the start and end dates are included in the applied filter:

REST
Java
PHP
{
"filters": {
"dateFilter": {
"ranges": [
{
"startDate": {
"year": 2014,
"month": 6,
"day": 12
},
"endDate": {
"year": 2014,
"month": 7,
"day": 13
}
}
]
}
}
}
Combining dates and date ranges
You can use multiple dates and multiple date ranges at the same time. Items that fall within any of these dates are included in the results. Separate dates and date ranges don't need to follow the same format, but the start and end dates of individual ranges do:

REST
Java
PHP
{
"filters": {
"dateFilter": {
"dates": [
{
"year": 2013
},
{
"year": 2011,
"month": 11
}
],
"ranges": [
{
"startDate": {
"month": 1
},
"endDate": {
"month": 3
}
},
{
"startDate": {
"month": 3,
"day": 24
},
"endDate": {
"month": 5,
"day": 2
}
}
]
}
}
}
Media item features
Feature filters restrict results to items that have specific features, for example that have been marked as favorites in the Google Photos application.

Favorites
Include the FAVORITES item feature in the FeatureFilter to only return media items that have been marked as favorites by the user:

REST
Java
PHP
{
"filters" : {
"featureFilter": {
"includedFeatures": [
"FAVORITES"
]
}
}
}
Media types
You can limit results to the type of media: either photo or video.

Photo
A PHOTO can be any of several image formats:

BMP JPG
GIF PNG
HEIC TIFF
ICO WEBP
It also includes special photo types like iOS live photos, motion photos, panoramas, photo spheres, and VR photos.

Video
A VIDEO can be various video formats:

3GP MMV
3G2 MOD
ASF MOV
AVI MP4
DIVX MPG
M2T MTS
M2TS TOD
M4V WMV
MKV
VIDEO also includes special video formats like the following: VR videos, slow-motion videos, and animations created in the Google Photos application.

The following example filters by PHOTO:

REST
Java
PHP
{
"filters": {
"mediaTypeFilter": {
"mediaTypes": [
"PHOTO"
]
}
}
}
Multiple media types filters can't be combined.

Archived state
Your users may have archived some of their photos. By default, archived photos aren't returned in searches. To include archived items, you can set a flag in the filter as shown in the following example:

REST
Java
PHP
{
"filters": {
"includeArchivedMedia": true
}
}
Combining filters
Different kinds of filters can be combined. Only items that match all of the requested features are returned.

When combining filters, the formatting restrictions for each filter type are the same as when they're used individually. In the following example, only photos that have been categorized as SPORT and that are from either 2014 or 2010 are returned:

REST
Java
PHP
{
"filters": {
"contentFilter": {
"includedContentCategories": [
"SPORT"
]
},
"dateFilter": {
"dates": [
{
"year": 2014
},
{
"year": 2010
}
]
},
"mediaTypeFilter": {
"mediaTypes": [
"PHOTO"
]
}
}
}
Sorting results
Only queries using date filters can be sorted.

If you do not specify a sorting option, then your results will be sorted in descending order (newest first).

This table shows the supported options for the orderBy parameter:

orderBy parameter
MediaMetadata.creation_time desc Returns media items in descending order (newest items first)
MediaMetadata.creation_time Returns media items in ascending order (oldest items first)
The following example returns all media items from 2017, showing the oldest first and the newest last.

REST
Java
PHP
{
"filters": {
"dateFilter": {
"dates": [
{
"year": 2017
}
]
}
},
"orderBy": "MediaMetadata.creation_time"
}
Was this helpful?

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-12-03 UTC.

Connect
Blog
Bluesky
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Program
Google Developer Groups
Google Developer Experts
Accelerators
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console
Google Developers
Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy

English
Page info
bug_report
fullscreen
close
On this page
The new page has loaded..

Skip to main content
Google Photos APIs
Photos APIs
Overview
Picker API

Ambient API
Library API

Support
Partner Program
Search
/

English

Library API
Guides
Reference
Samples
Filter

On April 1st, 2025, some scopes in the Library API were removed. Read about the details here.
Home
Products
Google Photos APIs
Library API
Reference
Was this helpful?

Photos Library API

Spark icon
Page Summary
Manage photos, videos, and albums created by your app in Google Photos

Service: photoslibrary.googleapis.com
Service endpoint
A service endpoint is a base URL that specifies the network address of an API service. One service might have multiple service endpoints. This service has the following service endpoint and all URIs below are relative to this service endpoint:

https://photoslibrary.googleapis.com
REST Resource: v1.albums
Methods
addEnrichment POST /v1/albums/{albumId}:addEnrichment
Adds an enrichment at a specified position in an app created created album.
batchAddMediaItems POST /v1/albums/{albumId}:batchAddMediaItems
Adds one or more app created media items in a user's Google Photos library to an app created album.
batchRemoveMediaItems POST /v1/albums/{albumId}:batchRemoveMediaItems
Removes one or more app created media items from a specified app created album.
create POST /v1/albums
Creates an album in a user's Google Photos library.
get GET /v1/albums/{albumId}
Returns the app created album based on the specified albumId.
list GET /v1/albums
Lists all albums created by your app.
patch PATCH /v1/albums/{album.id}
Update the app created album with the specified id.
REST Resource: v1.mediaItems
Methods
batchCreate POST /v1/mediaItems:batchCreate
Creates one or more media items in a user's Google Photos library.
batchGet GET /v1/mediaItems:batchGet
Returns the list of app created media items for the specified media item identifiers.
get GET /v1/mediaItems/{mediaItemId}
Returns the app created media item for the specified media item identifier.
list GET /v1/mediaItems
List all media items created by your app from a user's Google Photos library.
patch PATCH /v1/mediaItems/{mediaItem.id}
Update the app created media item with the specified id.
search POST /v1/mediaItems:search
Searches for app created media items in a user's Google Photos library.
Was this helpful?

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-04-01 UTC.

Connect
Blog
Bluesky
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Program
Google Developer Groups
Google Developer Experts
Accelerators
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console
Google Developers
Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy

English
Page info
bug_report
fullscreen
close
On this page
The new page has loaded.
Skip to main content
Google Photos APIs
Photos APIs
Overview
Picker API

Ambient API
Library API

Support
Partner Program
Search
/

English

Library API
Guides
Reference
Samples
On April 1st, 2025, some scopes in the Library API were removed. Read about the details here.
Home
Products
Google Photos APIs
Library API
Samples
Was this helpful?

Samples

You can explore the legacy Library API samples.

Remember that the Library API is being updated to focus on managing photos and videos created by your app. Some of the functionalities demonstrated in the legacy samples might not be available after the changes take effect on March 31, 2025.

Was this helpful?

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-08-28 UTC.

Connect
Blog
Bluesky
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Program
Google Developer Groups
Google Developer Experts
Accelerators
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console
Google Developers
Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy

English
Page info
bug_report
fullscreen
close
No additional info available on this page.

The new page has loaded..

Skip to main content
Google Photos Library API (Legacy documentation)
Photos Library API (Legacy documentation)
Search
/

English

Guides
Reference
Samples
Back to current Photos API docs
You are viewing the legacy documentation for the Google Photos Library API.
Read about the updates to the Library API.
Navigate back to the current Photos API docs.
Home
Products
Google Photos Library API (Legacy documentation)
Samples
Was this helpful?

Samples

Spark icon
Page Summary
Samples for the Google Photos Library API are available from the Google Photos sample repository on GitHub. In addition, you can find code snippets on each page of this developer's guide.

Samples on GitHub
The GitHub repository contains a sample that shows the search and list functionality of the Library API as implemented in an online photo frame using Node JS.

The GitHub repositories for each client library contain multiple samples that show how to use the Library API in different languages.

Troubleshooting
If you're having trouble using the samples, make sure that you've done the following:

Set up a Google Developer's project.
Enabled the API.
Set up OAuth credentials.
The OAuth credentials need to be added to the sample project. For details, see the README. `

Code snippets in the developer's guide
Each page in the developer's guide includes code snippets and REST calls that illustrate particular features of the API. Some of the guides available for features include the following:

Managing albums
Listing library contents, albums, and media items
Searching media and applying filters
Was this helpful?

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-08-28 UTC.

Connect
Blog
Bluesky
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Program
Google Developer Groups
Google Developer Experts
Accelerators
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console
Google Developers
Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy

English
Page info
bug_report
fullscreen
close
On this page
The new page has loaded.

https://github.com/googlesamples/google-photos

Skip to content
googlesamples
google-photos
Repository navigation
Code
Issues
10
(10)
Pull requests
13
(13)
Actions
Projects
Security
Insights
Files
Go to file
t
REST/PhotoFrame
images
static
views
.gitignore
README.md
app.js
auth.js
config.js
package-lock.json
package.json
CONTRIBUTING.md
LICENSE
README.md
google-photos/REST
/PhotoFrame/
chrisachard
chrisachard
update dependencies
6f9e4ce
·
4 years ago
google-photos/REST
/PhotoFrame/
Name Last commit message Last commit date
..
images
Initial version of photo frame sample. 🎉🎈📸
8 years ago
static
fix media items count for albums list
8 years ago
views
Update dependencies and associated code changes.
5 years ago
.gitignore
Initial version of photo frame sample. 🎉🎈📸
8 years ago
README.md
Update dependencies and README.
5 years ago
app.js
Use import.meta.url to get the paths for serving node module files.
5 years ago
auth.js
Update dependencies and associated code changes.
5 years ago
config.js
Update dependencies and associated code changes.
5 years ago
package-lock.json
update dependencies
4 years ago
package.json
update dependencies
4 years ago
README.md
Photo Frame Sample
This is a Node.js sample application for the Google Photos Library API.

This sample shows how to connect an app with Google Photos through OAuth 2.0 and display a user's photos and albums in an "online photo frame".

This app is built using Express.js and Material Design Lite.

App Overview
This web app is an online photo frame that allows users to load photos from a search, an album or the library and then show these images in a full screen slideshow.

Screenshots
Screenshot of photo frame Screenshot of login screen

Set up
Before you can run this sample, you must set up a Google Developers project and configure authentication credentials. Follow the get started guide to complete these steps:

Set up a Google Developers Project and enable the Google Photos Library API.
In your project, set up new OAuth credentials for a web server application. Set the authorized JavaScript origin to http://127.0.0.1 and the authorized redirect URL to http://127.0.0.1:8080/auth/google/callback if you are running the app locally.
The console will display your authentication credentials. Add the Client ID and Client secret to the file config.js, replacing the placeholder values:
// The OAuth client ID from the Google Developers console.
config.oAuthClientID = 'ADD YOUR CLIENT ID';

// The OAuth client secret from the Google Developers console.
config.oAuthclientSecret = 'ADD YOUR CLIENT SECRET';
You are now ready to run the sample:

Ensure Node.JS and npm are installed and available on your system. You need a recent Node.js version (v14 or later) to run this sample.
Navigate to the directory of this sample: REST/PhotoFrame.
Install dependencies: Run npm install,
Start the app: Run node app.js.
By default, the app will listen on port 8080. Open a web browser and navigate to http://127.0.0.1:8080 to access the app.

Troubleshooting
Make sure that you have configured the Client ID and the Client secret in the configuration file config.js. Also check that the URLs configured for these credentials match how you access the server. By default this is configured for 127.0.0.1 (localhost) on port 8080.

You can also start the app with additional debug logging by setting the DEBUG environment variable to true. For example:

DEBUG=TRUE node app.js
API Use and code overview
The app is built using the Express.js framework and the ejs templating system.

First, the user has to log in via OAuth 2.0 and authorize the https://www.googleapis.com/auth/photoslibrary.readonly scope. (See the file config.js.) Once authenticated, photos are loaded into the photo frame via search or from an album.

The app is split into the backend (app.js) and the front end (static/...). The photo frame preview screen make AJAX requests to the backend to load a list of selected photos. Likewise, the album screen makes an AJAX request to the backend to load the list of albums that are owned by the user. The backend returns media items or albums directly from the Library API that are parsed and rendered in the browser.

Search
The search screen (/search) is loaded from a template file located at views/pages/search.ejs that contains the search form. When this form is submitted, the POST request is received in app.js in the handler app.post('/loadFromSearch', ...). The values sent in the form are used to prepare a [filter] object that is then submitted to the Google Photos Library API /search endpoint in libraryApiSearch(authToken, parameters).

The call to the API in libraryApiSearch(authToken, parameters) shows how to handle the nextPageToken to retrieve multiple pages of search results.

Albums
The album screen (/album) is loaded from a template file located at views/pages/album.ejs. When this screen is loaded, the browser makes a request to /getAlbums that is received by the server app.js in the handler app.get('/getAlbums', ...). The method libraryApiGetAlbums(authToken) is called to load the albums from the API. This method shows to handle the nextPageToken to retrieve a complete list of all albums owned by the user.

The retrieved [albums] are returned and displayed through the file static/js/album.js. Here the album objects are parsed and the title, cover photo and number of items are rendered on screen.

When an album is selected, the handler app.post('/loadFromAlbum', ...) receives the id of the album that was picked. Here, a search parameter is constructed and passed to libraryApiSearch(authToken, parameters) to load the images.

Displaying photos
Photos are displayed on the photo frame page of this app. The template file is located at views/pages/frame.ejs. When this page is loaded, a request is made to app.get('/getQueue', ...) to the server app.js.

This handler returns a list of the mediaItems the user has loaded into the frame through search or from an album. They are rendered for display by the browser through the file static/js/frame.js. Here the caption is constructed from the description and other media metadata. A thumbnail, scaled based on the original height and width, is used to render a preview initially while the image at full resolution is being loaded.

// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START app]

import bodyParser from 'body-parser';
import express from 'express';
import expressWinston from 'express-winston';
import fetch from 'node-fetch';
import http from 'http';
import passport from 'passport';
import persist from 'node-persist';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import winston from 'winston';

import {auth} from './auth.js';
import {config} from './config.js';
import {fileURLToPath} from 'url';

const app = express();
const fileStore = sessionFileStore(session);
const server = http.Server(app);

// Use the EJS template engine
app.set('view engine', 'ejs');

// Disable browser-side caching for demo purposes.
app.disable('etag');

// Set up a cache for media items that expires after 55 minutes.
// This caches the baseUrls for media items that have been selected
// by the user for the photo frame. They are used to display photos in
// thumbnails and in the frame. The baseUrls are send to the frontend and
// displayed from there. The baseUrls are cached temporarily to ensure that the
// app is responsive and quick. Note that this data should only be stored for a
// short amount of time and that access to the URLs expires after 60 minutes.
// See the 'best practices' and 'acceptable use policy' in the developer
// documentation.
const mediaItemCache = persist.create({
dir: 'persist-mediaitemcache/',
ttl: 3300000, // 55 minutes
});
mediaItemCache.init();

// Temporarily cache a list of the albums owned by the user. This caches
// the name and base Url of the cover image. This ensures that the app
// is responsive when the user picks an album.
// Loading a full list of the albums owned by the user may take multiple
// requests. Caching this temporarily allows the user to go back to the
// album selection screen without having to wait for the requests to
// complete every time.
// Note that this data is only cached temporarily as per the 'best practices' in
// the developer documentation. Here it expires after 10 minutes.
const albumCache = persist.create({
dir: 'persist-albumcache/',
ttl: 600000, // 10 minutes
});
albumCache.init();

// For each user, the app stores the last search parameters or album
// they loaded into the photo frame. The next time they log in
// (or when the cached data expires), this search is resubmitted.
// This keeps the data fresh. Instead of storing the search parameters,
// we could also store a list of the media item ids and refresh them,
// but resubmitting the search query ensures that the photo frame displays
// any new images that match the search criteria (or that have been added
// to an album).
const storage = persist.create({dir: 'persist-storage/'});
storage.init();

// Set up OAuth 2.0 authentication through the passport.js library.
auth(passport);

// Set up a session middleware to handle user sessions.
// NOTE: A secret is used to sign the cookie. This is just used for this sample
// app and should be changed.
const sessionMiddleware = session({
resave: true,
saveUninitialized: true,
store: new fileStore({}),
secret: 'photo frame sample',
});

// Console transport for winton.
const consoleTransport = new winston.transports.Console();

// Set up winston logging.
const logger = winston.createLogger({
format: winston.format.combine(
winston.format.colorize(),
winston.format.simple()
),
transports: [
consoleTransport
]
});

// Enable extensive logging if the DEBUG environment variable is set.
if (process.env.DEBUG) {
// Print all winston log levels.
logger.level = 'silly';

// Enable express.js debugging. This logs all received requests.
app.use(expressWinston.logger({
transports: [
consoleTransport
],
winstonInstance: logger
}));

} else {
// By default, only print all 'verbose' log level messages or below.
logger.level = 'verbose';
}

// Set up static routes for hosted libraries.
app.use(express.static('static'));
app.use('/js',
express.static(
fileURLToPath(
new URL('./node_modules/jquery/dist/', import.meta.url)
),
)
);

app.use(
'/fancybox',
express.static(
fileURLToPath(
new URL('./node_modules/@fancyapps/fancybox/dist/', import.meta.url)
),
)
);
app.use(
'/mdlite',
express.static(
fileURLToPath(
new URL('./node_modules/material-design-lite/dist/', import.meta.url)
),
)
);

// Parse application/json request data.
app.use(bodyParser.json());

// Parse application/xwww-form-urlencoded request data.
app.use(bodyParser.urlencoded({extended: true}));

// Enable user session handling.
app.use(sessionMiddleware);

// Set up passport and session handling.
app.use(passport.initialize());
app.use(passport.session());

// Middleware that adds the user of this session as a local variable,
// so it can be displayed on all pages when logged in.
app.use((req, res, next) => {
res.locals.name = '-';
if (req.user && req.user.profile && req.user.profile.name) {
res.locals.name =
req.user.profile.name.givenName || req.user.profile.displayName;
}

res.locals.avatarUrl = '';
if (req.user && req.user.profile && req.user.profile.photos) {
res.locals.avatarUrl = req.user.profile.photos[0].value;
}
next();
});

// GET request to the root.
// Display the login screen if the user is not logged in yet, otherwise the
// photo frame.
app.get('/', (req, res) => {
if (!req.user || !req.isAuthenticated()) {
// Not logged in yet.
res.render('pages/login');
} else {
res.render('pages/frame');
}
});

// GET request to log out the user.
// Destroy the current session and redirect back to the log in screen.
app.get('/logout', (req, res) => {
req.logout();
req.session.destroy();
res.redirect('/');
});

// Star the OAuth login process for Google.
app.get('/auth/google', passport.authenticate('google', {
scope: config.scopes,
failureFlash: true, // Display errors to the user.
session: true,
}));

// Callback receiver for the OAuth process after log in.
app.get(
'/auth/google/callback',
passport.authenticate(
'google', {failureRedirect: '/', failureFlash: true, session: true}),
(req, res) => {
// User has logged in.
logger.info('User has logged in.');
req.session.save(() => {
res.redirect('/');
});
});

// Loads the search page if the user is authenticated.
// This page includes the search form.
app.get('/search', (req, res) => {
renderIfAuthenticated(req, res, 'pages/search');
});

// Loads the album page if the user is authenticated.
// This page displays a list of albums owned by the user.
app.get('/album', (req, res) => {
renderIfAuthenticated(req, res, 'pages/album');
});

// Handles form submissions from the search page.
// The user has made a selection and wants to load photos into the photo frame
// from a search query.
// Construct a filter and submit it to the Library API in
// libraryApiSearch(authToken, parameters).
// Returns a list of media items if the search was successful, or an error
// otherwise.
app.post('/loadFromSearch', async (req, res) => {
const authToken = req.user.token;

logger.info('Loading images from search.');
logger.silly('Received form data: ', req.body);

// Construct a filter for photos.
// Other parameters are added below based on the form submission.
const filters = {contentFilter: {}, mediaTypeFilter: {mediaTypes: ['PHOTO']}};

if (req.body.includedCategories) {
// Included categories are set in the form. Add them to the filter.
filters.contentFilter.includedContentCategories =
[req.body.includedCategories];
}

if (req.body.excludedCategories) {
// Excluded categories are set in the form. Add them to the filter.
filters.contentFilter.excludedContentCategories =
[req.body.excludedCategories];
}

// Add a date filter if set, either as exact or as range.
if (req.body.dateFilter == 'exact') {
filters.dateFilter = {
dates: constructDate(
req.body.exactYear, req.body.exactMonth, req.body.exactDay),
}
} else if (req.body.dateFilter == 'range') {
filters.dateFilter = {
ranges: [{
startDate: constructDate(
req.body.startYear, req.body.startMonth, req.body.startDay),
endDate:
constructDate(req.body.endYear, req.body.endMonth, req.body.endDay),
}]
}
}

// Create the parameters that will be submitted to the Library API.
const parameters = {filters};

// Submit the search request to the API and wait for the result.
const data = await libraryApiSearch(authToken, parameters);

// Return and cache the result and parameters.
const userId = req.user.profile.id;
returnPhotos(res, userId, data, parameters);
});

// Handles selections from the album page where an album ID is submitted.
// The user has selected an album and wants to load photos from an album
// into the photo frame.
// Submits a search for all media items in an album to the Library API.
// Returns a list of photos if this was successful, or an error otherwise.
app.post('/loadFromAlbum', async (req, res) => {
const albumId = req.body.albumId;
const userId = req.user.profile.id;
const authToken = req.user.token;

logger.info(`Importing album: ${albumId}`);

// To list all media in an album, construct a search request
// where the only parameter is the album ID.
// Note that no other filters can be set, so this search will
// also return videos that are otherwise filtered out in libraryApiSearch(..).
const parameters = {albumId};

// Submit the search request to the API and wait for the result.
const data = await libraryApiSearch(authToken, parameters);

returnPhotos(res, userId, data, parameters)
});

// Returns all albums owned by the user.
app.get('/getAlbums', async (req, res) => {
logger.info('Loading albums');
const userId = req.user.profile.id;

// Attempt to load the albums from cache if available.
// Temporarily caching the albums makes the app more responsive.
const cachedAlbums = await albumCache.getItem(userId);
if (cachedAlbums) {
logger.verbose('Loaded albums from cache.');
res.status(200).send(cachedAlbums);
} else {
logger.verbose('Loading albums from API.');
// Albums not in cache, retrieve the albums from the Library API
// and return them
const data = await libraryApiGetAlbums(req.user.token);
if (data.error) {
// Error occured during the request. Albums could not be loaded.
returnError(res, data);
// Clear the cached albums.
albumCache.removeItem(userId);
} else {
// Albums were successfully loaded from the API. Cache them
// temporarily to speed up the next request and return them.
// The cache implementation automatically clears the data when the TTL is
// reached.
res.status(200).send(data);
albumCache.setItem(userId, data);
}
}
});

// Returns a list of the media items that the user has selected to
// be shown on the photo frame.
// If the media items are still in the temporary cache, they are directly
// returned, otherwise the search parameters that were used to load the photos
// are resubmitted to the API and the result returned.
app.get('/getQueue', async (req, res) => {
const userId = req.user.profile.id;
const authToken = req.user.token;

logger.info('Loading queue.');

// Attempt to load the queue from cache first. This contains full mediaItems
// that include URLs. Note that these expire after 1 hour. The TTL on this
// cache has been set to this limit and it is cleared automatically when this
// time limit is reached. Caching this data makes the app more responsive,
// as it can be returned directly from memory whenever the user navigates
// back to the photo frame.
const cachedPhotos = await mediaItemCache.getItem(userId);
const stored = await storage.getItem(userId);

if (cachedPhotos) {
// Items are still cached. Return them.
logger.verbose('Returning cached photos.');
res.status(200).send({photos: cachedPhotos, parameters: stored.parameters});
} else if (stored && stored.parameters) {
// Items are no longer cached. Resubmit the stored search query and return
// the result.
logger.verbose(
`Resubmitting filter search ${JSON.stringify(stored.parameters)}`);
const data = await libraryApiSearch(authToken, stored.parameters);
returnPhotos(res, userId, data, stored.parameters);
} else {
// No data is stored yet for the user. Return an empty response.
// The user is likely new.
logger.verbose('No cached data.')
res.status(200).send({});
}
});

// Start the server
server.listen(config.port, () => {
console.log(`App listening on port ${config.port}`);
console.log('Press Ctrl+C to quit.');
});

// Renders the given page if the user is authenticated.
// Otherwise, redirects to "/".
function renderIfAuthenticated(req, res, page) {
if (!req.user || !req.isAuthenticated()) {
res.redirect('/');
} else {
res.render(page);
}
}

// If the supplied result is succesful, the parameters and media items are
// cached.
// Helper method that returns and caches the result from a Library API search
// query returned by libraryApiSearch(...). If the data.error field is set,
// the data is handled as an error and not cached. See returnError instead.
// Otherwise, the media items are cached, the search parameters are stored
// and they are returned in the response.
function returnPhotos(res, userId, data, searchParameter) {
if (data.error) {
returnError(res, data)
} else {
// Remove the pageToken and pageSize from the search parameters.
// They will be set again when the request is submitted but don't need to be
// stored.
delete searchParameter.pageToken;
delete searchParameter.pageSize;

    // Cache the media items that were loaded temporarily.
    mediaItemCache.setItem(userId, data.photos);
    // Store the parameters that were used to load these images. They are used
    // to resubmit the query after the cache expires.
    storage.setItem(userId, {parameters: searchParameter});

    // Return the photos and parameters back int the response.
    res.status(200).send({photos: data.photos, parameters: searchParameter});

}
}

// Responds with an error status code and the encapsulated data.error.
function returnError(res, data) {
// Return the same status code that was returned in the error or use 500
// otherwise.
const statusCode = data.error.status || 500;
// Return the error.
res.status(statusCode).send(JSON.stringify(data.error));
}

// Constructs a date object required for the Library API.
// Undefined parameters are not set in the date object, which the API sees as a
// wildcard.
function constructDate(year, month, day) {
const date = {};
if (year) date.year = year;
if (month) date.month = month;
if (day) date.day = day;
return date;
}

// Submits a search request to the Google Photos Library API for the given
// parameters. The authToken is used to authenticate requests for the API.
// The minimum number of expected results is configured in config.photosToLoad.
// This function makes multiple calls to the API to load at least as many photos
// as requested. This may result in more items being listed in the response than
// originally requested.
async function libraryApiSearch(authToken, parameters) {
let photos = [];
let nextPageToken = null;
let error = null;

parameters.pageSize = config.searchPageSize;

try {
// Loop while the number of photos threshold has not been met yet
// and while there is a nextPageToken to load more items.
do {
logger.info(
`Submitting search with parameters: ${JSON.stringify(parameters)}`);

      // Make a POST request to search the library or album
      const searchResponse =
        await fetch(config.apiEndpoint + '/v1/mediaItems:search', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
          },
          body: JSON.stringify(parameters)
        });

      const result = await checkStatus(searchResponse);

      logger.debug(`Response: ${result}`);

      // The list of media items returned may be sparse and contain missing
      // elements. Remove all invalid elements.
      // Also remove all elements that are not images by checking its mime type.
      // Media type filters can't be applied if an album is loaded, so an extra
      // filter step is required here to ensure that only images are returned.
      const items = result && result.mediaItems ?
          result.mediaItems
              .filter(x => x)  // Filter empty or invalid items.
              // Only keep media items with an image mime type.
              .filter(x => x.mimeType && x.mimeType.startsWith('image/')) :
          [];

      photos = photos.concat(items);

      // Set the pageToken for the next request.
      parameters.pageToken = result.nextPageToken;

      logger.verbose(
          `Found ${items.length} images in this request. Total images: ${
              photos.length}`);

      // Loop until the required number of photos has been loaded or until there
      // are no more photos, ie. there is no pageToken.
    } while (photos.length < config.photosToLoad &&
             parameters.pageToken != null);

} catch (err) {
// Log the error and prepare to return it.
error = err;
logger.error(error);
}

logger.info('Search complete.');
return {photos, parameters, error};
}

// Returns a list of all albums owner by the logged in user from the Library
// API.
async function libraryApiGetAlbums(authToken) {
let albums = [];
let nextPageToken = null;
let error = null;

let parameters = new URLSearchParams();
parameters.append('pageSize', config.albumPageSize);

try {
// Loop while there is a nextpageToken property in the response until all
// albums have been listed.
do {
logger.verbose(`Loading albums. Received so far: ${albums.length}`);
// Make a GET request to load the albums with optional parameters (the
// pageToken if set).
const albumResponse = await fetch(config.apiEndpoint + '/v1/albums?' + parameters, {
method: 'get',
headers: {
'Content-Type': 'application/json',
'Authorization': 'Bearer ' + authToken
},
});

      const result = await checkStatus(albumResponse);

      logger.debug(`Response: ${result}`);

      if (result && result.albums) {
        logger.verbose(`Number of albums received: ${result.albums.length}`);
        // Parse albums and add them to the list, skipping empty entries.
        const items = result.albums.filter(x => !!x);

        albums = albums.concat(items);
      }
    if(result.nextPageToken){
      parameters.set('pageToken', result.nextPageToken);
    }else{
      parameters.delete('pageToken');
    }

      // Loop until all albums have been listed and no new nextPageToken is
      // returned.
    } while (parameters.has('pageToken'));

} catch (err) {
// Log the error and prepare to return it.
error = err;
logger.error(error);
}

logger.info('Albums loaded.');
return {albums, error};
}

// Return the body as JSON if the request was successful, or thrown a StatusError.
async function checkStatus(response){
if (!response.ok){
// Throw a StatusError if a non-OK HTTP status was returned.
let message = "";
try{
// Try to parse the response body as JSON, in case the server returned a useful response.
message = await response.json();
} catch( err ){
// Ignore if no JSON payload was retrieved and use the status text instead.
}
throw new StatusError(response.status, response.statusText, message);
}

// If the HTTP status is OK, return the body as JSON.
return await response.json();
}

// Custom error that contains a status, title and a server message.
class StatusError extends Error {
constructor(status, title, serverMessage, ...params) {
super(...params)
this.status = status;
this.statusTitle = title;
this.serverMessage= serverMessage;
}
}

// [END app]

// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {config} from './config.js';
import {Strategy as GoogleOAuthStrategy} from 'passport-google-oauth20';

export const auth = (passport) => {
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
passport.use(new GoogleOAuthStrategy(
{
clientID: config.oAuthClientID,
clientSecret: config.oAuthclientSecret,
callbackURL: config.oAuthCallbackUrl
},
(token, refreshToken, profile, done) => done(null, {profile, token})));
};

// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// This file contains the configuration options for this sample app.

export const config = {};

// The OAuth client ID from the Google Developers console.
config.oAuthClientID = 'ADD YOUR CLIENT ID';

// The OAuth client secret from the Google Developers console.
config.oAuthclientSecret = 'ADD YOUR CLIENT SECRET';

// The callback to use for OAuth requests. This is the URL where the app is
// running. For testing and running it locally, use 127.0.0.1.
config.oAuthCallbackUrl = 'http://127.0.0.1:8080/auth/google/callback';

// The port where the app should listen for requests.
config.port = 8080;

// The scopes to request. The app requires the photoslibrary.readonly and
// plus.me scopes.
config.scopes = [
'https://www.googleapis.com/auth/photoslibrary.readonly',
'profile',
];

// The number of photos to load for search requests.
config.photosToLoad = 150;

// The page size to use for search requests. 100 is reccommended.
config.searchPageSize = 100;

// The page size to use for the listing albums request. 50 is reccommended.
config.albumPageSize = 50;

// The API end point to use. Do not change.
config.apiEndpoint = 'https://photoslibrary.googleapis.com';

{
"name": "photo-frame-sample",
"version": "1.0.0",
"description": "Google Photos Library API photo frame sample",
"private": true,
"license": "Apache-2.0",
"author": "Google LLC",
"repository": {
"type": "git",
"url": "https://github.com/googlesamples/google-photos.git"
},
"main": "app.js",
"type": "module",
"dependencies": {
"@fancyapps/fancybox": "^3.5.7",
"body-parser": "^1.19.1",
"ejs": "^3.1.7",
"express": "^4.18.1",
"express-session": "^1.17.2",
"express-winston": "^4.2.0",
"jquery": "^3.6.0",
"material-design-icons": "^3.0.1",
"material-design-lite": "^1.3.0",
"node-fetch": "^3.2.10",
"node-persist": "^3.1.0",
"passport": "^0.6.0",
"passport-google-oauth20": "^2.0.0",
"session-file-store": "^1.5.0",
"winston": "^3.7.2"
}
}

---

Skip to main content
Google for Developers
Authentication

Authorization

Cross-platform

Cross-Account Protection (RISC)
Search
/

English

Google Account Authorization
App verification to use Google Authorization APIs
Google Account Linking
Resources
Filter

Authorization
Was this helpful?

OAuth 2.0 for Client-side Web Applications

Spark icon
Page Summary
This document explains how to implement OAuth 2.0 authorization to access Google APIs from a JavaScript web application. OAuth 2.0 allows users to share specific data with an application while keeping their usernames, passwords, and other information private. For example, an application can use OAuth 2.0 to obtain permission from users to store files in their Google Drives.

This OAuth 2.0 flow is called the implicit grant flow. It is designed for applications that access APIs only while the user is present at the application. These applications are not able to store confidential information.

In this flow, your app opens a Google URL that uses query parameters to identify your app and the type of API access that the app requires. You can open the URL in the current browser window or a popup. The user can authenticate with Google and grant the requested permissions. Google then redirects the user back to your app. The redirect includes an access token, which your app verifies and then uses to make API requests.

Google APIs Client Library and Google Identity Services
If you use Google APIs client library for JavaScript to make authorized calls to Google, you should use Google Identity Services JavaScript library to handle the OAuth 2.0 flow. Please see Google identity Services' token model, which is based upon the OAuth 2.0 implicit grant flow.

Note: Given the security implications of getting the implementation correct, we strongly encourage you to use OAuth 2.0 libraries such as Google identity Services' token model when interacting with Google's OAuth 2.0 endpoints. It is a best practice to use well-debugged code provided by others, and it will help you protect yourself and your users.

Rest of this page details how to interact with Google's OAuth 2.0 endpoints directly without using any OAuth 2.0 library.

Prerequisites
Enable APIs for your project
Any application that calls Google APIs needs to enable those APIs in the API Console.

To enable an API for your project:

Open the API Library in the Google API Console.
If prompted, select a project, or create a new one.
The API Library lists all available APIs, grouped by product family and popularity. If the API you want to enable isn't visible in the list, use search to find it, or click View All in the product family it belongs to.
Select the API you want to enable, then click the Enable button.
If prompted, enable billing.
If prompted, read and accept the API's Terms of Service.
Create authorization credentials
Any application that uses OAuth 2.0 to access Google APIs must have authorization credentials that identify the application to Google's OAuth 2.0 server. The following steps explain how to create credentials for your project. Your applications can then use the credentials to access APIs that you have enabled for that project.

Go to the Clients page.
Click Create Client.
Select the Web application application type.
Complete the form. Applications that use JavaScript to make authorized Google API requests must specify authorized JavaScript origins. The origins identify the domains from which your application can send requests to the OAuth 2.0 server. These origins must adhere to Google’s validation rules.
Identify access scopes
Scopes enable your application to only request access to the resources that it needs while also enabling users to control the amount of access that they grant to your application. Thus, there may be an inverse relationship between the number of scopes requested and the likelihood of obtaining user consent.

Before you start implementing OAuth 2.0 authorization, we recommend that you identify the scopes that your app will need permission to access.

The OAuth 2.0 API Scopes document contains a full list of scopes that you might use to access Google APIs.

If your public application uses scopes that permit access to certain user data, it must complete a verification process. If you see unverified app on the screen when testing your application, you must submit a verification request to remove it. Find out more about unverified apps and get answers to frequently asked questions about app verification in the Help Center.
Obtaining OAuth 2.0 access tokens
The following steps show how your application interacts with Google's OAuth 2.0 server to obtain a user's consent to perform an API request on the user's behalf. Your application must have that consent before it can execute a Google API request that requires user authorization.

Step 1: Redirect to Google's OAuth 2.0 server
To request permission to access a user's data, redirect the user to Google's OAuth 2.0 server.

OAuth 2.0 Endpoints
Generate a URL to request access from Google's OAuth 2.0 endpoint at https://accounts.google.com/o/oauth2/v2/auth. This endpoint is accessible over HTTPS; plain HTTP connections are refused.

The Google authorization server supports the following query string parameters for web server applications:

Parameters
client_id Required
The client ID for your application. You can find this value in the Cloud Console Clients page.

redirect_uri Required
Determines where the API server redirects the user after the user completes the authorization flow. The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client, which you configured in your client's Cloud Console Clients page. If this value doesn't match an authorized redirect URI for the provided client_id you will get a redirect_uri_mismatch error.

Note that the http or https scheme, case, and trailing slash ('/') must all match.

response_type Required
JavaScript applications need to set the parameter's value to token. This value instructs the Google Authorization Server to return the access token as a name=value pair in the fragment identifier of the URI (#) to which the user is redirected after completing the authorization process.

scope Required
A space-delimited list of scopes that identify the resources that your application could access on the user's behalf. These values inform the consent screen that Google displays to the user.

Scopes enable your application to only request access to the resources that it needs while also enabling users to control the amount of access that they grant to your application. Thus, there is an inverse relationship between the number of scopes requested and the likelihood of obtaining user consent.

We recommend that your application request access to authorization scopes in context whenever possible. By requesting access to user data in context, using incremental authorization, you help users to understand why your application needs the access it is requesting.

state Recommended
Specifies any string value that your application uses to maintain state between your authorization request and the authorization server's response. The server returns the exact value that you send as a name=value pair in the URL fragment identifier (#) of the redirect_uri after the user consents to or denies your application's access request.

You can use this parameter for several purposes, such as directing the user to the correct resource in your application, sending nonces, and mitigating cross-site request forgery. Since your redirect_uri can be guessed, using a state value can increase your assurance that an incoming connection is the result of an authentication request. If you generate a random string or encode the hash of a cookie or another value that captures the client's state, you can validate the response to additionally ensure that the request and response originated in the same browser, providing protection against attacks such as cross-site request forgery. See the OpenID Connect documentation for an example of how to create and confirm a state token.

Important: The OAuth client must prevent CSRF as called out in the OAuth2 Specification . One way to achieve this is by using the state parameter to maintain state between your authorization request and the authorization server's response.
include_granted_scopes Optional
Enables applications to use incremental authorization to request access to additional scopes in context. If you set this parameter's value to true and the authorization request is granted, then the new access token will also cover any scopes to which the user previously granted the application access. See the incremental authorization section for examples.

enable_granular_consent Optional
Defaults to true. If set to false, more granular Google Account permissions will be disabled for OAuth client IDs created before 2019. No effect for newer OAuth client IDs, since more granular permissions is always enabled for them.

When Google enables granular permissions for an application, this parameter will no longer have any effect.

login_hint Optional
If your application knows which user is trying to authenticate, it can use this parameter to provide a hint to the Google Authentication Server. The server uses the hint to simplify the login flow either by prefilling the email field in the sign-in form or by selecting the appropriate multi-login session.

Set the parameter value to an email address or sub identifier, which is equivalent to the user's Google ID.

prompt Optional
A space-delimited, case-sensitive list of prompts to present the user. If you don't specify this parameter, the user will be prompted only the first time your project requests access. See Prompting re-consent for more information.

Possible values are:

none Don't display any authentication or consent screens. Must not be specified with other values.
consent Prompt the user for consent.
select_account Prompt the user to select an account.
Sample redirect to Google's authorization server
An example URL is shown below, with line breaks and spaces for readability.

https://accounts.google.com/o/oauth2/v2/auth?
scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly%20https%3A//www.googleapis.com/auth/calendar.readonly&
include_granted_scopes=true&
response_type=token&
state=state_parameter_passthrough_value&
redirect_uri=https%3A//developers.google.com/oauthplayground&
client_id=client_id
After you create the request URL, redirect the user to it.

JavaScript sample code
The following JavaScript snippet shows how to initiate the authorization flow in JavaScript without using the Google APIs Client Library for JavaScript. Since this OAuth 2.0 endpoint does not support Cross-Origin Resource Sharing (CORS), the snippet creates a form that opens the request to that endpoint.

/\*

- Create form to request access token from Google's OAuth 2.0 server.
  \*/
  function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

// Create <form> element to submit parameters to OAuth 2.0 endpoint.
var form = document.createElement('form');
form.setAttribute('method', 'GET'); // Send as a GET request.
form.setAttribute('action', oauth2Endpoint);

// Parameters to pass to OAuth 2.0 endpoint.
var params = {'client_id': 'YOUR_CLIENT_ID',
'redirect_uri': 'YOUR_REDIRECT_URI',
'response_type': 'token',
'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly',
'include_granted_scopes': 'true',
'state': 'pass-through value'};

// Add form parameters as hidden input values.
for (var p in params) {
var input = document.createElement('input');
input.setAttribute('type', 'hidden');
input.setAttribute('name', p);
input.setAttribute('value', params[p]);
form.appendChild(input);
}

// Add form to page and submit it to open the OAuth 2.0 endpoint.
document.body.appendChild(form);
form.submit();
}
Code Tutor
expand_more
Step 2: Google prompts user for consent
In this step, the user decides whether to grant your application the requested access. At this stage, Google displays a consent window that shows the name of your application and the Google API services that it is requesting permission to access with the user's authorization credentials and a summary of the scopes of access to be granted. The user can then consent to grant access to one or more scopes requested by your application or refuse the request.

Your application doesn't need to do anything at this stage as it waits for the response from Google's OAuth 2.0 server indicating whether any access was granted. That response is explained in the following step.

Errors
Requests to Google's OAuth 2.0 authorization endpoint may display user-facing error messages instead of the expected authentication and authorization flows. Common error codes and suggested resolutions are:

admin_policy_enforced
The Google Account is unable to authorize one or more scopes requested due to the policies of their Google Workspace administrator. See the Google Workspace Admin help article Control which third-party & internal apps access Google Workspace data for more information about how an administrator may restrict access to all scopes or sensitive and restricted scopes until access is explicitly granted to your OAuth client ID.

disallowed_useragent
The authorization endpoint is displayed inside an embedded user-agent disallowed by Google's OAuth 2.0 Policies.

iOS and macOS developers may encounter this error when opening authorization requests in WKWebView. Developers should instead use iOS libraries such as Google Sign-In for iOS or OpenID Foundation's AppAuth for iOS.

Web developers may encounter this error when an iOS or macOS app opens a general web link in an embedded user-agent and a user navigates to Google's OAuth 2.0 authorization endpoint from your site. Developers should allow general links to open in the default link handler of the operating system, which includes both Universal Links handlers or the default browser app. The SFSafariViewController library is also a supported option.

org_internal
The OAuth client ID in the request is part of a project limiting access to Google Accounts in a specific Google Cloud Organization. For more information about this configuration option see the User type section in the Setting up your OAuth consent screen help article.

invalid_client
The origin from which the request was made is not authorized for this client. See origin_mismatch.

deleted_client
The OAuth client being used to make the request has been deleted. Deletion can happen manually or automatically in the case of unused clients . Deleted clients can be restored within 30 days of the deletion. Learn more .

invalid_grant
When using incremental authorization, the token may have expired or has been invalidated. Authenticate the user again and ask for user consent to obtain new tokens. If you are continuing to see this error, ensure that your application has been configured correctly and that you are using the correct tokens and parameters in your request. Otherwise, the user account may have been deleted or disabled.

origin_mismatch
The scheme, domain, and/or port of the JavaScript originating the authorization request may not match an authorized JavaScript origin URI registered for the OAuth client ID. Review authorized JavaScript origins in the Google Cloud Console Clients page.

redirect_uri_mismatch
The redirect_uri passed in the authorization request does not match an authorized redirect URI for the OAuth client ID. Review authorized redirect URIs in the Google Cloud Console Clients page.

The scheme, domain, and/or port of the JavaScript originating the authorization request may not match an authorized JavaScript origin URI registered for the OAuth client ID. Review authorized JavaScript origins in the Google Cloud Console Clients page.

The redirect_uri parameter may refer to the OAuth out-of-band (OOB) flow that has been deprecated and is no longer supported. Refer to the migration guide to update your integration.

invalid_request
There was something wrong with the request you made. This could be due to a number of reasons:

The request was not properly formatted
The request was missing required parameters
The request uses an authorization method that Google doesn't support. Verify your OAuth integration uses a recommended integration method
Step 3: Handle the OAuth 2.0 server response
OAuth 2.0 Endpoints
Important: Before handling the OAuth 2.0 response, you should confirm that the state received from Google matches the state sent in the authorization request. This verification helps to ensure that the user, not a malicious script, is making the request and reduces the risk of CSRF attacks.
The OAuth 2.0 server sends a response to the redirect_uri specified in your access token request.

If the user approves the request, then the response contains an access token. If the user does not approve the request, the response contains an error message. The access token or error message is returned on the hash fragment of the redirect URI, as shown below:

An access token response:

https://oauth2.example.com/callback#access_token=4/P7q7W91&token_type=Bearer&expires_in=3600
In addition to the access_token parameter, the fragment string also contains the token_type parameter, which is always set to Bearer, and the expires_in parameter, which specifies the lifetime of the token, in seconds. If the state parameter was specified in the access token request, its value is also included in the response.

An error response:

https://oauth2.example.com/callback#error=access_denied
Note: Your application should ignore any additional, unrecognized fields included in the query string.
Sample OAuth 2.0 server response
You can test this flow by clicking on the following sample URL, which requests read-only access to view metadata for files in your Google Drive and read-only access to view your Google Calendar events:

https://accounts.google.com/o/oauth2/v2/auth?
scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly%20https%3A//www.googleapis.com/auth/calendar.readonly&
include_granted_scopes=true&
response_type=token&
state=state_parameter_passthrough_value&
redirect_uri=https%3A//developers.google.com/oauthplayground&
client_id=client_id
After completing the OAuth 2.0 flow, your browser redirects you to the OAuth 2.0 Playground, a tool for testing OAuth flows. You will see that the OAuth 2.0 Playground has automatically captured the authorization code.

Step 4: Check which scopes users granted
When requesting multiple permissions (scopes), users may not grant your app access to all of them. Your app must verify which scopes were actually granted and gracefully handle situations where some permissions are denied, typically by disabling the features that rely on those denied scopes.

However, there are exceptions. Google Workspace Enterprise apps with domain-wide delegation of authority, or apps marked as Trusted, bypass the granular permissions consent screen. For these apps, users won't see the granular permission consent screen. Instead, your app will either receive all requested scopes or none.

For more detailed information, see How to handle granular permissions.

OAuth 2.0 Endpoints
To check whether the user has granted your application access to a particular scope, exam the scope field in the access token response. The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.

For example, the following sample access token response indicates that the user has granted your application access to the read-only Drive activity and Calendar events permissions:

{
"access_token": "1/fFAGRNJru1FTz70BzhT3Zg",
"expires_in": 3920,
"token_type": "Bearer",
"scope": "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly",
"refresh_token": "1//xEoDL4iW3cxlI7yDbSRFYNG01kVKM2C-259HOF2aQbI"
}
Code Tutor
expand_more
Calling Google APIs
OAuth 2.0 Endpoints
After your application obtains an access token, you can use the token to make calls to a Google API on behalf of a given user account if the scope(s) of access required by the API have been granted. To do this, include the access token in a request to the API by including either an access_token query parameter or an Authorization HTTP header Bearer value. When possible, the HTTP header is preferable, because query strings tend to be visible in server logs. In most cases you can use a client library to set up your calls to Google APIs (for example, when calling the Drive Files API).

You can try out all the Google APIs and view their scopes at the OAuth 2.0 Playground.

HTTP GET examples
A call to the drive.files endpoint (the Drive Files API) using the Authorization: Bearer HTTP header might look like the following. Note that you need to specify your own access token:

GET /drive/v2/files HTTP/1.1
Host: www.googleapis.com
Authorization: Bearer access_token
Here is a call to the same API for the authenticated user using the access_token query string parameter:

GET https://www.googleapis.com/drive/v2/files?access_token=access_token
curl examples
You can test these commands with the curl command-line application. Here's an example that uses the HTTP header option (preferred):

curl -H "Authorization: Bearer access_token" https://www.googleapis.com/drive/v2/files
Or, alternatively, the query string parameter option:

curl https://www.googleapis.com/drive/v2/files?access_token=access_token
JavaScript sample code
The code snippet below demonstrates how to use CORS (Cross-origin resource sharing) to send a request to a Google API. This example does not use the Google APIs Client Library for JavaScript. However, even if you are not using the client library, the CORS support guide in that library's documentation will likely help you to better understand these requests.

In this code snippet, the access_token variable represents the token you have obtained to make API requests on the authorized user's behalf. The complete example demonstrates how to store that token in the browser's local storage and retrieve it when making an API request.

var xhr = new XMLHttpRequest();
xhr.open('GET',
'https://www.googleapis.com/drive/v3/about?fields=user&' +
'access_token=' + params['access_token']);
xhr.onreadystatechange = function (e) {
console.log(xhr.response);
};
xhr.send(null);
Code Tutor
expand_more
Complete example
OAuth 2.0 Endpoints
This code sample demonstrates how to complete the OAuth 2.0 flow in JavaScript without using the Google APIs Client Library for JavaScript. The code is for an HTML page that displays a button to try an API request. If you click the button, the code checks to see whether the page has stored an API access token in your browser's local storage. If so, it executes the API request. Otherwise, it initiates the OAuth 2.0 flow.

For the OAuth 2.0 flow, the page follows these steps:

It directs the user to Google's OAuth 2.0 server, which requests access to the https://www.googleapis.com/auth/drive.metadata.readonly and https://www.googleapis.com/auth/calendar.readonlyscopes.
After granting (or denying) access to one or more requested scopes, the user is redirected to the original page, which parses the access token from the fragment identifier string.
The page checks which scopes user has granted access to the application.
If the user has granted access to the requested scope()s, the page uses the access token to make the sample API request.

The API request calls the Drive API's about.get method to retrieve information about the authorized user's Google Drive account.

If the request executes successfully, the API response is logged in the browser's debugging console.
You can revoke access to the app through the Permissions page for your Google Account. The app is listed as the application name provided in the branding page within the OAuth consent screen during client ID creation.

To run this code locally, you need to set values for the YOUR_CLIENT_ID and YOUR_REDIRECT_URI variables that correspond to your authorization credentials. The YOUR_REDIRECT_URI variable should be set to the same URL where the page is being served. The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client, which you configured in the Cloud Console Clients page. If this value doesn't match an authorized URI, you will get a redirect_uri_mismatch error. Your project must also have enabled the appropriate API for this request.

<html><head></head><body>
<script>
  var YOUR_CLIENT_ID = 'REPLACE_THIS_VALUE';
  var YOUR_REDIRECT_URI = 'REPLACE_THIS_VALUE';

// Parse query string to see if page request is coming from OAuth 2.0 server.
var fragmentString = location.hash.substring(1);
var params = {};
var regex = /([^&=]+)=([^&]\*)/g, m;
while (m = regex.exec(fragmentString)) {
params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
if (Object.keys(params).length > 0 && params['state']) {
if (params['state'] == localStorage.getItem('state')) {
localStorage.setItem('oauth2-test-params', JSON.stringify(params) );

      trySampleRequest();
    } else {
      console.log('State mismatch. Possible CSRF attack');
    }

}

// Function to generate a random state value
function generateCryptoRandomState() {
const randomValues = new Uint32Array(2);
window.crypto.getRandomValues(randomValues);

    // Encode as UTF-8
    const utf8Encoder = new TextEncoder();
    const utf8Array = utf8Encoder.encode(
      String.fromCharCode.apply(null, randomValues)
    );

    // Base64 encode the UTF-8 data
    return btoa(String.fromCharCode.apply(null, utf8Array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

}

// If there's an access token, try an API request.
// Otherwise, start OAuth 2.0 flow.
function trySampleRequest() {
var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
if (params && params['access_token']) {
// User authorized the request. Now, check which scopes were granted.
if (params['scope'].includes('https://www.googleapis.com/auth/drive.metadata.readonly')) {
// User authorized read-only Drive activity permission.
// Calling the APIs, etc.
var xhr = new XMLHttpRequest();
xhr.open('GET',
'https://www.googleapis.com/drive/v3/about?fields=user&' +
'access_token=' + params['access_token']);
xhr.onreadystatechange = function (e) {
if (xhr.readyState === 4 && xhr.status === 200) {
console.log(xhr.response);
} else if (xhr.readyState === 4 && xhr.status === 401) {
// Token invalid, so prompt for user permission.
oauth2SignIn();
}
};
xhr.send(null);
}
else {
// User didn't authorize read-only Drive activity permission.
// Update UX and application accordingly
console.log('User did not authorize read-only Drive activity permission.');
}

      // Check if user authorized Calendar read permission.
      if (params['scope'].includes('https://www.googleapis.com/auth/calendar.readonly')) {
        // User authorized Calendar read permission.
        // Calling the APIs, etc.
        console.log('User authorized Calendar read permission.');
      }
      else {
        // User didn't authorize Calendar read permission.
        // Update UX and application accordingly
        console.log('User did not authorize Calendar read permission.');
      }
    } else {
      oauth2SignIn();
    }

}

/\*

- Create form to request access token from Google's OAuth 2.0 server.
  \*/
  function oauth2SignIn() {
  // create random state value and store in local storage
  var state = generateCryptoRandomState();
  localStorage.setItem('state', state);

  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create element to open OAuth 2.0 endpoint in new window.
  var form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {'client_id': YOUR_CLIENT_ID,
  'redirect_uri': YOUR_REDIRECT_URI,
  'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly',
  'state': state,
  'include_granted_scopes': 'true',
  'response_type': 'token'};

  // Add form parameters as hidden input values.
  for (var p in params) {
  var input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', p);
  input.setAttribute('value', params[p]);
  form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();

}
</script>

<button onclick="trySampleRequest();">Try sample request</button>

</body></html>
JavaScript origin validation rules
Google applies the following validation rules to JavaScript origins in order to help developers keep their applications secure. Your JavaScript origins must adhere to these rules. See RFC 3986 section 3 for the definition of domain, host and scheme, mentioned below.

Validation rules
Scheme
JavaScript origins must use the HTTPS scheme, not plain HTTP. Localhost URIs (including localhost IP address URIs) are exempt from this rule.

Host
Hosts cannot be raw IP addresses. Localhost IP addresses are exempted from this rule.

Domain
Host TLDs (Top Level Domains) must belong to the public suffix list.
Host domains cannot be “googleusercontent.com”.
JavaScript origins cannot contain URL shortener domains (e.g. goo.gl) unless the app owns the domain.
Userinfo
JavaScript origins cannot contain the userinfo subcomponent.

Path
JavaScript origins cannot contain the path component.

Query
JavaScript origins cannot contain the query component.

Fragment
JavaScript origins cannot contain the fragment component.

Characters JavaScript origins cannot contain certain characters including:
Wildcard characters ('\*')
Non-printable ASCII characters
Invalid percent encodings (any percent encoding that does not follow URL-encoding form of a percent sign followed by two hexadecimal digits)
Null characters (an encoded NULL character, e.g., %00, %C0%80)
Incremental authorization
In the OAuth 2.0 protocol, your app requests authorization to access resources, which are identified by scopes. It is considered a best user-experience practice to request authorization for resources at the time you need them. To enable that practice, Google's authorization server supports incremental authorization. This feature lets you request scopes as they are needed and, if the user grants permission for the new scope, returns an authorization code that may be exchanged for a token containing all scopes the user has granted the project.

For example, an app that lets people sample music tracks and create mixes might need very few resources at sign-in time, perhaps nothing more than the name of the person signing in. However, saving a completed mix would require access to their Google Drive. Most people would find it natural if they only were asked for access to their Google Drive at the time the app actually needed it.

In this case, at sign-in time the app might request the openid and profile scopes to perform basic sign-in, and then later request the https://www.googleapis.com/auth/drive.file scope at the time of the first request to save a mix.

The following rules apply to an access token obtained from an incremental authorization:

The token can be used to access resources corresponding to any of the scopes rolled into the new, combined authorization.
When you use the refresh token for the combined authorization to obtain an access token, the access token represents the combined authorization and can be used for any of the scope values included in the response.
The combined authorization includes all scopes that the user granted to the API project even if the grants were requested from different clients. For example, if a user granted access to one scope using an application's desktop client and then granted another scope to the same application via a mobile client, the combined authorization would include both scopes.
If you revoke a token that represents a combined authorization, access to all of that authorization's scopes on behalf of the associated user are revoked simultaneously.
Caution: choosing to include granted scopes will automatically add scopes previously granted by the user to your authorization request. A warning or error page may be displayed if your app is not currently approved to request all scopes that may be returned in the response. See Unverified apps for more information.
The code samples below show how to add scopes to an existing access token. This approach allows your app to avoid having to manage multiple access tokens.

OAuth 2.0 Endpoints
To add scopes to an existing access token, include the include_granted_scopes parameter in your request to Google's OAuth 2.0 server.

The following code snippet demonstrates how to do that. The snippet assumes that you have stored the scopes for which your access token is valid in the browser's local storage. (The complete example code stores a list of scopes for which the access token is valid by setting the oauth2-test-params.scope property in the browser's local storage.)

The snippet compares the scopes for which the access token is valid to the scope you want to use for a particular query. If the access token does not cover that scope, the OAuth 2.0 flow starts. Here, the oauth2SignIn function is the same as the one that was provided in step 2 (and that is provided later in the complete example).

var SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly';
var params = JSON.parse(localStorage.getItem('oauth2-test-params'));

var current_scope_granted = false;
if (params.hasOwnProperty('scope')) {
var scopes = params['scope'].split(' ');
for (var s = 0; s < scopes.length; s++) {
if (SCOPE == scopes[s]) {
current_scope_granted = true;
}
}
}

if (!current_scope_granted) {
oauth2SignIn(); // This function is defined elsewhere in this document.
} else {
// Since you already have access, you can proceed with the API request.
}
Token revocation
In some cases a user may wish to revoke access given to an application. A user can revoke access by visiting Account Settings. See the Remove site or app access section of the Third-party sites & apps with access to your account support document for more information.

It is also possible for an application to programmatically revoke the access given to it. Programmatic revocation is important in instances where a user unsubscribes, removes an application, or the API resources required by an app have significantly changed. In other words, part of the removal process can include an API request to ensure the permissions previously granted to the application are removed.

OAuth 2.0 Endpoints
To programmatically revoke a token, your application makes a request to https://oauth2.googleapis.com/revoke and includes the token as a parameter:

curl -d -X -POST --header "Content-type:application/x-www-form-urlencoded" \
 https://oauth2.googleapis.com/revoke?token={token}
The token can be an access token or a refresh token. If the token is an access token and it has a corresponding refresh token, the refresh token will also be revoked.

Note: Google's OAuth 2.0 endpoint for revoking tokens supports JSONP and form submissions. It does not support Cross-origin Resource Sharing (CORS).
If the revocation is successfully processed, then the HTTP status code of the response is 200. For error conditions, an HTTP status code 400 is returned along with an error code.

The following JavaScript snippet shows how to revoke a token in JavaScript without using the Google APIs Client Library for JavaScript. Since the Google's OAuth 2.0 endpoint for revoking tokens does not support Cross-origin Resource Sharing (CORS), the code creates a form and submits the form to the endpoint rather than using the XMLHttpRequest() method to post the request.

function revokeAccess(accessToken) {
// Google's OAuth 2.0 endpoint for revoking access tokens.
var revokeTokenEndpoint = 'https://oauth2.googleapis.com/revoke';

// Create <form> element to use to POST data to the OAuth 2.0 endpoint.
var form = document.createElement('form');
form.setAttribute('method', 'post');
form.setAttribute('action', revokeTokenEndpoint);

// Add access token to the form so it is set as value of 'token' parameter.
// This corresponds to the sample curl request, where the URL is:
// https://oauth2.googleapis.com/revoke?token={token}
var tokenField = document.createElement('input');
tokenField.setAttribute('type', 'hidden');
tokenField.setAttribute('name', 'token');
tokenField.setAttribute('value', accessToken);
form.appendChild(tokenField);

// Add form to page and submit it to actually revoke the token.
document.body.appendChild(form);
form.submit();
}
Code Tutor
expand_more
Key Point: Revocation removes all OAuth 2.0 scopes previously granted to a project, invalidating any issued access or refresh tokens for all clients registered under that project.
Note: Following a successful revocation response, it might take some time before the revocation has full effect.
Implementing Cross-Account Protection
An additional step you should take to protect your users' accounts is implementing Cross-Account Protection by utilizing Google's Cross-Account Protection Service. This service lets you subscribe to security event notifications which provide information to your application about major changes to the user account. You can then use the information to take action depending on how you decide to respond to events.

Some examples of the event types sent to your app by Google's Cross-Account Protection Service are:

https://schemas.openid.net/secevent/risc/event-type/sessions-revoked
https://schemas.openid.net/secevent/oauth/event-type/token-revoked
https://schemas.openid.net/secevent/risc/event-type/account-disabled
See the Protect user accounts with Cross-Account Protection page for more information on how to implement Cross Account Protection and for the full list of available events.

Was this helpful?

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-12-19 UTC.

Connect
Blog
Bluesky
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Program
Google Developer Groups
Google Developer Experts
Accelerators
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console
Google Developers
Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy

English
Page info
bug_report
fullscreen
close
On this page
The new page has loaded..

---

skip to:contentpackage searchsign in
❤
Pro
Teams
Pricing
Documentation
npm
Search packages
Search
googlephotos
0.3.5 • Public • Published 4 years ago
googlephotos
Wrapper around the google photos API. The API reference can be found here.

Getting Started
Construct an object with the google auth token. All actions performed on this instance of photos will use the auth token the object was constructed with. Read the section below on getting an authtoken with the required scopes.

const Photos = require('googlephotos');

const photos = new Photos(your_google_auth_token);
Authentication
This package doesn't authentication itself. We suggest using the official google nodejs library. Here are their instructions.

Use the library to get the auth token for the scopes you will need. Read this to figure out what scopes you will need.

The scopes are available on the Photos object to make your life easier.

Quick access Scope Use
Photos.Scopes.READ_ONLY https://www.googleapis.com/auth/photoslibrary.readonly Only reading information. Sharing information is returned only if the token has sharing scope as well.
Photos.Scopes.APPEND_ONLY https://www.googleapis.com/auth/photoslibrary.appendonly Only add photos, create albums in the user's collection. No sort of read access.
Photos.Scopes.READ_DEV_DATA https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata Read access to media items and albums created by the developer. Use this with write only.
Photos.Scopes.READ_AND_APPEND https://www.googleapis.com/auth/photoslibrary Access to read and write only. No sharing information can be accessed.
`Photos.Scopes.SHARING https://www.googleapis.com/auth/photoslibrary.sharing Access to sharing information.
You can figure out your client id, secret and redirect url by going to the Google Cloud Console and navigating to APIs -> Credentials.

const {google} = require('googleapis');
const Photos = require('googlephotos');

const oauth2Client = new google.auth.OAuth2(YOUR_CLIENT_ID, YOUR_CLIENT_SECRET, YOUR_REDIRECT_URL);

const scopes = [Photos.Scopes.READ_ONLY, Photos.Scopes.SHARING];

const url = oauth2Client.generateAuthUrl({
// 'online' (default) or 'offline' (gets refresh_token)
access_type: 'offline',

// If you only need one scope you can pass it as a string
scope: scopes,
});

// Send the user to the url from above. Once they grant access they will be redirected to the
// the redirect URL above with a query param code in the redirect. Use the code below to get the
// access token.

const {tokens} = await oauth2Client.getToken(code);

// The token from above can be used to initialize the photos library.
Albums
list
The default page size used is 50 and pageToken is ignored if not passed in.

const response = await photos.albums.list(pageSize, pageToken);
// const response = await photos.albums.list(pageSize);
// doSomethingWithResponse(response);
get
const response = await photos.albums.get(albumId);
// doSomethingWithResponse(response);
create
const response = await photos.albums.create('Your Album Title');
// doSomethingWithResponse(response);
addEnrichment
The addEnrichment call either accepts a JSON you construct, or you can use the Enrichment helper classes as part of this module to construct an enrichment.

const albumPosition = new photos.AlbumPosition(photos.AlbumPosition.POSITIONS.FIRST_IN_ALBUM);
const textEnrichment = new photos.TextEnrichment('some text');
const response = await photos.albums.addEnrichment(albumId, textEnrichment, albumPosition);
Or with plain JSON

const albumPosition = {
position: 'FIRST_IN_ALBUM',
};
const textEnrichment = {
textEnrichment: {
text: 'Some Text',
},
};
const response = await photos.albums.addEnrichment(albumId, textEnrichment, albumPosition);
Shared Albums
list
Default pageSize is 50 and pageToken is optional.

const response = await photos.sharedAlbums.list(pageSize, pageToken);
// doSomethingWithResponse(response);
join
const response = await photos.sharedAlbums.join(shareToken);
// doSomethingWithResponse(response);
MediaItems
get
const response = await photos.mediaItems.get(mediaItemId);
// doSomethingWithResponse(response);
upload
const response = await photos.mediaItems.upload(albumId, fileName, filePath, description);
// doSomethingWithResponse(response);
uploadMultiple
Supports uploading an array of file objects at once from a single directory, file descriptions are optional. Supports an optional requestDelay, which pauses execution for the specified time (milliseconds) after 50 requests to google photos upload api. This is to prevent the api from rejecting requests for making too many requests per minute.

const files = [
{name: 'myself.jpg', description: 'any description you want'},
{name: 'someone-else.png'},
];

const requestDelay = 1000;

const response = await photos.mediaItems.upload(albumId, files, directoryPath, requestDelay);
// doSomethingWithResponse(response);
search
A search can either fetch the contents of an album or search with filters. Either way default page size is 50.

Searching with an album ID
const response = await photos.mediaItems.search(albumId, optionalPageSize, optionalPageToken);
// doSomethingWithResponse(response);
Searching with filters.
const filters = new photos.Filters(includeArchivedMedia);

// Adding a date filter.
const dateFilter = new photos.DateFilter();
dateFilter.addDate(new Date('2018/05/15'));
dateFilter.addDate(moment());
dateFilter.addRange(moment().subtract(10, 'days'), moment().subtract(5, 'days'));
filters.setDateFilter(dateFilter);

// Adding a content filter.
const contentFilter = new photos.ContentFilter();
contentFilter.addIncludedContentCategories(photos.ContentCategory.BIRTHDAYS);
contentFilter.addExcludedContentCategories(photos.ContentCategory.CITYSCAPES);
filters.setContentFilter(contentFilter);

// Adding a media type filter filter (all, video or photo)
const mediaTypeFilter = new photos.MediaTypeFilter(photos.MediaType.ALL_MEDIA);
filters.setMediaTypeFilter(mediaTypeFilter);

const optionalPageSize = 20;

const response = photos.mediaItems.search(filters, optionalPageSize);
// doSomethingWithResponse(response);
Readme
Keywords
googlegoogle-photosphotos
Package Sidebar
Install
npm i googlephotos

Repository
github.com/roopakv/google-photos

Homepage
github.com/roopakv/google-photos#readme

Weekly Downloads
53

Version
0.3.5

License
MIT

Unpacked Size
35.4 kB

Total Files
35

Last publish
4 years ago

Collaborators
roopakv
Analyze security with SocketCheck bundle sizeView package healthExplore dependencies
Report malware
Footer
Support
Help
Advisories
Status
Contact npm
Company
About
Blog
Press
Terms & Policies
Policies
Terms of Use
Code of Conduct
Privacy
Viewing googlephotos version 0.3.5

---

Skip to main content
Google Photos APIs
Photos APIs
Overview
Picker API

Ambient API
Library API

Support
Partner Program
Search
/

English

Overview
Filter

On April 1st, 2025, some scopes in the Library API were removed. Read about the details here.
Home
Products
Google Photos APIs
Overview
Was this helpful?

Authorization scopes

Spark icon
Page Summary
The Google Photos APIs contain multiple scopes used to access media items and albums. The responses returned from various calls are different based on which scopes have been requested by the developer.

Note: If your application accesses the Google Photos APIs, it must pass the OAuth verification review. If you see unverified app on the screen when testing your application, you must submit a verification request to remove it. Find out more about unverified apps and get answers to frequently asked questions about app verification in the Help Center.

This verification is independent and in addition to any reviews conducted as part of the Google Photos APIs partner program.

Every request your application sends to the Google Photos APIs must include an authorization token. The token also identifies your application to Google.

About authorization protocols
Your application must use OAuth 2.0 to authorize requests. No other authorization protocols are supported. If your application uses Sign In With Google, some aspects of authorization are handled for you.

Authorizing requests with OAuth 2.0
All requests to the Google Photos APIs must be authorized by an authenticated user.

The details of the authorization process, or "flow," for OAuth 2.0 vary somewhat depending on what kind of application you're writing. The following general process applies to all application types:

When you create your application, you register it using the Google API Console. Google then provides information you'll need later, such as a client ID and a client secret.
Activate the Google Photos APIs in the Google API Console. (If the API isn't listed in the API Console, then skip this step.)
When your application needs access to user data, it asks Google for a particular scope of access.
Google displays a consent screen to the user, asking them to authorize your application to request some of their data.
If the user approves, then Google gives your application a short-lived access token.
Your application requests user data, attaching the access token to the request.
If Google determines that your request and the token are valid, it returns the requested data.
Some flows include additional steps, such as using refresh tokens to acquire new access tokens. For detailed information about flows for various types of applications, see Google's OAuth 2.0 documentation.

Here's the OAuth 2.0 scope information for the Google Photos APIs:

Picker API scopes
Scope Meaning
https://www.googleapis.com/auth/photospicker.mediaitems.readonly
Access to create, get, and delete sessions, and to list media items for sessions.

Library API scopes
Scope Meaning
https://www.googleapis.com/auth/photoslibrary.readonly

https://www.googleapis.com/auth/photoslibrary.sharing

https://www.googleapis.com/auth/photoslibrary
Warning: These scopes are being removed as part of the updates to the Google Photos APIs. After March 31, 2025, you will only be able to access content created by your application. Please review the other available scopes and adjust your application's authorization requests accordingly.
If your app needs to select photos from a user's library, use the new Picker API.
For new development, use the updated Library API documentation.
If you're migrating an existing application, refer to the legacy Library API documentation for additional support.
https://www.googleapis.com/auth/photoslibrary.appendonly
Write access only.

Access to upload bytes, create media items, create albums, and add enrichments. Only allows new media to be created in the user's library and in albums created by the app.

https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata
Read access to media items and albums created by the developer. For more information, see Access media items and List library contents, albums, and media items.

Intended to be requested together with the photoslibrary.appendonly scope.

https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata
Edit access only.

Access to change these details for albums and media items created by the developer:

Organize the photos and videos in your albums (Add to albums , remove from albums, and update position).
Album titles and cover photos
Media item descriptions
To request access using OAuth 2.0, your application needs the scope information, as well as information that Google supplies when you register your application (such as the client ID and the client secret).

Tip: The Google APIs client libraries can handle some of the authorization process for you. They are available for a variety of programming languages; check the page with libraries and samples for more details.

Selecting scopes
As a general rule, choose the most restrictive scope possible and avoid requesting scopes that your app does not need. Users more readily grant access to limited, clearly described scopes. Users may hesitate to grant broad access to their media unless they trust your app and understand why it needs the information.

Incrementally requesting scopes
Following best practices for authorization, your application should only request scopes as they are needed. Avoid requesting all scopes for your application up-front at sign-in. Instead, provide justification and make the request in context. Clearly explain what you will do with your users' data and how they will benefit by granting access, as per the UX Guidelines and best practices to provide notice and ask for consent.

Service accounts
The Google Photos APIs don't support service accounts. Your application must use the other OAuth 2.0 flows available such as OAuth 2.0 for web server applications or OAuth 2.0 for mobile and desktop apps.

Was this helpful?

Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License. For details, see the Google Developers Site Policies. Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-08-28 UTC.

Connect
Blog
Bluesky
Instagram
LinkedIn
X (Twitter)
YouTube
Programs
Google Developer Program
Google Developer Groups
Google Developer Experts
Accelerators
Google Cloud & NVIDIA
Developer consoles
Google API Console
Google Cloud Platform Console
Google Play Console
Firebase Console
Actions on Google Console
Cast SDK Developer Console
Chrome Web Store Dashboard
Google Home Developer Console
Google Developers
Android
Chrome
Firebase
Google Cloud Platform
Google AI
All products
Terms
Privacy

English
Page info
bug_report
fullscreen
close
On this page
