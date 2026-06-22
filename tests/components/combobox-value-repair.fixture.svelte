<script lang="ts">
	import * as Combobox from "../../src/lib/components/combobox/index.js";

	let {
		value = $bindable(),
		type,
		name = "choice",
	}: {
		value?: string | string[];
		type: "single" | "multiple";
		name?: string;
	} = $props();

	function formatValue(current: string | string[] | undefined) {
		if (Array.isArray(current)) return `[${current.join(",")}]`;
		return current ?? "undefined";
	}

	export function setValue(next: string | string[] | undefined) {
		value = next;
	}
</script>

<output data-testid="value">{formatValue(value)}</output>

<form data-testid="form">
	{#if type === "single"}
		<Combobox.Root
			bind:value
			{type}
			{name}
			items={[{ value: "alpha", label: "Alpha" }, { value: "beta", label: "Beta" }]}>
			<Combobox.Item value="alpha" label="Alpha" data-testid="item-alpha">Alpha</Combobox.Item>
			<Combobox.Item value="beta" label="Beta" data-testid="item-beta">Beta</Combobox.Item>
		</Combobox.Root>
	{:else}
		<Combobox.Root
			bind:value
			{type}
			{name}
			items={[{ value: "alpha", label: "Alpha" }, { value: "beta", label: "Beta" }]}>
			<Combobox.Item value="alpha" label="Alpha" data-testid="item-alpha">Alpha</Combobox.Item>
			<Combobox.Item value="beta" label="Beta" data-testid="item-beta">Beta</Combobox.Item>
		</Combobox.Root>
	{/if}
</form>
