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
| `internal/` engine core (`tools/utils`, `date-time/`, `floating-svelte/`, flat helpers) + the behavior primitives (`portal/`, `floating-layer/`, `popper-layer/`, `dismissible-layer/`, `presence-layer/`, `escape-layer/`, `focus-scope/`, `scroll-lock/`, `text-selection-layer/`, `prop-resolvers.ts`) + component state engines in `components/*/**.svelte.ts` | [huntabyte/bits-ui](https://github.com/huntabyte/bits-ui) tag `bits-ui@2.18.1`, `packages/bits-ui/src/lib` (the behavior primitives are upstream's `bits/utilities`, moved here 2026-07-04) | 2.18.1 |
| `internal/tools/` (`box`, `use-debounce`) | [svecosystem/runed](https://github.com/svecosystem/runed) `runed@0.35.1` subset + svelte-toolbelt `v0.10.6` derivations (`box`) | 0.35.1 / 0.10.6 |
| `internal/tabbable.ts` | [focus-trap/tabbable](https://github.com/focus-trap/tabbable) `v6.5.0` `src/index.js`, adapted (see file header) | 6.5.0 |
| `internal/vaul/` | vaul-svelte (drawer engine; sole consumer `components/drawer`) | untracked — pin on next sync |
| `internal/paneforge/` | [svecosystem/paneforge](https://github.com/svecosystem/paneforge) (resizable engine; sole consumer `components/resizable`) | untracked — pin on next sync |
| `internal/table/` (rune-native engine; `sorting-fns.ts`, `filter-fns.ts` and the toggle/paging semantics are ported, the `$derived` pipeline in `table.svelte.ts` is locally authored) | [TanStack/table](https://github.com/TanStack/table) `@tanstack/table-core@8.21.3` subset — replaced the npm dependency 2026-07-26; deliberate deviation: sort inference samples the FIRST ten rows (upstream's `slice(10)` drops them) | 8.21.3 |

The embla-carousel engine and the embla-backed `components/carousel` were deleted 2026-07-26 with
Nic's per-component confirmation: the scroll-snap implementation (formerly `carousel-native`,
locally authored) is now `components/carousel`. Capability loss accepted:
embla `opts`/`plugins`/`setApi` and desktop mouse-drag momentum.

All upstreams are MIT. clsx and style-to-object (in the original inline) are gone — `cn()` is a
plain join via `overrule`. Kept as regular dependencies on purpose: `@floating-ui/dom` (pure TS)
and the `@internationalized/date` peer.

## No workspace edges (2026-07-08)

This package installs and typechecks standalone. That is a hard constraint, not an accident: it is
mirrored to [polumeyv/ui-lib](https://github.com/polumeyv/ui-lib), and a specifier that only resolves
inside the mono makes that clone uninstallable. **Nothing here may use `workspace:*` or a bun
`catalog:`.** Verify with a cold install outside the monorepo before changing dependencies.

`@polumeyv/utilities` is still imported everywhere it always was — it is simply depended on by semver
range rather than `workspace:*`. Bun links the workspace copy when the local version satisfies the
range, and falls back to the npm registry outside the workspace, so one manifest serves both. The
imports reach only utilities' dependency-free subpaths (`.`, `/dom`, `/env`, `/date/formatters`), so a
standalone install pulls nothing transitive — in particular not `effect`, which sits behind an
optional peer on `/date` and `/schema-primitives`.

Three edges only a cold install reveals, each of which had been quietly borrowing from the mono root:

- `typescript` and `@types/bun` are declared here now; they used to hoist from the root manifest.
- `vite.config.ts` extends the monorepo base tsconfig **only when that file exists**. The two options
  it supplied that the check truly needs — `allowJs` (for `theme-toggle.svelte`, the one non-TS
  component) and `noFallthroughCasesInSwitch` — live in `./tsconfig.json`.
- `bunfig.toml` is gone. It pointed the `@polumeyv` scope at GitHub Packages behind a `$GITHUB_TOKEN`;
  now that `@polumeyv/utilities` comes from npm, that config would break a standalone clone.

`effect` was a peer + dev dependency with zero imports anywhere in the package; dropped.

## Locally-authored (not vendored)

Modules written here, marked by their `.test.ts` siblings: `internal/layer-stack.ts`,
`internal/hover-intent-geometry.ts`, `internal/arrays.ts`, `internal/animations-complete.ts`,
`internal/tools/utils/attach-ref.ts`. The shared `internal/native-dialog-controller.svelte.ts` and
`internal/date-time/field/range-field.svelte.ts` are also local consolidation Modules, covered through
their dialog and range-field integration suites. A future upstream diff touching these is drift on
our side, not upstream's.

## Local deviations from upstream (carried forward from the original)

- Bare imports rewritten to local relative paths (`bits-ui`, `svelte-toolbelt`, `runed`,
  `tabbable` → in-tree; `esm-env` stays as-is); other specifiers are relative with explicit
  extensions — new shadcn pulls need the same rewrite.
- `override` modifiers added in state files (`noImplicitOverride` is on here, plus
  `noUncheckedIndexedAccess` fixes from the 07-03 source-consumption migration).
- runed's `Context` class replaced with Svelte's native `createContext` (5.40+).
- Upstream test files dropped.
- Package-entry `exports.ts` barrels are folded into their sibling `index.ts` when that `index.ts`
  was their sole consumer. Namespace-producing barrels (`export * as`) remain because they preserve
  type members as well as runtime values; non-entry source inventory is retained independently of
  current in-repository usage.
- Menu and Select input modality is a boolean field on each root state. Menu roots own capture-phase
  document listeners through `<svelte:document>` instead of routing browser-only lifecycle through
  `SharedState`.
- `dismissible-layer/` drifts twice: its timers run through an injected `Timers` seam
  (`scheduler.ts`, defaulting to the real globals) so the 1ms/10ms/20ms windows are testable, and
  `isValidEvent` collapses upstream's three context-menu branches into `return e.button === 0`
  (same truth table, verified over every trigger/content/button combination). Its handler and
  predicate opts (`onInteractOutside`, `onFocusOutside`, `isValidEvent`) are optional here rather
  than upstream's `Required<>` boxes, so callers omit them instead of passing no-ops.
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
