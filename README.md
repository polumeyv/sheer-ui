# @polumeyv/ui

Svelte 5 component library built on [Tailwind CSS v4](https://tailwindcss.com). The headless primitives are a vendored copy of [bits-ui](https://bits-ui.com) (see `src/lib/VENDORED.md`), so the package has no Svelte component dependencies to fight bundlers over.

## Components

Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge, Breadcrumb, Button, Button Group, Card, Carousel, Chart, Checkbox, Collapsible, Command, Context Menu, Copy Button, Data Table, Dialog, Drawer, Dropdown Menu, Empty, Field, Hover Card, Image Cropper, Input, Input Group, Input OTP, Item, Kbd, Label, Menubar, Native Select, Navigation Menu, Pagination, Popover, Progress, Radio Group, Resizable, Scroll Area, Select, Separator, Share Card, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Theme Toggle, Toggle, Toggle Group, Tooltip

## Install

```bash
bun add @polumeyv/ui
```

## Setup

### Single SvelteKit App

Run the init command from your SvelteKit project root:

```bash
npx @polumeyv/ui
```

This will:
- Copy font files (Geist, Inter) to `static/fonts/`
- Copy `layout.css` to `src/routes/layout.css`

Then import it from your root `+layout.svelte`:

```svelte
<script>
  import './layout.css';
</script>
```

### Workspace Mode (`-w`)

For monorepos with multiple SvelteKit apps, workspace mode creates a shared theme package instead of duplicating fonts and CSS in every app.

```bash
npx @polumeyv/ui -w
```

Run this from anywhere inside a workspace (bun/npm/pnpm). The CLI will walk up the directory tree to find your workspace root (the nearest `package.json` with a `workspaces` field).

#### What it does

1. Creates a theme package at `packages/theme/` containing:
   ```
   packages/theme/
     package.json      # private workspace package
     styles.css        # layout.css with relative font paths
     fonts/
       Geist/
         geist.woff2
         geist-mono.woff2
         LICENSE.TXT
       Inter/
         inter.woff2
         LICENSE.txt
   ```
2. Detects your npm scope (from root `package.json` name or existing packages) and names the theme package accordingly (e.g. `@myorg/theme`)
3. Scans all workspace packages for SvelteKit apps (directories with `src/routes/` and `svelte.config.*`)
4. Adds `"@myorg/theme": "workspace:*"` to each app's `dependencies`

#### After running

```bash
# 1. Install the new workspace dependency
bun install

# 2. Import the theme in each app's root +layout.svelte
```

```svelte
<script>
  import '@myorg/theme/styles';
</script>
```

#### Options

| Flag | Description |
|---|---|
| `-w`, `--workspace` | Enable workspace mode |
| `--packages-dir <dir>` | Override the packages directory (default: extracted from `workspaces` globs, usually `packages`) |
| `--theme-name <name>` | Override the theme package directory name (default: `theme`) |
| `--force` | Overwrite an existing theme package |

#### Examples

```bash
# Default — creates packages/theme/
npx @polumeyv/ui -w

# Custom packages directory
npx @polumeyv/ui -w --packages-dir libs

# Custom theme name — creates packages/design-system/
npx @polumeyv/ui -w --theme-name design-system

# Overwrite existing theme package
npx @polumeyv/ui -w --force
```

#### How font loading works

The generated `styles.css` uses relative font paths (`url('./fonts/...')` instead of `/fonts/...`). When a SvelteKit app imports `@myorg/theme/styles`, Vite resolves these paths relative to the CSS file inside `packages/theme/`, bundles the fonts with hashed filenames, and serves them automatically. No Vite config changes, static directory setup, or symlinks needed.

## CSS Import

You can also import the theme CSS directly without the init command:

```svelte
<script>
  import '@polumeyv/ui/styles';
</script>
```

This requires your app to provide the font files separately, since the CSS references `/fonts/...` paths.

## Usage

```svelte
<script>
  import { Button } from '@polumeyv/ui';
</script>

<Button variant="outline">Click me</Button>
```

## Development

```bash
bun install
bun run check
```
