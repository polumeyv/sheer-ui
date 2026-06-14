<script lang="ts">
	import * as Collapsible from '$lib/components/collapsible/index';
	import { Button } from '$lib/components/button/index';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';

	let open = $state(false);
</script>

<Collapsible.Root bind:open class="flex w-full max-w-sm flex-col gap-2">
	<div class="flex items-center justify-between gap-4 px-1">
		<h4 class="text-sm font-semibold">@huntabyte starred 3 repositories</h4>
		<Collapsible.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="icon" class="size-8">
					<ChevronsUpDown />
					<span class="sr-only">Toggle</span>
				</Button>
			{/snippet}
		</Collapsible.Trigger>
	</div>
	<div class="rounded-md border px-4 py-2 font-mono text-sm">@sveltejs/svelte</div>
	<Collapsible.Content class="flex flex-col gap-2">
		<div class="rounded-md border px-4 py-2 font-mono text-sm">@sveltejs/kit</div>
		<div class="rounded-md border px-4 py-2 font-mono text-sm">@bits-ui/bits-ui</div>
	</Collapsible.Content>
</Collapsible.Root>
