<script lang="ts">
	import * as Toggle from '$lib/components/toggle/index';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';

	let bold = $state(true);
	let italic = $state(false);
</script>

<div class="flex flex-wrap items-center gap-3">
	<Toggle.Root bind:pressed={bold} aria-label="Toggle bold">
		<Bold class="size-4" />
	</Toggle.Root>

	<Toggle.Root variant="outline" bind:pressed={italic} aria-label="Toggle italic">
		<Italic class="size-4" />
		Italic
	</Toggle.Root>

	<Toggle.Root size="sm" aria-label="Toggle underline">
		<Underline class="size-4" />
	</Toggle.Root>

	<Toggle.Root size="lg" disabled aria-label="Toggle disabled">
		Disabled
	</Toggle.Root>
</div>
