<script>
	import { onMount, onDestroy } from 'svelte';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';

	import { toggleMode } from 'mode-watcher';
	import { Button } from '../button';

	let { variant = 'ghost' } = $props();

	let dark = $state(document.documentElement.classList.contains('dark'));
	let phase = $derived('idle');

	function toggleTheme() {
		phase = dark ? 'to-light' : 'to-dark';

		toggleMode();
		dark = !dark;
	}
</script>

<Button onclick={toggleTheme} {variant} size="icon" class="rounded-full!">
	<span class="stage grid group *:[grid-area:1/1]" data-dark={dark} data-phase={phase} aria-hidden="true">
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
		animation: leave 600ms ease-in both;
	}

	.stage[data-phase='to-dark'] .moon,
	.stage[data-phase='to-light'] .sun {
		animation: enter 600ms ease-out both;
	}

	@keyframes leave {
		0% {
			opacity: 1;
			transform: rotate(0deg);
		}

		50%,
		100% {
			opacity: 0;
			transform: rotate(180deg);
		}
	}

	@keyframes enter {
		0%,
		50% {
			opacity: 0;
			transform: rotate(180deg);
		}

		100% {
			opacity: 1;
			transform: rotate(360deg);
		}
	}
</style>
