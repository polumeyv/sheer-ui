<script lang="ts">
	import * as Accordion from "../../src/lib/components/accordion/index.js";

	let {
		hiddenUntilFound = true,
		value = $bindable(""),
	}: {
		hiddenUntilFound?: boolean;
		value?: string;
	} = $props();

	let renderContent = $state(true);

	export function hideContent() {
		renderContent = false;
	}
</script>

<output data-testid="value">{value}</output>

<Accordion.Root type="single" bind:value>
	<Accordion.Item value="alpha">
		<Accordion.Trigger>Alpha</Accordion.Trigger>
		{#if renderContent}
			<Accordion.Content forceMount {hiddenUntilFound} data-testid="content">
				Alpha content
			</Accordion.Content>
		{/if}
	</Accordion.Item>
</Accordion.Root>
