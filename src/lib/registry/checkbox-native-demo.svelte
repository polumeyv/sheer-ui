<script lang="ts">
	import { CheckboxNative } from '$lib/components/checkbox-native/index.js';
	import { Label } from '$lib/components/label/index.js';

	let checked = $state(true);
</script>

<div class="flex items-center gap-2">
	<CheckboxNative id="cbn-terms" bind:checked />
	<Label.Root for="cbn-terms">Accept terms and conditions</Label.Root>
</div>
