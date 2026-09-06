<script lang="ts">
	import * as ToggleGroup from "../../src/lib/components/toggle-group/index.js";
	import * as Toolbar from "../../src/lib/components/toolbar/index.js";

	let {
		surface,
		type,
		value = $bindable(),
		disabled = false,
		rovingFocus = true,
	}: {
		surface: "toggle-group" | "toolbar";
		type: "single" | "multiple";
		value?: string | string[];
		disabled?: boolean;
		rovingFocus?: boolean;
	} = $props();

	const items = ["alpha", "beta", "gamma"];

	function formatValue(current: string | string[] | undefined) {
		if (Array.isArray(current)) return `[${current.join(",")}]`;
		return current ?? "undefined";
	}

	export function setValue(next: string | string[] | undefined) {
		value = next;
	}
</script>

{#snippet toggleGroupItems()}
	{#each items as item (item)}
		<ToggleGroup.Item value={item} data-testid="item-{item}">{item}</ToggleGroup.Item>
	{/each}
{/snippet}

{#snippet toolbarItems()}
	{#each items as item (item)}
		<Toolbar.GroupItem value={item} data-testid="item-{item}">{item}</Toolbar.GroupItem>
	{/each}
{/snippet}

<output data-testid="value">{formatValue(value)}</output>

{#if surface === "toggle-group"}
	{#if type === "single"}
		<ToggleGroup.Root type="single" bind:value {disabled} {rovingFocus}>{@render toggleGroupItems()}</ToggleGroup.Root>
	{:else}
		<ToggleGroup.Root type="multiple" bind:value {disabled} {rovingFocus}>{@render toggleGroupItems()}</ToggleGroup.Root>
	{/if}
{:else}
	<Toolbar.Root>
		{#if type === "single"}
			<Toolbar.Group type="single" bind:value {disabled}>{@render toolbarItems()}</Toolbar.Group>
		{:else}
			<Toolbar.Group type="multiple" bind:value {disabled}>{@render toolbarItems()}</Toolbar.Group>
		{/if}
		<Toolbar.Button data-testid="button">Button</Toolbar.Button>
	</Toolbar.Root>
{/if}
