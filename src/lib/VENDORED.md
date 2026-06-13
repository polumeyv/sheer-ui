# Vendored code

The headless primitive layer is vendored source, not a dependency. Inlined 2026-06-12 to stop
bundler issues from Svelte-flavored deps (six runed copies and three svelte-toolbelt copies in the
old graph, all shipping `.svelte.js` runes code that consumer apps had to compile and dedupe).

## What lives where

| Path | Upstream | Version |
| --- | --- | --- |
| `bits/`, `internal/`, `shared/`, `types.ts`, `bits-ui.ts` | [huntabyte/bits-ui](https://github.com/huntabyte/bits-ui) tag `bits-ui@2.18.1`, `packages/bits-ui/src/lib` | 2.18.1 |
| `vendor/toolbelt/` | [huntabyte/svelte-toolbelt](https://github.com/huntabyte/svelte-toolbelt) tag `v0.10.6`, `src/lib` | 0.10.6 |
| `vendor/runed/` | [svecosystem/runed](https://github.com/svecosystem/runed) tag `runed@0.35.1` — only the utilities bits-ui/toolbelt import (ElementSize, IsMounted, Previous, useDebounce, watch, extract) plus `internal/` | 0.35.1 (subset) |
| `vendor/tabbable/` | tabbable npm dist (`dist/index.esm.js` + `index.d.ts`) | 6.4.0 |
| `vendor/style-to-object/` | style-to-object esm build + inline-style-parser esm build | 1.0.14 / 0.2.7 |
| `vendor/clsx/` | clsx npm dist (`dist/clsx.mjs` + `clsx.d.mts`) | 2.1.1 |
| `vendor/env.ts` | hand-written replacement for `esm-env` (`BROWSER`/`DEV` only) | — |

All upstreams are MIT. `bits/LICENSE`, `vendor/toolbelt/LICENSE`, and `vendor/runed/LICENSE` carry
the upstream texts.

Kept as regular dependencies on purpose: `@floating-ui/dom` (pure TS, no Svelte involvement) and
the `@internationalized/date` peer (calendar engine; see the date-boundary tripwire in the
monorepo root).

## Component layer: merged view shells

The shadcn components in `src/lib/components/` and `src/lib/booking/` own their view layer directly.
Each one creates the bits-ui `*State` from `$lib/bits/<x>/<x>.svelte.js`, renders the markup itself,
and folds the shadcn `data-slot` + `cn()` classes into the first argument of the state's
`mergeProps(...)`. They do **not** wrap a `<XPrimitive.Foo>` view shell. Canonical shapes:
`components/accordion/accordion.svelte` (simple) and `components/select/select-content.svelte`
(floating — mirrors `components/popover/popover-content.svelte`'s `PopperLayer` structure).

Post-merge, `bits/` is the headless engine for these components: they import only state
(`*.svelte.ts`), `types.ts`, and the shared `utilities/` / `internal/` / `shared/` helpers from it.
The `bits/<x>/components/*.svelte` view shells stay as the faithful upstream snapshot — the merged
components don't import them, but they back internal bits compositions (e.g. `combobox` → `select`,
`date-picker`/`date-range-picker` → `popover`) and the tag-diff sync below, so they are kept, not
deleted.

Three primitives are deliberately **not** inlined and are still wrapped through the `$lib/bits-ui.js`
barrel, because inlining them would duplicate a shared engine or collapse a type boundary:

- `dialog` — one focus-trap / dismiss / portal engine behind `dialog`, `sheet`, `alert-dialog`, and
  `command`'s dialog. Inlining would copy the engine into each skin.
- `menu` — one roving-focus / typeahead / submenu engine behind `context-menu`, `dropdown-menu`,
  `menubar`.
- `calendar` / `range-calendar` — the `booking/*` wrappers bridge branded `DateString` (above) and
  `@internationalized/date` `DateValue` (below) right at the primitive; inlining pulls the DateValue
  default-handling across that seam (see the `check:date-boundary` tripwire).

So the barrel stays as the internal surface for those engine families plus a few type-only imports.
When adding a new shadcn component: inline its shell into the styled component (don't reintroduce a
`<XPrimitive.Foo>` wrapper) unless it wraps one of the three engines above.

## Local deviations from upstream

Recorded so a future upstream diff isn't mistaken for drift:

- Bare imports rewritten to local paths: `svelte-toolbelt`/`runed`/`tabbable`/`esm-env` →
  `$lib/vendor/...`; toolbelt's and runed's internal `$lib/...` self-references re-rooted under
  their vendor dirs; four files imported bits-ui's own root barrel (`$lib/index.js`) and now point
  at `$lib/bits-ui.js`.
- `override` modifiers added at 17 member sites in 7 `*.svelte.ts` state files (this repo compiles
  with `noImplicitOverride`; upstream doesn't).
- runed's `Context` class was dropped in favour of Svelte's native `createContext` (added in 5.40).
  Each `new Context<T>(name)` became `const [getXContext, setXContext] = createContext<T>()`; the few
  contexts that used `.getOr(fallback)` are hand-rolled with native `getContext`/`hasContext`/
  `setContext` (createContext's getter throws and hides its key, so it can't express an optional get).
- Upstream's `app.d.ts` globals live in `bits/globals.d.ts`.
- Upstream test files dropped.
- `state_referenced_locally` warnings from `lib/bits/` are filtered in `vite.config.ts` — upstream
  ships with them; svelte-check still prints them (it has no warningFilter support).

## Syncing upstream fixes

Diff the tags and port what matters:

```sh
git clone --depth 1 --branch "bits-ui@2.18.1" https://github.com/huntabyte/bits-ui /tmp/bits-old
git clone --depth 1 --branch "bits-ui@2.x.y" https://github.com/huntabyte/bits-ui /tmp/bits-new
diff -ru /tmp/bits-old/packages/bits-ui/src/lib /tmp/bits-new/packages/bits-ui/src/lib
```

New shadcn-svelte pulls were generated against current bits-ui — check their primitive usage
against this snapshot before adopting them (same caveat as the animation-class conversion).
