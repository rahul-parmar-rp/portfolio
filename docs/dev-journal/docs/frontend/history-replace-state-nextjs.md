---
title: History Replace State Behaves Weirdly With Next.js
description: Why window.history.replaceState can fight Next.js App Router during hydration, and when to use router navigation versus the history API.
sidebar_position: 2
slug: /frontend/history-replace-state-nextjs
---

## Problem Summary

Replacing the URL with `window.history.replaceState` during the first client render can conflict with Next.js App Router hydration.

Typical symptoms:

- repeated `replaceState` calls
- URL reverting to an older canonical value
- router-level rerenders
- loops involving hydration and `useSearchParams`

## Root Cause

Next.js App Router owns the URL during hydration. If you mutate `window.history` too early, App Router may treat it as divergence and restore its own canonical URL.

That usually means your code is trying to update the address bar while Next.js is still:

- hydrating the route tree
- reconciling search params and internal router state
- restoring its own canonical URL snapshot

In plain React this is usually fine. In App Router it is much easier to create a race.

## Safe Pattern

Run the URL replacement in a client component and only inside `useEffect`.

```tsx
"use client";
import { useEffect } from "react";

export default function Test() {
  useEffect(() => {
    window.history.replaceState({}, "", "/test1");
  }, []);

  return <div className="App" />;
}
```

## Why It Works

`useEffect` runs after hydration commit. At that point Next.js has finished its initial router synchronization, so your history mutation is much less likely to be reverted.

If the goal is “replace the visible URL once after first render without triggering a route navigation”, this is the safest baseline pattern.

## Router Navigation Vs History API

These two tools solve different problems.

### Use `router.push()` or `router.replace()` when:

- you want Next.js to own the navigation
- you expect router state, loading behavior, and framework-managed search params to update together
- the new URL should behave like a real app navigation

### Use `window.history.pushState()` or `window.history.replaceState()` when:

- you only want to mutate the browser URL locally
- you do not want to trigger a Next.js route transition
- you understand that you are stepping outside the router contract

If you use the history API directly, do it after hydration and do not assume `useSearchParams` will immediately behave as if Next Router initiated the change.

## Practical Rule

Default to the Next router first.

Reach for the history API only when you specifically need a local URL rewrite without navigation, and only after the app has mounted.

## Rule Of Thumb

If you need one-time URL replacement in App Router:

- do it in a client component
- do it inside `useEffect`
- do it once with an empty dependency array
- do not do it during render
