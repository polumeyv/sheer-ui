# Presence migration

Surfaces that animate out used to stay mounted through JS (a presence manager waited for the exit
to settle, then unmounted; deleted 2026-08-31). The always-mounted recipe replaces that with CSS:
the closed state is inline, the motion is a transition or keyframe, completion is
`useOpenChangeComplete` (`internal/animations-settled.svelte.ts`).

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
| Navigation menu content, viewport, indicator | visibility (`nav-*-surface`) | Content enters are keyframes: every enter fades, a swap also slides from the previous item's side, while exits fade only on a swap or in the viewport-less layout. Content stays visible through the viewport's zoom-out on Escape as well as on pointer-leave (it used to unmount instantly on Escape). |
| Select / Combobox content (`components/combobox/select`) | visibility (`popup-surface`) | Same shape as the menu; no sub-content, no swap. |
| Drawer content and overlay (`dialog-content-headless`, `dialog-overlay`) | keyframes | The exit keyframes (`slideTo*`, `fadeOut`) keep `visibility: visible` while they run, so the hold is the animation itself; vaul's inline `transition` writes during drag cannot cancel it. Snap-point drawers exit by transform transition and hold visibility for its length. The scroll lock keys on the dialog root's `present`, and `BodyScrollLock.release()` is the owner effect's cleanup: registration is synchronous in the constructor, so unregistering could not stay in a child effect that an immediate re-run destroys before it ever runs. Known deviation: after a drag-dismiss in WebKit, `onOpenChangeComplete(false)` fires ~0.5 s late (WebKit holds a `transform` transition behind the exit keyframe and runs it, invisibly, afterwards; the settle waits for it). |
| Sheet overlay | visibility (`overlay-surface`) | Sheet content itself is the native `<dialog>`. |

## Verification

Behavior before and after is compared in a real browser, not inferred: a scratch route mounts
dropdown, context menu and menubar with `onOpenChangeComplete` logging, and a Playwright script
drives mouse, keyboard, hover, outside click, scroll-then-reopen and a reopen mid-exit while a rAF
sampler records `data-state`, `checkVisibility({ visibilityProperty: true })`, opacity, running
animations, `document.activeElement` and the body scroll lock, in Chromium, Firefox and WebKit.
The menu migration matches its baseline on every row; the one intentional difference is that
`onOpenChangeComplete(true)` now fires on open (the JS presence path ran its settle against a not
yet mounted node and dropped it).
