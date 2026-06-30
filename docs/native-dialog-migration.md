# Native dialog migration

Use native `<dialog>` when it can preserve the existing behavior contract. Keep the JS-backed
component when the public API exposes behavior that native HTML cannot replace one-for-one.

## Rule

| Decision | Use when |
| --- | --- |
| Direct native | The surface is app-owned, modal-only, and can use native focus trapping, Escape dismissal, inert background, and `::backdrop`. |
| Thin native adapter | Native modal semantics work, but Svelte controlled state, snippets, scroll lock, or close callbacks still need a bridge. |
| Keep component behavior | The component exposes custom focus, outside-interaction, overlay, child-element, or presence behavior that consumers can rely on. |

## Current state

```txt
NativeDialog
  -> <dialog>
  -> showModal() / close()
  -> native Escape + focus trap + inert background + ::backdrop
  -> JS only for Svelte state sync and scroll lock

Sheet.Content
  -> <dialog>
  -> showModal() / close()
  -> keeps the Dialog state/presence shell for API compatibility
  -> JS only for Svelte state sync, scroll lock, and callback shims

Dialog.Content
  -> keep JS-backed for now
```

`NativeDialog` and `Sheet.Content` are good native targets because their current consumers expect a
modal surface, not a low-level interaction primitive. Generic `Dialog.Content` is different: it is a
shared primitive with public props from `FocusScope`, `DismissibleLayer`, `EscapeLayer`,
`TextSelectionLayer`, `PresenceLayer`, and `ScrollLock`.

## Generic Dialog audit

| Surface | Native replacement | Decision | Reason |
| --- | --- | --- | --- |
| `Dialog.Content` focus trap | `showModal()` | Keep component behavior | Native modal focus cannot honor `trapFocus={false}`, `onOpenAutoFocus`, `onCloseAutoFocus`, or focus-outside hooks one-for-one. |
| `Dialog.Content` Escape handling | native `cancel` | Keep component behavior | Native Escape can close the modal, but the current API exposes `escapeKeydownBehavior` and `onEscapeKeydown` before close. |
| `Dialog.Content` outside interaction | backdrop click / `closedby` | Keep component behavior | The current API exposes dismissible-layer behavior and `onInteractOutside`; native backdrop events do not match that stack. |
| `Dialog.Overlay` | `::backdrop` | Keep component behavior | Existing consumers style and render a separate overlay component. `::backdrop` cannot receive those props, classes, snippets, or presence state. |
| `Dialog.Content` child snippet | custom `<dialog>` child | Keep component behavior | A native adapter would require the child to be a real `HTMLDialogElement`; the current child API accepts arbitrary elements. |
| `Dialog.Content` text selection guard | none | Keep component behavior | Native dialog does not replace the current overflow text-selection attachment. |
| `Dialog.Content` scroll lock | none | Keep JS | `showModal()` makes the page inert but does not reliably freeze background scrolling, especially on touch browsers. |

## Safe migration targets

| Target | Decision | Notes |
| --- | --- | --- |
| `src/lib/components/native-dialog/native-dialog.svelte` | Direct native | Keep as the small app-owned modal surface. |
| `src/lib/blocks/alert-modal/AlertModal.svelte` | Direct native | Already migrated through `NativeDialog`. |
| `src/lib/components/sheet/components/sheet-content.svelte` | Thin native adapter | Already migrated while preserving the Sheet API surface. |
| App-owned simple dialogs without `Dialog.Overlay` or custom focus/outside props | Candidate direct native | Migrate case-by-case to `NativeDialog` after visual review. |
| `src/lib/components/command/command-dialog.svelte` | Keep component behavior | Uses `Dialog.Portal`, `Dialog.Overlay`, and content composition. Native conversion needs a command-specific adapter, not a generic swap. |
| `src/lib/registry/dialog-demo.svelte` | Keep component behavior | It demonstrates the generic Dialog API, including separate overlay/content composition. |

## Next cleanup targets

1. Prefer `NativeDialog` for new app-owned modal surfaces that do not need low-level Dialog props.
2. Migrate simple app dialogs to `NativeDialog` only when they do not render `Dialog.Overlay` and do not use custom focus/outside/Escape behavior.
3. Keep `Dialog.Content` JS-backed until a major API change can remove or rename the non-native props.
4. If the generic primitive is redesigned later, introduce a new native-specific API instead of silently changing the current one.
