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
  -> popover="manual"
  -> showPopover() / hidePopover()
  -> data-anchored + anchor()
  -> Svelte state bridge for controlled/custom interactions
```

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
