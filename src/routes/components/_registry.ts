/**
 * The single source of truth for the demo app: every component the library
 * exposes, in alphabetical order. The sidebar nav and the `[slug]` route both
 * read from here. Each entry's `slug` prefixes its demo files in `$lib/registry/`
 * (e.g. `button-demo.svelte`, `button-with-icon.svelte`).
 */
export type ComponentMeta = {
	/** URL segment + `$lib/registry/<slug>-*.svelte` demo prefix + `$lib/components/<slug>` import path */
	slug: string;
	/** Display name */
	name: string;
	/** One-line summary shown under the heading and on the landing cards */
	description: string;
};

export const components: ComponentMeta[] = [
	{
		slug: 'accordion',
		name: 'Accordion',
		description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
	},
	{ slug: 'alert', name: 'Alert', description: 'Displays a callout for user attention.' },
	{ slug: 'avatar', name: 'Avatar', description: 'An image element with a fallback for representing the user.' },
	{ slug: 'badge', name: 'Badge', description: 'Displays a badge or a component that looks like a badge.' },
	{ slug: 'breadcrumb', name: 'Breadcrumb', description: 'Displays the path to the current resource using a hierarchy of links.' },
	{ slug: 'button', name: 'Button', description: 'Displays a button or a component that looks like a button.' },
	{ slug: 'calendar', name: 'Calendar', description: 'A calendar component that allows users to select a date.' },
	{ slug: 'card', name: 'Card', description: 'Displays a card with header, content, and footer.' },
	{ slug: 'carousel', name: 'Carousel', description: 'A carousel with motion and swipe built using Embla.' },
	{ slug: 'carousel-native', name: 'Carousel (Native)', description: 'A carousel on native scroll snap: the browser owns physics and snapping, selection is read from scrollend.' },
	{ slug: 'chart', name: 'Chart', description: 'Visualize data with composable charts built on LayerChart.' },
	{ slug: 'checkbox', name: 'Checkbox', description: 'A control that allows the user to toggle between checked and not checked.' },
	{
		slug: 'checkbox-native',
		name: 'Checkbox (Native)',
		description: 'A native form checkbox that submits name/value and supports indeterminate.',
	},
	{ slug: 'collapsible', name: 'Collapsible', description: 'An interactive component which expands and collapses a panel.' },
	{ slug: 'combobox', name: 'Combobox', description: 'Autocomplete input with a filterable list of suggestions.' },
	{ slug: 'command', name: 'Command', description: 'A fast, composable command menu.' },
	{ slug: 'context-menu', name: 'Context Menu', description: 'Displays a menu of actions triggered by a right click.' },
	{ slug: 'data-table', name: 'Data Table', description: 'Powerful tables and datagrids built using TanStack Table.' },
	{ slug: 'date-field', name: 'Date Field', description: 'A segmented field that lets users enter and edit a date.' },
	{ slug: 'date-picker', name: 'Date Picker', description: 'A date field paired with a calendar popover.' },
	{ slug: 'date-range-field', name: 'Date Range Field', description: 'A segmented field that lets users enter and edit a range of dates.' },
	{ slug: 'dialog', name: 'Dialog', description: 'A window overlaid on the primary content, rendering the content underneath inert.' },
	{ slug: 'drawer', name: 'Drawer', description: 'A panel that slides in from the edge of the screen.' },
	{ slug: 'dropdown-menu', name: 'Dropdown Menu', description: 'Displays a menu of actions triggered by a button.' },
	{ slug: 'empty', name: 'Empty', description: 'Display an empty state with a heading, description, and actions.' },
	{ slug: 'field', name: 'Field', description: 'Compose accessible form fields from labels, controls, and help text.' },
	{ slug: 'heading', name: 'Heading', description: 'A heading component for page and section titles.' },
	{ slug: 'input', name: 'Input', description: 'Displays a form input field or a component that looks like an input field.' },
	{ slug: 'item', name: 'Item', description: 'A flexible, composable row for displaying content with media and actions.' },
	{ slug: 'kbd', name: 'Kbd', description: 'Display textual user input from a keyboard.' },
	{ slug: 'label', name: 'Label', description: 'Renders an accessible label associated with a control.' },
	{ slug: 'link-preview', name: 'Link Preview', description: 'Previews content behind a link when hovering over it.' },
	{ slug: 'menubar', name: 'Menubar', description: 'A persistent menu bar providing quick access to a consistent set of commands.' },
	{ slug: 'meter', name: 'Meter', description: 'Displays a value within a known range.' },
	{ slug: 'native-dialog', name: 'Native Dialog (spike)', description: 'A modal dialog built on the native <dialog> element + showModal, as a CSS/HTML spike that drops the JS overlay stack.' },
	{ slug: 'navigation-menu', name: 'Navigation Menu', description: 'A collection of links for navigating a site.' },
	{ slug: 'pagination', name: 'Pagination', description: 'Page navigation with next and previous links.' },
	{ slug: 'pin-input', name: 'Pin Input', description: 'An accessible one-time-password / pin entry input.' },
	{ slug: 'popover', name: 'Popover', description: 'Displays rich content in a portal, triggered by a button.' },
	{ slug: 'progress', name: 'Progress', description: 'Displays an indicator showing the completion progress of a task.' },
	{ slug: 'radio-group', name: 'Radio Group', description: 'A set of native radio inputs where only one can be selected at a time.' },
	{ slug: 'range-calendar', name: 'Range Calendar', description: 'A calendar component that allows users to select a range of dates.' },
	{ slug: 'resizable', name: 'Resizable', description: 'Accessible resizable panel groups and layouts.' },
	{ slug: 'scroll-area', name: 'Scroll Area', description: 'Augments native scroll with custom, cross-browser styling.' },
	{ slug: 'select', name: 'Select', description: 'A native select element (appearance: base-select) for choosing from a list of options.' },
	{ slug: 'separator', name: 'Separator', description: 'Visually or semantically separates content.' },
	{ slug: 'sheet', name: 'Sheet', description: 'A dialog that slides in to complement the main content of the screen.' },
	{ slug: 'sidebar', name: 'Sidebar', description: 'A composable, themeable and customizable sidebar component.' },
	{ slug: 'skeleton', name: 'Skeleton', description: 'Show a placeholder while content is loading.' },
	{ slug: 'slider', name: 'Slider', description: 'An input where the user selects a value from within a given range.' },
	{ slug: 'sonner', name: 'Sonner', description: 'An opinionated toast component.' },
	{ slug: 'switch-native', name: 'Switch (Native)', description: 'A native checkbox-based switch control.' },
	{ slug: 'table', name: 'Table', description: 'A responsive table component.' },
	{ slug: 'tabs', name: 'Tabs', description: 'Layered sections of content displayed one panel at a time.' },
	{ slug: 'textarea', name: 'Textarea', description: 'Displays a form textarea or a component that looks like a textarea.' },
	{ slug: 'theme-toggle', name: 'Theme Toggle', description: 'A button that toggles between light and dark mode.' },
	{ slug: 'time-field', name: 'Time Field', description: 'A segmented field that lets users enter and edit a time.' },
	{ slug: 'time-range-field', name: 'Time Range Field', description: 'A segmented field that lets users enter and edit a range of times.' },
	{ slug: 'toggle', name: 'Toggle', description: 'A two-state button that can be either on or off.' },
	{ slug: 'toggle-group', name: 'Toggle Group', description: 'A set of two-state buttons that can be toggled on or off.' },
	{ slug: 'toolbar', name: 'Toolbar', description: 'A container for grouping a set of controls such as buttons and toggles.' },
	{ slug: 'tooltip', name: 'Tooltip', description: 'A popup that displays information related to an element on hover or focus.' },
];

export const componentBySlug = new Map(components.map((c) => [c.slug, c]));
