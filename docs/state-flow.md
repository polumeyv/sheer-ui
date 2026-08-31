# State flow contract

How state moves between apps, components, and `*State` classes. Checkbox
(`src/lib/components/checkbox`) is the reference implementation of the bridge
tier; Dialog/Sheet pilot the cell architecture below, which is the target.

## Cells (pilot: dialog + sheet)

State is split from machinery. The **cell** (`DialogState`, internal) is pure
signals — no effects, no DOM; reading and writing `cell.open` is the entire
state surface. The **machinery** (`DialogRootState`:
presence, focus, layers) is created by `Root` and wired to the parts via
context, exactly as before — context's job (letting nested parts understand
their relationship without the consumer wiring it) is unchanged. The machinery
is just another dependent of the cell.

The cell NEVER leaves the tree — consumers never construct or hold one. Consumer
coupling is entirely through plain values:

```
nothing            <Dialog.Root> + Trigger — Root constructs its own cell
source prop        <Dialog.Root open={editing !== null}> — consumer's OWN state
                   (a boolean, a route param) is the derivation source;
                   interactions override until the next source change
settle reconcile   onOpenChangeComplete={(o) => !o && (myOpen = false)} — bring
                   the source back in line after a dismissal
snippet arg        {#snippet children(dialog)} … dialog.open — typed in-tree,
                   for close buttons and form-success closes
```

There is no `bind:open` and no `onOpenChange` — the `open` prop is a one-way
derivation source, never a synchronized mirror. `onOpenChangeComplete` survives as an
occurrence (in practice it fires on close only: content mounts lazily, so the
animation tracker has no node at open time); use it to translate dismissal into
navigation for router-owned sources. External machines that own their open
(vaul drawer, SidebarState) adapt with a source cell + a small adapter effect —
see drawer.svelte / sidebar-mobile-surface.svelte.

## Public API

```
state in/out      one $bindable prop per concept (value, open, checked, pressed…)
                  bind: is THE way to share state; every stateful prop has a
                  fallback, so the uncontrolled case works without bind:

side effects      on<Prop>Change — optional, fires exactly once per
                  component-initiated write, from the write path (the
                  bindableWith bridge), never from $effect. Parent writes to the
                  bound prop do not echo it. Never required for state sync;
                  bind: alone must always work.

discrete events   verb-named callbacks: onSelect, onComplete, onValueCommit,
                  onOpenChangeComplete. Edge-triggered, never carry state,
                  never spelled *Change.

external truth    when the source of truth is outside Svelte state (router,
                  form engine): controlled prop={x} + on<Prop>Change writeback,
                  or a function binding bind:value={() => q.current, (v) => (q.current = v)}.
```

## Consumer patterns (apps)

| want | write |
|---|---|
| share state | `bind:value={x}` |
| react to a change | `$derived` / `$effect` over `x` — the binding already carries every write |
| transform / validate | `bind:value={() => x, (v) => (x = clamp(v))}` |
| URL / form-engine driven | `open={!!params.edit}` + `onOpenChange={setEditing}` |

Never `value={x}` + `onValueChange={(v) => (x = v)}` (hand-rolled bind:). A
change callback next to a binding is a second channel for the same write:
components keep `on<Prop>Change` for the controlled case above, blocks expose
`bind:` only.

## Internals — three tiers

| tier | examples | rule |
|---|---|---|
| leaf / native | `*-native`, input, textarea | runes only: `$bindable` + native `bind:` + callback from the DOM handler. No boxes, no State class. |
| complex (State class) | overlays, collections, date/time | box membrane stays; every writable bridge goes through `bindableWith`. |
| blocks | `blocks/*` | consume primitives with `bind:` only, no callback forwarding. No boxes. |

## The bridge (`bindableWith`)

```svelte
value: bindableWith(
	() => value,
	(v) => (value = v),
	(v) => onValueChange?.(v),
),
```

- `bindableWith(get, set, notify?)` is the only writable bridge; `boxWith` is
  read-only views. A two-argument `boxWith` is legacy — migrate on touch.
- `set` writes unconditionally. Equality / idempotence guards live with the
  writer in the State class (see `CheckboxGroupState.addValue`), so every write
  is a real change and `notify` fires exactly once per change.
- `notify` is a closure, never a bare reference: destructured callback props are
  read at call time through the closure; a bare `onValueChange` freezes the
  value from bundle-creation time.
- Change callbacks fire only from the bridge. State classes never receive or
  call `on*Change` — if a class needs to announce a change, it writes
  `opts.<prop>.current` and the bridge notifies.
- Event callbacks (`onComplete`, `onValueCommit`, …) are passed as read-only
  boxes and fired from interaction handlers, not from `$effect` edge-watchers.

## Sanctioned exceptions

- `repairBindable(track, repair)` — init-time repair only: its synchronous
  first call fixes derived-at-setup state for SSR (e.g. a grouped checkbox's
  `checked` from the group value), which effects cannot do. Not a license for
  effect-as-data-pipe.
- Intra-class `$effect.pre` sync between two genuinely dual-sourced signals
  (group value ⇄ item checked) is allowed inside State classes, guarded with
  `untrack` and idempotent writers.
