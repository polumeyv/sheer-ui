# @polumeyv/ui

Svelte 5 component library built on [Tailwind CSS v4](https://tailwindcss.com). The headless primitives are a vendored copy of [bits-ui](https://bits-ui.com) (see `src/lib/VENDORED.md`), so the package has no Svelte component dependencies to fight bundlers over.

## Components

Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge, Breadcrumb, Button, Button Group, Card, Carousel, Chart, Checkbox, Collapsible, Command, Context Menu, Copy Button, Data Table, Dialog, Drawer, Dropdown Menu, Empty, Field, Hover Card, Image Cropper, Input, Input Group, Input OTP, Item, Kbd, Label, Menubar, Native Select, Navigation Menu, Pagination, Popover, Progress, Radio Group, Resizable, Scroll Area, Select, Separator, Share Card, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Theme Toggle, Toggle, Toggle Group, Tooltip

## Install

```bash
bun add @polumeyv/ui
```

## CSS Import

Import the theme CSS:

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
