<script lang="ts">
	import * as Collapsible from "../../src/lib/components/collapsible/index.js";

	let {
		hiddenUntilFound = true,
		open = $bindable(false),
	}: {
		hiddenUntilFound?: boolean;
		open?: boolean;
	} = $props();

	let renderContent = $state(true);

	export function hideContent() {
		renderContent = false;
	}
</script>

<output data-testid="open">{open ? "open" : "closed"}</output>

<Collapsible.Root bind:open>
	<Collapsible.Trigger>Toggle</Collapsible.Trigger>
	{#if renderContent}
		<Collapsible.Content forceMount {hiddenUntilFound} data-testid="content">
			Collapsible content
		</Collapsible.Content>
	{/if}
</Collapsible.Root>
