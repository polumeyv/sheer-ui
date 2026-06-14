<script lang="ts">
	import * as RadioGroup from '$lib/components/radio-group/index';
	import { Label } from '$lib/components/label/index';

	let value = $state('comfortable');
</script>

<RadioGroup.Root bind:value class="w-full max-w-sm gap-3">
	<div class="flex items-center gap-3">
		<RadioGroup.Item value="default" id="r-default" />
		<Label for="r-default">Default</Label>
	</div>
	<div class="flex items-center gap-3">
		<RadioGroup.Item value="comfortable" id="r-comfortable" />
		<Label for="r-comfortable">Comfortable</Label>
	</div>
	<div class="flex items-center gap-3">
		<RadioGroup.Item value="compact" id="r-compact" />
		<Label for="r-compact">Compact</Label>
	</div>
</RadioGroup.Root>
