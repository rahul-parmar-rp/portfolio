# Instagram Hide-Story Profile Selector

## Purpose

Inspect the Instagram **Hide story from** page and count profiles by checkbox state using the browser console.

Target page:

`https://www.instagram.com/accounts/hide_story_and_live_from/`

## Profile Selector

Every loaded profile has a checkbox element matching:

```js
[role="button"][aria-label="Toggle checkbox"]
```

Count all loaded profiles:

```js
document.querySelectorAll('[role="button"][aria-label="Toggle checkbox"]').length
```

Instagram does not expose a stable unique ID for each profile row. Use the username text within the surrounding row to identify an individual profile.

## Checkbox State Selectors

Selected profiles use the filled circle-check icon:

```js
[role="button"][aria-label="Toggle checkbox"] [data-bloks-name="ig.components.Icon"][style*="circle-check__filled"]
```

Unselected profiles use the outline circle icon:

```js
[role="button"][aria-label="Toggle checkbox"] [data-bloks-name="ig.components.Icon"][style*="circle__outline"]
```

Count selected profiles:

```js
[...document.querySelectorAll('[role="button"][aria-label="Toggle checkbox"]')]
  .filter(profile => getComputedStyle(
    profile.querySelector('[data-bloks-name="ig.components.Icon"]')
  ).maskImage.includes('circle-check__filled'))
  .length
```

Count unselected profiles:

```js
[...document.querySelectorAll('[role="button"][aria-label="Toggle checkbox"]')]
  .filter(profile => getComputedStyle(
    profile.querySelector('[data-bloks-name="ig.components.Icon"]')
  ).maskImage.includes('circle__outline'))
  .length
```

## Observed Counts

The authenticated page contained:

- Total profiles: 311
- Selected to hide the story from: 261
- Not selected: 50

These counts describe the profiles loaded in the page at inspection time. Instagram may change the generated class names or icon markup, so recheck the selectors if the page UI changes.
