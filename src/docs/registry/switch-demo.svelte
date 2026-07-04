<script lang="ts">
	import { Switch } from '../../lib/components/switch/index.js';
	import { Label } from '../../lib/components/label/index.js';

	let checked = $state(true);
</script>

<div class="flex items-center gap-3">
	<Switch id="airplane-mode" bind:checked />
	<Label.Root for="airplane-mode">Airplane mode</Label.Root>
</div>
