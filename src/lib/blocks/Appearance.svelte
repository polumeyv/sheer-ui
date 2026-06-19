<script lang="ts">
	import * as Field from '$lib/components/field';
	import * as Item from '$lib/components/item';
	import { Separator } from '$lib/components/separator';
	import { RadioGroup } from '$lib/components/radio-group';
	import { setMode, userPrefersMode } from 'mode-watcher';
	import type { Snippet } from 'svelte';

	type Mode = (typeof userPrefersMode)['current'];
	type ThemeColors = { bg: string; border: string; card: string; muted: string; fg: string; accent: string };

	let { description = 'Select a theme or sync with your system.' }: { description?: string } = $props();

	const LIGHT: ThemeColors = { bg: '#FAFAFA', border: '#E5E5E5', card: '#FFFFFF', muted: '#A3A3A3', fg: '#171717', accent: '#525252' };
	const DARK: ThemeColors = { bg: '#171717', border: '#2E2E2E', card: '#262626', muted: '#737373', fg: '#FAFAFA', accent: '#A3A3A3' };

	let selectedMode = $state(userPrefersMode.current);
</script>

{#snippet themeElements(c: ThemeColors, id: string)}
	<mask id="sidebar-{id}" fill="white"
		><path d="M0.742 6C0.742 2.686 3.428 0 6.742 0H13.742V88H6.742C3.428 88 0.742 85.314 0.742 82V6Z" /></mask>
	<path d="M0.742 6C0.742 2.686 3.428 0 6.742 0H13.742V88H6.742C3.428 88 0.742 85.314 0.742 82V6Z" fill={c.bg} />
	<path d="M14.742 0V88H12.742V0H14.742Z" fill={c.border} mask="url(#sidebar-{id})" />
	<mask id="header-{id}" fill="white"><path d="M156.242 0C159.556 0 162.242 2.686 162.242 6V13H13.742V0H156.242Z" /></mask>
	<path d="M156.242 0C159.556 0 162.242 2.686 162.242 6V13H13.742V0H156.242Z" fill={c.bg} />
	<path d="M162.242 14H13.742V12H162.242V14Z" fill={c.border} mask="url(#header-{id})" />
	<rect x="44.755" y="21.5" width="86.474" height="23.5" rx="2.5" fill={c.card} stroke={c.border} />
	<rect x="52.941" y="28" width="19.232" height="1.5" rx="0.75" fill={c.muted} />
	<rect x="78.376" y="28" width="19.232" height="1.5" rx="0.75" fill={c.fg} />
	<rect x="78.376" y="33.25" width="44.047" height="1.5" rx="0.75" fill={c.fg} />
	<rect x="44.755" y="51.5" width="86.474" height="23.5" rx="2.5" fill={c.card} stroke={c.border} />
	<rect x="52.941" y="58" width="19.232" height="1.5" rx="0.75" fill={c.muted} />
	<rect x="78.376" y="58" width="19.232" height="1.5" rx="0.75" fill={c.fg} />
	<rect x="78.376" y="63.25" width="44.047" height="1.5" rx="0.75" fill={c.fg} />
	<rect x="18.492" y="4.625" width="20.5" height="3.75" rx="1.875" fill={c.accent} />
	<rect x="44.255" y="4.625" width="20.5" height="3.75" rx="1.875" fill={c.muted} />
	<rect x="69.505" y="4.625" width="20.5" height="3.75" rx="1.875" fill={c.muted} />
	<rect x="5.367" y="4.625" width="3.75" height="3.75" rx="1" fill={c.muted} />
	<rect x="5.367" y="13.375" width="3.75" height="3.75" rx="1" fill={c.muted} />
	<rect x="5.367" y="20.875" width="3.75" height="3.75" rx="1" fill={c.muted} />
	<rect x="5.367" y="28.375" width="3.75" height="3.75" rx="1" fill={c.muted} />
	<rect x="5.367" y="35.875" width="3.75" height="3.75" rx="1" fill={c.muted} />
	<rect x="5.367" y="78.875" width="3.75" height="3.75" rx="1" fill={c.muted} />
{/snippet}

{#snippet tile(value: string, label: string, border: string, interior: Snippet)}
	<Field.Label for={value} class="cursor-pointer">
		<Field.Field class="space-y-2">
			<svg viewBox="0 0 163 88" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g clip-path="url(#clip-{value})">
					{@render interior()}
				</g>
				<rect x="1.242" y="0.5" width="160.5" height="87" rx="5.5" stroke={border} />
				<defs><clipPath id="clip-{value}"><rect x="0.742" width="161.5" height="88" rx="6" fill="white" /></clipPath></defs>
			</svg>
			<div class="flex gap-2 items-center">
				<RadioGroup.Item {value} id={value} />
				<span class="text-sm font-medium">{label}</span>
			</div>
		</Field.Field>
	</Field.Label>
{/snippet}

{#snippet lightInterior()}
	<rect x="0.742" width="161.5" height="88" rx="6" fill={LIGHT.bg} />
	{@render themeElements(LIGHT, 'light')}
{/snippet}

{#snippet darkInterior()}
	<rect x="0.742" width="161.5" height="88" rx="6" fill={DARK.bg} />
	{@render themeElements(DARK, 'dark')}
{/snippet}

{#snippet systemInterior()}
	<rect x="0.742" width="161.5" height="88" rx="6" fill={DARK.bg} />
	{@render themeElements(DARK, 'system')}
	<mask id="mask-system" maskUnits="userSpaceOnUse" x="32" y="0" width="131" height="88" style="mask-type: alpha">
		<path d="M130.534 0L32.451 88H162.131V0H130.534Z" fill="black" />
	</mask>
	<g mask="url(#mask-system)">
		<rect x="0.742" width="161.5" height="88" fill={LIGHT.bg} />
		{@render themeElements(LIGHT, 'system-overlay')}
	</g>
{/snippet}

<Item.Group>
	<Item.Root variant="outline">
		<div class="flex w-fit items-center gap-2 text-sm leading-snug font-medium">Appearance</div>
		<Separator class="my-0" />
		<Field.Field>
			<Field.Label for="theme-mode">Theme</Field.Label>
			<Field.Description>{description}</Field.Description>
			<RadioGroup.Root
				bind:value={selectedMode}
				onValueChange={(v) => setMode(v as Mode)}
				class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
				{@render tile('light', 'Light', LIGHT.border, lightInterior)}
				{@render tile('dark', 'Dark', DARK.border, darkInterior)}
				{@render tile('system', 'System', DARK.border, systemInterior)}
			</RadioGroup.Root>
		</Field.Field>
	</Item.Root>
</Item.Group>
