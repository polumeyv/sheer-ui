<script lang="ts">
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';

	import { getTheme } from './theme.svelte.js';
	import { Button, type ButtonVariant } from '../button';

	let { variant = 'ghost' }: { variant?: ButtonVariant } = $props();

	const theme = getTheme();
	// `theme.current` is SSR-safe (undefined on the server) and stays reactive, so `theme.toggle()`
	// alone flips `dark` — no manual bookkeeping, and no `document` read at init that would crash during SSR.
	let phase = $state<'idle' | 'to-dark' | 'to-light'>('idle');
	const dark = $derived(theme.current === 'dark');

	function toggleTheme() {
		phase = dark ? 'to-light' : 'to-dark';
		theme.toggle();
	}
</script>

<Button onclick={toggleTheme} {variant} size="icon" class="rounded-full!">
	<span class="stage grid *:[grid-area:1/1]" data-dark={dark} data-phase={phase} aria-hidden="true">
		<span class="sun"><SunIcon class="size-5" /></span>
		<span class="moon"><MoonIcon class="size-5" /></span>
	</span>

	<span class="sr-only">Toggle theme</span>
</Button>

<style>
	/* Keyed on the stage's own attribute rather than a Tailwind `group-*` variant: `data-dark`
	   is rendered as "true"/"false" (presence-only `[data-dark]` can't tell them apart), and a
	   bare `.group` ancestor such as the sidebar root would capture the variant. */
	.stage[data-dark='true'] .sun,
	.stage[data-dark='false'] .moon {
		opacity: 0;
	}

	.stage[data-phase='to-dark'] .sun,
	.stage[data-phase='to-light'] .moon {
		animation: theme-spin-out 600ms ease-in both;
	}

	.stage[data-phase='to-dark'] .moon,
	.stage[data-phase='to-light'] .sun {
		animation: theme-spin-in 600ms ease-out both;
	}
</style>
