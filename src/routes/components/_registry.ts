/**
 * The single source of truth for the demo app: every component and block the library
 * exposes, in alphabetical order. The sidebar nav and the `[slug]` route both
 * read from here. Each entry's `slug` prefixes its demo files in `src/docs/registry/`
 * (e.g. `button-demo.svelte`, `button-with-icon.svelte`).
 */
export type DemoMeta = {
	/** URL segment + `src/docs/registry/<slug>-*.svelte` demo prefix + `#lib/{components,blocks}/<slug>` import path (by `kind`) */
	slug: string;
	/** Display name */
	name: string;
	/** One-line summary shown under the heading and on the landing cards */
	description: string;
	/** Blocks are full compositions and preview top-aligned; components are headless and preview centred */
	kind: 'component' | 'block';
};

export const entries: DemoMeta[] = [
	{
		slug: 'accordion',
		name: 'Accordion',
		description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
		kind: 'component',
	},
	{ slug: 'alert', name: 'Alert', description: 'Displays a callout for user attention.', kind: 'component' },
	{
		slug: 'alert-modal',
		name: 'Alert Modal',
		description: 'A store-driven confirm / acknowledge modal built on the native <dialog> element.',
		kind: 'block',
	},
	{ slug: 'avatar', name: 'Avatar', description: 'An image element with a fallback for representing the user.', kind: 'component' },
	{ slug: 'badge', name: 'Badge', description: 'Displays a badge or a component that looks like a badge.', kind: 'component' },
	{ slug: 'breadcrumb', name: 'Breadcrumb', description: 'Displays the path to the current resource using a hierarchy of links.', kind: 'component' },
	{ slug: 'button', name: 'Button', description: 'Displays a button or a component that looks like a button.', kind: 'component' },
	{ slug: 'calendar', name: 'Calendar', description: 'A calendar component that allows users to select a date.', kind: 'component' },
	{ slug: 'card', name: 'Card', description: 'Displays a card with header, content, and footer.', kind: 'component' },
	{
		slug: 'carousel',
		name: 'Carousel',
		description: 'A carousel on native scroll snap: the browser owns physics and snapping, selection is read from scrollend.',
		kind: 'component',
	},
	{ slug: 'chart', name: 'Chart', description: 'Visualize data with composable charts built on LayerChart.', kind: 'component' },
	{ slug: 'checkbox', name: 'Checkbox', description: 'A control that allows the user to toggle between checked and not checked.', kind: 'component' },
	{
		slug: 'checkbox-native',
		name: 'Checkbox (Native)',
		description: 'A native form checkbox that submits name/value and supports indeterminate.',
		kind: 'component',
	},
	{ slug: 'collapsible', name: 'Collapsible', description: 'An interactive component which expands and collapses a panel.', kind: 'component' },
	{ slug: 'combobox', name: 'Combobox', description: 'Autocomplete input with a filterable list of suggestions.', kind: 'component' },
	{ slug: 'command', name: 'Command', description: 'A fast, composable command menu.', kind: 'component' },
	{ slug: 'context-menu', name: 'Context Menu', description: 'Displays a menu of actions triggered by a right click.', kind: 'component' },
	{ slug: 'data-table', name: 'Data Table', description: 'Powerful tables and datagrids built using TanStack Table.', kind: 'component' },
	{ slug: 'date-field', name: 'Date Field', description: 'A segmented field that lets users enter and edit a date.', kind: 'component' },
	{ slug: 'date-picker', name: 'Date Picker', description: 'A date field paired with a calendar popover.', kind: 'block' },
	{ slug: 'date-range-field', name: 'Date Range Field', description: 'A segmented field that lets users enter and edit a range of dates.', kind: 'component' },
	{ slug: 'dialog', name: 'Dialog', description: 'A window overlaid on the primary content, rendering the content underneath inert.', kind: 'component' },
	{ slug: 'drawer', name: 'Drawer', description: 'A panel that slides in from the edge of the screen.', kind: 'component' },
	{ slug: 'dropdown-menu', name: 'Dropdown Menu', description: 'Displays a menu of actions triggered by a button.', kind: 'component' },
	{ slug: 'empty', name: 'Empty', description: 'Display an empty state with a heading, description, and actions.', kind: 'component' },
	{ slug: 'field', name: 'Field', description: 'Compose accessible form fields from labels, controls, and help text.', kind: 'component' },
	{ slug: 'heading', name: 'Heading', description: 'A page heading: title row plus an optional tab nav.', kind: 'block' },
	{ slug: 'input', name: 'Input', description: 'Displays a form input field or a component that looks like an input field.', kind: 'component' },
	{ slug: 'item', name: 'Item', description: 'A flexible, composable row for displaying content with media and actions.', kind: 'component' },
	{ slug: 'kbd', name: 'Kbd', description: 'Display textual user input from a keyboard.', kind: 'component' },
	{ slug: 'label', name: 'Label', description: 'Renders an accessible label associated with a control.', kind: 'component' },
	{ slug: 'link-preview', name: 'Link Preview', description: 'Previews content behind a link when hovering over it.', kind: 'component' },
	{ slug: 'menubar', name: 'Menubar', description: 'A persistent menu bar providing quick access to a consistent set of commands.', kind: 'component' },
	{ slug: 'meter', name: 'Meter', description: 'Displays a value within a known range.', kind: 'component' },
	{ slug: 'navigation-menu', name: 'Navigation Menu', description: 'A collection of links for navigating a site.', kind: 'component' },
	{ slug: 'pagination', name: 'Pagination', description: 'Page navigation with next and previous links.', kind: 'component' },
	{ slug: 'pin-input', name: 'Pin Input', description: 'An accessible one-time-password / pin entry input.', kind: 'component' },
	{ slug: 'popover', name: 'Popover', description: 'Displays rich content in a portal, triggered by a button.', kind: 'component' },
	{ slug: 'progress', name: 'Progress', description: 'Displays an indicator showing the completion progress of a task.', kind: 'component' },
	{ slug: 'radio-group', name: 'Radio Group', description: 'A set of native radio inputs where only one can be selected at a time.', kind: 'component' },
	{ slug: 'range-calendar', name: 'Range Calendar', description: 'A calendar component that allows users to select a range of dates.', kind: 'component' },
	{ slug: 'resizable', name: 'Resizable', description: 'Accessible resizable panel groups and layouts.', kind: 'component' },
	{ slug: 'scroll-area', name: 'Scroll Area', description: 'Augments native scroll with custom, cross-browser styling.', kind: 'component' },
	{ slug: 'select', name: 'Select', description: 'A native select element (appearance: base-select) for choosing from a list of options.', kind: 'component' },
	{ slug: 'separator', name: 'Separator', description: 'Visually or semantically separates content.', kind: 'component' },
	{ slug: 'sheet', name: 'Sheet', description: 'A dialog that slides in to complement the main content of the screen.', kind: 'component' },
	{ slug: 'sidebar', name: 'Sidebar', description: 'A composable, themeable and customizable sidebar component.', kind: 'component' },
	{ slug: 'skeleton', name: 'Skeleton', description: 'Show a placeholder while content is loading.', kind: 'component' },
	{ slug: 'slider', name: 'Slider', description: 'An input where the user selects a value from within a given range.', kind: 'component' },
	{ slug: 'sonner', name: 'Sonner', description: 'An opinionated toast component.', kind: 'component' },
	{ slug: 'switch', name: 'Switch', description: 'A native checkbox-based switch control.', kind: 'component' },
	{ slug: 'table', name: 'Table', description: 'A responsive table component.', kind: 'component' },
	{ slug: 'tabs', name: 'Tabs', description: 'Layered sections of content displayed one panel at a time.', kind: 'component' },
	{ slug: 'textarea', name: 'Textarea', description: 'Displays a form textarea or a component that looks like a textarea.', kind: 'component' },
	{ slug: 'theme-toggle', name: 'Theme Toggle', description: 'A button that toggles between light and dark mode.', kind: 'component' },
	{ slug: 'time-field', name: 'Time Field', description: 'A segmented field that lets users enter and edit a time.', kind: 'component' },
	{ slug: 'time-range-field', name: 'Time Range Field', description: 'A segmented field that lets users enter and edit a range of times.', kind: 'component' },
	{ slug: 'toggle', name: 'Toggle', description: 'A two-state button that can be either on or off.', kind: 'component' },
	{ slug: 'toggle-group', name: 'Toggle Group', description: 'A set of two-state buttons that can be toggled on or off.', kind: 'component' },
	{ slug: 'toolbar', name: 'Toolbar', description: 'A container for grouping a set of controls such as buttons and toggles.', kind: 'component' },
	{ slug: 'tooltip', name: 'Tooltip', description: 'A popup that displays information related to an element on hover or focus.', kind: 'component' },
];

export const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));

/** Render order for the two kinds — the sidebar and the landing page both iterate this. */
export const groups: { kind: DemoMeta['kind']; label: string; blurb?: string }[] = [
	{ kind: 'block', label: 'Blocks', blurb: 'Full, app-ready compositions — not the headless components.' },
	{ kind: 'component', label: 'Components' },
];
