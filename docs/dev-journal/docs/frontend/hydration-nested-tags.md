---
title: Hydration Issues With Nested Interactive Tags
description: Why React hydration breaks when anchors or buttons are nested inside each other, and how to fix it.
sidebar_position: 1
slug: /frontend/hydration-nested-tags
---

import NestedInteractiveElementsDemo from '@site/src/components/nested-interactive-elements-demo';

React hydration is unforgiving. If your server outputs invalid HTML, React will surface hydration mismatches and can break the page. One common cause is nesting interactive elements.

<NestedInteractiveElementsDemo />

## Invalid Markup

```html
<a href="/products">
  <a href="/products/123">View Product</a>
</a>
```

```html
<button>
  <button>Click</button>
</button>
```

Browsers repair this markup before React hydrates it, which leaves React looking at a different DOM shape than the server rendered.

## What The Demo Shows

- the invalid HTML string you thought you rendered
- the normalized DOM the browser actually creates
- why the live clickable elements behave as siblings or detached controls instead of nested controls

If the browser repairs the tree, React no longer hydrates the same structure the server emitted.

## Why It Breaks

Nested anchors and nested buttons break:

- semantics
- accessibility
- click behavior
- keyboard navigation
- focus management

The browser repairs the tree and React then reports hydration mismatches.

## Why It Sometimes Looks "Fine" While Coding

The JSX or HTML can look visually plausible in the editor because nesting is just text at that stage. The problem appears only after the browser parser turns that text into real DOM nodes.

That is why these bugs are easy to miss until runtime.

## Correct Fixes

### Never nest interactive elements

```html
<a class="parent-link">
  <span class="child-text">Child</span>
</a>
```

```html
<button>
  <span>Child button content</span>
</button>
```

### Separate multiple actions

```html
<div class="actions">
  <a>Read more</a>
  <button>Save</button>
</div>
```

### Sanitize CMS content

Use tools such as:

- DOMPurify
- rehype-sanitize
- a custom parser that unwraps nested anchors and buttons

### If you want a card-like nested effect, use layout, not nesting

```html
<div class="card">
  <a class="primary-link">Title</a>
  <button class="secondary-action">Save</button>
</div>
```

Separate the actions in the DOM and use CSS to make them feel visually grouped.

## Quick Checklist

If hydration fails, ask:

- Did I nest `<a>` inside `<a>`?
- Did I nest `<button>` inside `<button>`?
- Did the browser repair my markup before hydration?

## TL;DR

Hydration breaks because invalid nested interactive markup is repaired by the browser before React hydrates the page.
