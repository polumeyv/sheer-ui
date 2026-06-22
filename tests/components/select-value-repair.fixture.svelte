<script lang="ts">
	import * as Select from "../../src/lib/components/select/index.js";

	let {
		value = $bindable(),
		type,
		name = "selection",
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
		<Select.Root bind:value {type} {name} items={[{ value: "alpha", label: "Alpha" }, { value: "beta", label: "Beta" }]}>
			<Select.Item value="alpha" label="Alpha" data-testid="item-alpha">Alpha</Select.Item>
			<Select.Item value="beta" label="Beta" data-testid="item-beta">Beta</Select.Item>
		</Select.Root>
	{:else}
		<Select.Root bind:value {type} {name} items={[{ value: "alpha", label: "Alpha" }, { value: "beta", label: "Beta" }]}>
			<Select.Item value="alpha" label="Alpha" data-testid="item-alpha">Alpha</Select.Item>
			<Select.Item value="beta" label="Beta" data-testid="item-beta">Beta</Select.Item>
		</Select.Root>
	{/if}
</form>
