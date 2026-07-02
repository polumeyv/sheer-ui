<script lang="ts" module>
	export const title = 'States';
</script>

<script lang="ts">
	import * as RadioGroup from '$lib/components/radio-group-native/index.js';
	import { Label } from '$lib/components/label/index.js';

	let readonlyValue = $state('locked');
	let mixedValue = $state('first');
</script>

<div class="grid gap-8 sm:grid-cols-2">
	<div class="flex flex-col gap-3">
		<p class="text-sm font-medium">Readonly</p>
		<RadioGroup.Root bind:value={readonlyValue} readonly>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="locked" id="rg-s-locked" />
				<Label.Root for="rg-s-locked">Locked in</Label.Root>
			</div>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="other" id="rg-s-other" />
				<Label.Root for="rg-s-other">Can't switch here</Label.Root>
			</div>
		</RadioGroup.Root>
	</div>

	<div class="flex flex-col gap-3">
		<p class="text-sm font-medium">Disabled item</p>
		<RadioGroup.Root bind:value={mixedValue}>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="first" id="rg-s-first" />
				<Label.Root for="rg-s-first">Available</Label.Root>
			</div>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="second" id="rg-s-second" disabled />
				<Label.Root for="rg-s-second" class="opacity-50">Sold out</Label.Root>
			</div>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="third" id="rg-s-third" />
				<Label.Root for="rg-s-third">Also available</Label.Root>
			</div>
		</RadioGroup.Root>
	</div>

	<div class="flex flex-col gap-3">
		<p class="text-sm font-medium">Disabled group</p>
		<RadioGroup.Root value="one" disabled>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="one" id="rg-s-one" />
				<Label.Root for="rg-s-one" class="opacity-50">Selected</Label.Root>
			</div>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="two" id="rg-s-two" />
				<Label.Root for="rg-s-two" class="opacity-50">Unselected</Label.Root>
			</div>
		</RadioGroup.Root>
	</div>

	<div class="flex flex-col gap-3">
		<p class="text-sm font-medium">Invalid</p>
		<RadioGroup.Root>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="yes" id="rg-s-yes" aria-invalid="true" />
				<Label.Root for="rg-s-yes">Yes</Label.Root>
			</div>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="no" id="rg-s-no" aria-invalid="true" />
				<Label.Root for="rg-s-no">No</Label.Root>
			</div>
		</RadioGroup.Root>
	</div>
</div>
