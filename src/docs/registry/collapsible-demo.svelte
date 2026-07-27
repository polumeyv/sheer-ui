<script lang="ts">
	// Native <details>/<summary>: the Trigger IS the summary, so it sits directly
	// inside Root and the whole header row is the disclosure control. Styling stays
	// consumer-supplied (the shadcn convention for headless primitives).
	import * as Collapsible from '../../lib/components/collapsible/index.js';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
</script>

<Collapsible.Root open class="w-full sm:max-w-sm">
	<Collapsible.Trigger class="hover:bg-muted/50 flex items-center justify-between gap-4 rounded-md px-1 py-1.5">
		<h4 class="text-sm font-semibold">@huntabyte starred 3 repositories</h4>
		<span class="flex size-8 items-center justify-center">
			<ChevronsUpDownIcon class="size-4" />
			<span class="sr-only">Toggle</span>
		</span>
	</Collapsible.Trigger>
	<Collapsible.Content class="flex flex-col gap-2 pt-2">
		<div class="rounded-md border px-4 py-2 font-mono text-sm">@sveltejs/svelte</div>
		<div class="rounded-md border px-4 py-2 font-mono text-sm">@sveltejs/kit</div>
		<div class="rounded-md border px-4 py-2 font-mono text-sm">@huntabyte/bits-ui</div>
	</Collapsible.Content>
</Collapsible.Root>
