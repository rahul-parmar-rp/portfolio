⚠️ Why React Hydration Breaks When You Nest Interactive Elements
(a.k.a. Don’t Put <a> Inside <a> or <button> Inside <button>)

React hydration is unforgiving. If your server outputs invalid HTML, React won’t politely look the other way — it will throw hydration mismatch errors and break your page. One of the most common causes? Nesting interactive elements.

This blog explains why it happens, what breaks, and how to fix it.

✅ What Actually Is Hydration?

When you use SSR or SSG (Next.js, Remix, etc.):

The server sends static HTML.

React bootstraps on the client and “hydrates” that HTML by attaching events and making it interactive.

For hydration to work, the DOM on the client must match exactly what the server sent.

❌ The Problem: Nested Interactive Elements

Developers often (accidentally) write markup like:

<a href="/products">
  <a href="/products/123">View Product</a>
</a>

or

<button>
  <button>Click</button>
</button>

This is invalid HTML. Browsers auto-correct it before React ever touches it.

✅ Browser “Repair” Example

Server sends:

<a><a>Text</a></a>

Browser fixes it to:

<a></a>
<a>Text</a>

Now React tries to hydrate and sees:

Server markup: nested anchors

Client markup: two sibling anchors

React:
“Nope. Mismatch. Hydration failed.”

✅ Why Browsers Refuse Nested Buttons/Anchors

Because it breaks:

semantics

accessibility

click behavior

keyboard navigation

focus management

So browsers rewrite it, leaving React confused.

✅ What React Does

React compares the SSR HTML with the DOM it finds. If the browser rewrote the structure:

React logs hydration errors

Components fail to hydrate

Event handlers don’t work

In worst cases, React throws the whole subtree away and re-renders on the client

Not ideal.

✅ How To Fix It (The Right Way)

1. Never nest interactive elements

Replace:

<a><a>Child</a></a>

with:

<a className="parent-link">
  <span className="child-text">Child</span>
</a>

Or:

<button>
  <span>Child button content</span>
</button>

2. If you need multiple actions → separate them
<div className="actions">
  <a>Read more</a>
  <button>Save</button>
</div>

3. If this comes from a CMS → sanitize it

Use a library like:

DOMPurify

rehype-sanitize

a custom HTML parser that unwraps nested anchors/buttons

4. If you truly need a nested UI effect → use CSS

Let the wrapper be non-interactive:

<div className="card">
  <a className="primary-link">Title</a>
  <button className="secondary-action">✚</button>
</div>

✅ Quick Checklist

If hydration fails, ask:

Did I accidentally nest <a> inside <a>?

Did I nest <button> inside <button>?

Did a CMS inject wrong HTML?

Did the browser auto-correct my HTML before hydration?

90% of the time, it’s one of these.

✅ TL;DR

React hydration breaks because:

Nested interactive elements → invalid HTML

Browsers auto-fix that HTML

React sees mismatched structure

Hydration fails

Stick to valid markup and the issue disappears instantly.

```
<!doctype html>
<html lang="en">
  <head></head>
  <body>
    <a>
      <a>Inner</a>
    </a>
    <button>
      Click me
      <button>test</button>
    </button>
  </body>
</html>
```
