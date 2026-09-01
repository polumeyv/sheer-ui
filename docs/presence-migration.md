# Presence migration

Surfaces that animate out used to stay mounted through JS (`internal/presence-manager.svelte.ts`
waits for the exit to settle, then unmounts). The always-mounted recipe replaces that with CSS:
the closed state is inline, the motion is a transition, completion is `useOpenChangeComplete`
(`internal/animations-settled.svelte.ts`).

## Rule

| Closed state | Use when |
| --- | --- |
| `visibility: hidden` | The surface is out of flow (a floating wrapper, the top layer). Transitions discretely in every engine and stays visible until the exit ends. |
| `display: none` | The surface is in flow and must give its space back. Chrome 117 and Safari 18 transition `display` discretely (`transition-behavior: allow-discrete`); Firefox never has — BCD `css.properties.display.is_transitionable` — so the exit snaps there. |

The entry-only slide (`@starting-style` in the display recipe) becomes a per-property timing in the
visibility recipe: the closed state gives `translate` a zero duration and a full-length delay, so it
jumps to its offset only once hidden; the open state transitions it back. Visibility itself gets a
zero duration on the way in — a hidden→visible transition is still hidden at its first frame, and the
focus scope's opening `focus()` runs exactly there.

## Current state

| Surface | Recipe | Notes |
| --- | --- | --- |
| Menu family content and sub-content (`components/menu`) | visibility (`popup-surface` in `assets/ui.css`) | Static content is display (`popup-surface-static`). The engine sets the closed state inline, so headless use hides without the utility. Items of a closed sub-content are excluded from the parent's roving/typeahead candidates by selector. The scroll lock keys on `present` (open, or exit pending), the window element lifecycle used to give it. A menubar swap zeroes the exit inline and completes synchronously. |
| Dialog, Sheet (`<dialog>`) | keyframes + deferred `close()` | Unchanged; native top layer. |
| Tooltip, Popover, Link preview (native popover) | display (`transition-discrete`) | Exit snaps in Firefox (verified 2026-08-31: `display: none` 40ms after hover-out, no running animation). Candidate for the visibility recipe if the top layer allows it — a hidden popover is removed from the top layer by the UA, so this needs a check first. |
| Navigation menu | display, in PR #58 | Same Firefox snap. |
| Select / Combobox content (`components/combobox/select`) | visibility (`popup-surface`) | Same shape as the menu; no sub-content, no swap. |
| Drawer (vaul) | keyframes on `[data-state=closed]` | Cannot migrate: the exit is a keyframe animation the controller waits for. |

## Verification

Behavior before and after is compared in a real browser, not inferred: a scratch route mounts
dropdown, context menu and menubar with `onOpenChangeComplete` logging, and a Playwright script
drives mouse, keyboard, hover, outside click, scroll-then-reopen and a reopen mid-exit while a rAF
sampler records `data-state`, `checkVisibility({ visibilityProperty: true })`, opacity, running
animations, `document.activeElement` and the body scroll lock, in Chromium, Firefox and WebKit.
The menu migration matches its baseline on every row; the one intentional difference is that
`onOpenChangeComplete(true)` now fires on open (the JS presence path ran its settle against a not
yet mounted node and dropped it).
