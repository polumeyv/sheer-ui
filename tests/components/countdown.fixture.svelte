<script lang="ts">
	import { createCountdown } from '../../src/lib/hooks/countdown.svelte.js';

	const cooldown = createCountdown();
	export const { start, stop } = cooldown;
	/** Every value the display rendered, in order. */
	export const log: number[] = [];
	$effect(() => {
		log.push(cooldown.seconds);
	});
</script>

<output>{cooldown.seconds}</output>
