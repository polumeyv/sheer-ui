# Native popover migration

Use native HTML/CSS overlay primitives when they can preserve the existing behavior contract one-for-one.

## Rule

| Decision | Use when |
| --- | --- |
| Direct native | `popover`, `popovertarget`, and CSS anchor positioning preserve behavior without extra state orchestration. |
| Thin adapter | Native top-layer and CSS positioning work, but Svelte controlled state, snippets, or custom callbacks are still required. |
| Keep component behavior | JS owns real interaction semantics such as hover delay, safe pointer travel, shared picker state, or custom dismissal. |

## Current state

`Popover.Content` already uses the native top layer and CSS anchor positioning:

```txt
Popover.Content
  -> popover="auto"   (tooltip and link-preview run popover="manual")
  -> showPopover() / hidePopover(), the hide deferred until the exit settles
  -> data-anchored + anchor()
  -> Svelte state bridge for controlled/custom interactions
```

Exit contract (2026-09-01): open/closed styling keys on `data-state`, not `:popover-open` — the
lifecycle holds the popover in the top layer until the `[data-state=closed]` exit settles, then
calls `hidePopover()`. The Popover (auto) additionally conjoins `open:` (`:popover-open`), so a
UA-initiated dismissal, which drops `:popover-open` before state catches up, fades from t=0 under
the Chrome-only display/overlay hold. A `child`-snippet consumer supplying its own classes keys
its exit on `data-[state=closed]`; an exiting `[data-anchored]` surface is pointer-inert via ui.css.

The remaining migration work is not a delete-all-components pass. It is a reduction pass: remove JS and component wrappers only where native HTML/CSS can carry the same behavior.

## Usage audit

| Usage | Path | Decision | Reason |
| --- | --- | --- | --- |
| Mobile nav | `src/lib/layout/MobileNav.svelte` | Direct native | Already uses `popovertarget` and `popover="auto"` with simple panel behavior. |
| Popover demo | `src/lib/registry/popover-demo.svelte` | Direct native | Static button-triggered content; no controlled state, custom dismissal, hover delay, or child-close behavior. |
| Icon picker | `packages/polumeyv/pro/src/routes/(app)/(protected)/settings/profile/icon-picker.svelte` | Candidate thin/native | Simple trigger and content, but currently uses `bind:open` so selection can close through Svelte state. Migrate only with an equivalent `hidePopover()` or `ontoggle` bridge. |
| Data table faceted filter | `src/lib/components/data-table/table-faceted-filter.svelte` | Keep adapter | Uses custom trigger snippets and command content; native top layer is fine, but component composition still adds value. |
| Date picker blocks | `src/lib/blocks/date-picker/*.svelte` | Keep adapter | Picker open state is shared with date-field/calendar state and close-on-select behavior. |
| Time picker blocks | `src/lib/blocks/time-picker/*.svelte` | Keep adapter | Same picker-style composition pattern as date pickers. |
| Date picker internals | `src/lib/components/date-picker/*` | Keep adapter | Directly creates `PopoverRootState` to share controlled picker state. |
| Hover-delay tests | `tests/components/popover-close-delay.*` | Keep JS behavior | Hover delay and safe pointer travel are not CSS-only one-for-one replacements. |

## Next cleanup targets

1. Remove or deprecate ignored Floating-UI-era props on `PopoverContentProps`.
2. Convert simple app-local popovers only after confirming they do not need controlled open state.
3. Keep `Popover` as a native-popover adapter for controlled and composed overlays.

## CSS anchor positioning for the JS surfaces (2026-09-01)

The menu family and select/combobox position with CSS anchor positioning too (`internal/floating-layer`,
no `@floating-ui/dom`): the content element itself is anchored via `position-area`, unclamped
`position-try-fallbacks` flips first, and the `--bits-clamped` options (ui.css) cap the block size
when no side fits the whole content. Differences from the floating-ui behavior, measured in three
engines: at a flush viewport edge the content flip-aligns to the trigger edge instead of sliding to
the viewport edge (≤ the trigger-width difference); when no side fits the whole content the
requested side is kept and scrolls, where floating-ui switched to the tallest side. `data-side`/
`data-align`, the transform origin and the arrow follow the RESOLVED placement: the applied
position-try fallback is not readable back (anchored container queries are Chrome-only), so it is
measured from the rects while open and re-checked on scroll/resize. A closed-at-rest surface drops
its anchored style — a page of always-mounted anchored boxes otherwise taxes every layout pass.
The anchor name is written imperatively by the trigger attachment; the content must follow its
trigger in tree order.

`collisionBoundary` and `sticky` do not exist here, by design, researched 2026-09-01: CSS anchor
positioning is viewport-only and flip-only (CSSWG removed the boundary mechanism from Level 1;
continuous slide is a dormant Level-2 issue), which is also where the post-floating-ui libraries
landed (Ariakit/Kobalte/melt-next expose no boundary; Base UI defaults to flip on both axes; the
native `<select>` picker behaves the same), and real-world usage is a few hundred call sites on all
of public GitHub. The one audience this genuinely excludes: apps whose popups live inside a canvas
or embedded pane whose edges matter more than the viewport's. `hideWhenDetached` is real, via
`position-visibility: anchors-visible`.
