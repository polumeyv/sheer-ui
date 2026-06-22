<script lang="ts">
	import * as Switch from "$lib/components/switch/index.js";
	import { Label } from "$lib/components/label/index.js";

	let checked = $state(true);
</script>

<div class="flex items-center gap-3">
	<Switch.Root id="airplane-mode" bind:checked>
		<Switch.Thumb />
	</Switch.Root>
	<Label.Root for="airplane-mode">Airplane mode</Label.Root>
</div>
