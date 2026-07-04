<script lang="ts" module>
	export const title = 'States and Sizes';
</script>

<script lang="ts">
	import { Switch } from '../../lib/components/switch/index.js';
	import { Label } from '../../lib/components/label/index.js';

	let small = $state(true);
	let regular = $state(true);
	let large = $state(true);
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-wrap items-center gap-6">
		<div class="flex items-center gap-2">
			<Switch id="swn-s-disabled" disabled />
			<Label.Root for="swn-s-disabled" class="opacity-50">Disabled</Label.Root>
		</div>
		<div class="flex items-center gap-2">
			<Switch id="swn-s-disabled-on" disabled checked />
			<Label.Root for="swn-s-disabled-on" class="opacity-50">Disabled, on</Label.Root>
		</div>
	</div>
	<!-- One CSS variable rescales the whole control: track, thumb, and travel. -->
	<div class="flex flex-wrap items-center gap-6">
		<div class="flex items-center gap-2">
			<Switch id="swn-s-sm" bind:checked={small} style="--switch-size: 0.875rem" />
			<Label.Root for="swn-s-sm">Small</Label.Root>
		</div>
		<div class="flex items-center gap-2">
			<Switch id="swn-s-md" bind:checked={regular} />
			<Label.Root for="swn-s-md">Default</Label.Root>
		</div>
		<div class="flex items-center gap-2">
			<Switch id="swn-s-lg" bind:checked={large} style="--switch-size: 1.5rem" />
			<Label.Root for="swn-s-lg">Large</Label.Root>
		</div>
	</div>
</div>
