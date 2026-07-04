<script lang="ts">
	// `collapsible` is the headless bits primitive (no visual styling), so the
	// consumer supplies the surface with Tailwind utilities — the shadcn convention.
	import * as Collapsible from '../../lib/components/collapsible/index.js';
	import { Button } from '../../lib/components/button/index.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';

	let open = $state(true);
</script>

<Collapsible.Root bind:open class="flex w-full flex-col gap-2 sm:max-w-sm">
	<div class="flex items-center justify-between gap-4 px-1">
		<h4 class="text-sm font-semibold">@huntabyte starred 3 repositories</h4>
		<Collapsible.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="icon" class="size-8">
					<ChevronsUpDownIcon class="size-4" />
					<span class="sr-only">Toggle</span>
				</Button>
			{/snippet}
		</Collapsible.Trigger>
	</div>
	<div class="rounded-md border px-4 py-2 font-mono text-sm">@sveltejs/svelte</div>
	<Collapsible.Content class="flex flex-col gap-2">
		<div class="rounded-md border px-4 py-2 font-mono text-sm">@sveltejs/kit</div>
		<div class="rounded-md border px-4 py-2 font-mono text-sm">@huntabyte/bits-ui</div>
	</Collapsible.Content>
</Collapsible.Root>
