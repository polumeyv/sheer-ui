# Vendored code

The headless engine under `internal/` is vendored source, not a dependency (ADR 0006). Inlined
2026-06-12 to stop bundler issues from Svelte-flavored deps; restructured since — this file was
recreated 2026-07-04 after the original was lost in the June 13 bits→components migration (the
original survives at graveyard commit `75ffc3d^:src/lib/VENDORED.md`; its tag pins and deviation
list still apply where noted).

## Layout

`internal/` is the whole engine layer. `components/*` hold only styled, exported components whose
state engines (`*.svelte.ts`) are bits-ui-derived; `blocks/` are styled composites above them.
Nothing under `internal/` appears in the package.json exports map.

## What lives where

| Path | Upstream | Version |
| --- | --- | --- |
| `internal/` engine core (`tools/utils`, `date-time/`, `floating-svelte/`, flat helpers) + the behavior primitives (`portal/`, `floating-layer/`, `popper-layer/`, `dismissible-layer/`, `presence-layer/`, `escape-layer/`, `focus-scope/`, `scroll-lock/`, `text-selection-layer/`, `input-modality/`, `prop-resolvers.ts`) + component state engines in `components/*/**.svelte.ts` | [huntabyte/bits-ui](https://github.com/huntabyte/bits-ui) tag `bits-ui@2.18.1`, `packages/bits-ui/src/lib` (the behavior primitives are upstream's `bits/utilities`, moved here 2026-07-04) | 2.18.1 |
| `internal/tools/runed/` (`box`, `use-debounce`, `repair-bindable`) | [svecosystem/runed](https://github.com/svecosystem/runed) `runed@0.35.1` subset + svelte-toolbelt `v0.10.6` derivations (`box`) | 0.35.1 / 0.10.6 |
| `internal/vendor/tabbable.ts` | [focus-trap/tabbable](https://github.com/focus-trap/tabbable) `v6.5.0` `src/index.js`, adapted (see file header) | 6.5.0 |
| `internal/vendor/vaul/` | vaul-svelte (drawer engine; sole consumer `components/drawer`) | untracked — pin on next sync |
| `internal/vendor/paneforge/` | [svecosystem/paneforge](https://github.com/svecosystem/paneforge) (resizable engine; sole consumer `components/resizable`) | untracked — pin on next sync |
| `internal/vendor/embla/` | embla-carousel core, TS/Svelte adaptation (sole consumer `components/carousel`) | untracked — pin on next sync |

All upstreams are MIT. clsx and style-to-object (in the original inline) are gone — `cn()` is a
plain join via `overrule`. Kept as regular dependencies on purpose: `@floating-ui/dom` (pure TS)
and the `@internationalized/date` peer.

## Locally-authored (not vendored)

Modules written here, marked by their `.test.ts` siblings: `internal/layer-stack.ts`,
`internal/hover-intent-geometry.ts`, `internal/arrays.ts`, `internal/animations-complete.ts`,
`internal/tools/utils/attach-ref.ts`. A future upstream diff touching these is drift on our side,
not upstream's.

## Local deviations from upstream (carried forward from the original)

- Bare imports rewritten to local relative paths (`bits-ui`, `svelte-toolbelt`, `runed`,
  `tabbable`, `esm-env` → in-tree); all specifiers are relative with explicit extensions — new
  shadcn pulls need the same rewrite.
- `override` modifiers added in state files (`noImplicitOverride` is on here, plus
  `noUncheckedIndexedAccess` fixes from the 07-03 source-consumption migration).
- runed's `Context` class replaced with Svelte's native `createContext` (5.40+).
- Upstream test files dropped.
- `state_referenced_locally` warnings (14) from vendored files are upstream's; svelte-check prints
  them.

## Syncing upstream fixes

Diff the tags and port what matters:

```sh
git clone --depth 1 --branch "bits-ui@2.18.1" https://github.com/huntabyte/bits-ui /tmp/bits-old
git clone --depth 1 --branch "bits-ui@2.x.y" https://github.com/huntabyte/bits-ui /tmp/bits-new
diff -ru /tmp/bits-old/packages/bits-ui/src/lib /tmp/bits-new/packages/bits-ui/src/lib
```

Upstream paths map here as: `bits/<x>/<x>.svelte.ts` → `components/<x>/<x>.svelte.ts`,
`bits/utilities/*` → `internal/*`, `internal/*` → `internal/*`. New shadcn-svelte pulls were
generated against current bits-ui — check their primitive usage against this snapshot before
adopting.
