<script lang="ts">
	import { SwitchNative } from '$lib/components/switch-native/index.js';
	import { Label } from '$lib/components/label/index.js';

	let checked = $state(true);
</script>

<div class="flex items-center gap-3">
	<SwitchNative id="airplane-mode" bind:checked />
	<Label.Root for="airplane-mode">Airplane mode</Label.Root>
</div>
