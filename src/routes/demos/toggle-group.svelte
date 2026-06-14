<script lang="ts">
	import * as ToggleGroup from '$lib/components/toggle-group/index';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';
	import AlignStart from '@lucide/svelte/icons/text-align-start';
	import AlignCenter from '@lucide/svelte/icons/text-align-center';
	import AlignEnd from '@lucide/svelte/icons/text-align-end';

	let formatting = $state<string[]>(['bold']);
	let alignment = $state('center');
</script>

<div class="flex flex-col items-center gap-6">
	<ToggleGroup.Root type="multiple" variant="outline" bind:value={formatting}>
		<ToggleGroup.Item value="bold" aria-label="Toggle bold">
			<Bold class="size-4" />
		</ToggleGroup.Item>
		<ToggleGroup.Item value="italic" aria-label="Toggle italic">
			<Italic class="size-4" />
		</ToggleGroup.Item>
		<ToggleGroup.Item value="underline" aria-label="Toggle underline">
			<Underline class="size-4" />
		</ToggleGroup.Item>
	</ToggleGroup.Root>

	<ToggleGroup.Root type="single" bind:value={alignment}>
		<ToggleGroup.Item value="start" aria-label="Align start">
			<AlignStart class="size-4" />
		</ToggleGroup.Item>
		<ToggleGroup.Item value="center" aria-label="Align center">
			<AlignCenter class="size-4" />
		</ToggleGroup.Item>
		<ToggleGroup.Item value="end" aria-label="Align end">
			<AlignEnd class="size-4" />
		</ToggleGroup.Item>
	</ToggleGroup.Root>
</div>
