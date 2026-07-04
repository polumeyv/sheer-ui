<script lang="ts">
	import { Root as Toggle } from '../components/toggle/index.js';
	import Bold from '@lucide/svelte/icons/bold';

	let pressed = $state(false);
</script>

<Toggle bind:pressed aria-label="Toggle bold">
	<Bold />
</Toggle>
