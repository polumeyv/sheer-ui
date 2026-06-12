<script lang="ts">
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import type { ButtonVariant } from '../button';

	import { toggleMode } from 'mode-watcher';
	import { Button } from '../button';

	let { variant = "ghost"} : {variant: ButtonVariant} = $props();
</script>

<Button onclick={toggleMode} {variant} size="icon" class="rounded-full!">
	<SunIcon class="size-5 scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90" />
	<MoonIcon class="absolute size-5 scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0" />
	<span class="sr-only">Toggle theme</span>
</Button>
