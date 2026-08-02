<script>
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';

	import { getTheme } from './theme.svelte.js';
	import { Button } from '../button';

	/** @type {{ variant?: import('../button').ButtonVariant }} */
	let { variant = 'ghost' } = $props();

	const theme = getTheme();
	// `theme.current` is SSR-safe (undefined on the server) and stays reactive, so `theme.toggle()`
	// alone flips `dark` — no manual bookkeeping, and no `document` read at init that would crash during SSR.
	let phase = $state('idle');
	const dark = $derived(theme.current === 'dark');

	function toggleTheme() {
		phase = dark ? 'to-light' : 'to-dark';
		theme.toggle();
	}
</script>

<Button onclick={toggleTheme} {variant} size="icon" class="rounded-full!">
	<span class="stage group grid *:[grid-area:1/1]" data-dark={dark} data-phase={phase} aria-hidden="true">
		<span class="icon sun group-data-dark:opacity-0">
			<SunIcon class="size-5" />
		</span>
		<span class="icon moon group-not-data-dark:opacity-0">
			<MoonIcon class="size-5" />
		</span>
	</span>

	<span class="sr-only">Toggle theme</span>
</Button>

<style>
	.stage[data-phase='to-dark'] .sun,
	.stage[data-phase='to-light'] .moon {
		animation: theme-spin-out 600ms ease-in both;
	}

	.stage[data-phase='to-dark'] .moon,
	.stage[data-phase='to-light'] .sun {
		animation: theme-spin-in 600ms ease-out both;
	}
</style>
