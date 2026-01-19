# ✅ **Problem Statement: URL Replacement on Initial Render Fails in Next.js App Router**

## Overview

We needed to apply updated facet logic for our Product Listing Page (PLP).
This required rewriting the browser URL **once on the very first client render**, without navigating or causing a reload.

The intended behavior was simple:

> “As soon as the PLP loads on the client, compute the new canonical facet URL and replace the current URL once.”

This flow works in **plain React**, since the browser history API (`window.history.replaceState`) runs without interference.

But in **Next.js App Router**, the same approach caused the URL to repeatedly revert, re-triggering unwanted state changes and resulting in endless console logs of `replaceState` being fired.

---

# ✅ **Observed Issues**

When executing `window.history.replaceState` on first render inside the `useProducts` hook, we saw:

1. **Repeated replaceState calls**
   Logs showed the same URL being replaced multiple times, even though the code intended to run only once.

2. **URL reverting to old/fallback logic**
   Despite computing a “new facet URL”, Next.js internally restored the URL back to an older/canonical version.

3. **Hydration conflicts**
   The stack traces intermittently pointed into:

   ```
   next/app-router.tsx
   react-dom-client.development.js (hydration)
   ```

   implying router-level rewrites.

4. **Infinite render–replace–rerender loop symptoms**

   - Next.js triggered rerenders
   - Our replaceState re-fired
   - Router replaced the URL again
   - Loop repeated

5. **`useSearchParams` snapshot desynchronization**
   Our changes to the URL were not reflected in Next.js' router state, causing repeated snapshots and more rerenders.

---

# ✅ **Root Cause Summary**

The root issue isn’t React itself — it’s **Next.js App Router’s URL ownership**.

We executed `replaceState` **too early**, while Next.js was still:

- hydrating the page
- synchronizing the client URL with server state
- running its internal `router.replace()` calls
- updating locale/canonical search parameters

Because of this, our direct call to `window.history.replaceState` triggered a conflict with Next.js’ internal routing system.

This resulted in:

- Next.js restoring its “canonical” URL immediately after ours
- Our effect firing again on rerender
- Endless cycles
- The “new facet logic” being overwritten
- Logs exploding with repeated replaceState traces

In short:

> **We attempted to replace the URL at a moment when Next.js had not finished taking control of routing.**

In React alone, this is fine.
In Next.js, it's not — the router aggressively synchronizes URL state during hydration, and any external mutation collides with it.

---

# ✅ **Why It Happens Only in Next.js App Router**

Unlike plain React:

- **Next.js App Router owns the URL**, not your component.
- It runs a series of internal effects to reconcile:

  - locale
  - searchParams
  - parallel route state
  - canonical URL generation
  - rewrites and middleware effects

When we mutated `window.history` during this process, App Router took it as a divergence and immediately re-applied its stored URL.

That’s why our new facet URL “appeared” briefly but always reverted.

---

# ✅ **Goal Restated**

We must:

✅ Update the URL **immediately on first client render**
✅ Without triggering navigation
✅ Without router conflicts
✅ Without rerender loops
✅ While respecting App Router’s hydration and state synchronization

This becomes non-trivial only because **Next.js needs to finish its initial URL sync before we rewrite anything.**

Below is the **Solution Documentation** section, written exactly like a Medium-style engineering article and fully aligned with the final fix you provided — including your `useEffect` + `window.history.replaceState` example.

This is the **second half** of the article, following the problem statement you approved.

---

---

---

---

---

# ✅ **Solution: How We Ensured URL Replacement Executes Cleanly on First Render in Next.js App Router**

After identifying the reason behind the endless replace loops and URL reversion, the fix turned out to be straightforward — but required following the rules of **Next.js App Router hydration**.

In plain React you can get away with calling:

```ts
window.history.replaceState(...)
```

directly as part of your component logic, even during the initial render, because React does not own navigation or the URL.

But in **Next.js App Router**, the router _must finish its own initial hydration and URL synchronization_ before any manual `replaceState` runs.
If you fire too early (e.g., during render), Next.js will immediately override you.

So the solution has two key parts:

---

# ✅ **1. Move the URL Mutation into `useEffect` (Client-Only + Post-Hydration)**

The most reliable way to run one-time URL replacement is:

- Only in the browser
- Only after hydration
- Only after Next.js has finished its initial internal reconciliation

Which is exactly what `useEffect` guarantees.

Here’s the minimal working pattern:

```tsx
"use client";
import { Heading } from "@bosch-bshg-cloud/d2c-component-heading";
import { useEffect } from "react";

export default function Test() {
  useEffect(() => {
    if (window !== undefined) {
      window.history.replaceState({}, "", "/test1");
    }
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Check the URL path → it will be /test1</h2>
    </div>
  );
}
```

### ✅ Why this works

- `useEffect` runs **after hydration commit**, not during render.
- By that point, Next.js has finished:

  - URL canonicalization
  - locale/segment validation
  - router state hydration
  - search param snapshot setup

- Your replaceState runs **after** all that, so Next.js no longer fights it.

The result:
✅ The URL replaces exactly once
✅ No revert
✅ No router interference
✅ No infinite loops
✅ No repeat render triggers
✅ Fully stable behavior

---

# ✅ **2. Use This Pattern Inside the Parent Component**

Your final integration looks like this:

```tsx
export const FindADealer = () => {
  return (
    <>
      <Heading size="lg" aria-label="find-a-dealer-headline" context="onPage50">
        Find a Dealer Page
      </Heading>
      <p>Map from smart component should be loaded here!!</p>
      <Test />
    </>
  );
};
```

This confirms the requirement:
Run the URL replacement **exactly once** when the page mounts, without interfering with the rest of the UI.

---

# ✅ **Why This Solves Our Original PLP Issue**

Returning to the PLP scenario:

- We wanted to apply new facet/search-provider logic **as soon as the page hydrated**.
- We attempted to compute the new canonical URL and replace the existing one.
- Doing this during render caused a conflict with Next's internal router reconciliation.
- Moving the logic into `useEffect` guarantees:

  - React first renders the page
  - Next.js hydrates internal router state
  - Router finishes its initial replace cycle
  - **Only then** our facet URL rewrite happens
  - And stays

This brings the whole system into alignment:
React ✅
Next.js App Router ✅
Browser History API ✅
Facet Logic ✅
Search Provider Override ✅

---

# ✅ Final Summary

### **The fix was not to avoid `window.history.replaceState`, but to run it at the correct time.**

That “correct time” in Next.js App Router is:

✅ inside a client component
✅ inside `useEffect`
✅ with `[]` dependencies
✅ after hydration
✅ after router initialization

Running the replacement this way prevents every issue we saw:

- No URL reverting
- No race with App Router’s URL sync
- No infinite replace loops
- No repeated renders
- Snapshot from `useSearchParams` stays correct
- Facet logic remains stable

---

```
'use client'
import { Heading } from '@bosch-bshg-cloud/d2c-component-heading'
import { useEffect } from 'react'
export default function Test() {
  useEffect(() => {
    if (window !== undefined) {
      window.history.replaceState({}, '', '/test-url')
    }
  }, [])
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Check the URL path → it will be /test-url</h2>
    </div>
  )
}
export const FindADealer = () => {
  return (
    <>
      <Heading size="lg" aria-label="find-a-dealer-headline" context="onPage50">
        Find a Dealer Page
      </Heading>
      <p>Map from smart component should be loaded here!!</p>
      <Test />
    </>
  )
}
```

## Next js router loads the whole page from server side

```
'use client'
import { Heading } from '@bosch-bshg-cloud/d2c-component-heading'
import { useEffect } from 'react'
export default function Test() {
  // const router = useRouter()
  useEffect(() => {
    // router.replace('/test1')
    window.history.replaceState({}, '', '/test1')
  }, [])
  // router.replace('/test1')
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Check the URL path → it will be /hydration-success</h2>
    </div>
  )
}
export const FindADealer = () => {
  return (
    <>
      <Heading size="lg" aria-label="find-a-dealer-headline" context="onPage50">
        Find a Dealer Page
      </Heading>
      <p>Map from smart component should be loaded here!!</p>
      <Test />
    </>
  )
}
```
