<script lang="ts">
	import { createCountdown } from '../../src/lib/hooks/countdown.svelte.js';

	const cooldown = createCountdown();
	export const start = cooldown.start;
</script>

<output>{cooldown.seconds}</output>
