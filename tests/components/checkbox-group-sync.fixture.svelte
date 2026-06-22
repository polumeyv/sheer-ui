<script lang="ts">
	import * as Checkbox from "../../src/lib/components/checkbox/index.js";

	let {
		standaloneChecked = $bindable(false),
		groupValue = $bindable([]),
		dynamicValue = "alpha",
		groupDisabled = false,
	}: {
		standaloneChecked?: boolean;
		groupValue?: string[];
		dynamicValue?: string;
		groupDisabled?: boolean;
	} = $props();

	let dynamicChecked = $state(false);
	let betaChecked = $state(false);
	let groupChangeCount = $state(0);
	let checkedChangeCount = $state(0);

	function formatList(value: string[]) {
		return `[${value.join(",")}]`;
	}

	export function setGroupValue(next: string[]) {
		groupValue = next;
	}

	export function setDynamicValue(next: string) {
		dynamicValue = next;
	}

	export function setGroupDisabled(next: boolean) {
		groupDisabled = next;
	}
</script>

<output data-testid="standalone-checked">{String(standaloneChecked)}</output>
<output data-testid="group-value">{formatList(groupValue)}</output>
<output data-testid="dynamic-checked">{String(dynamicChecked)}</output>
<output data-testid="beta-checked">{String(betaChecked)}</output>
<output data-testid="group-change-count">{groupChangeCount}</output>
<output data-testid="checked-change-count">{checkedChangeCount}</output>

<form data-testid="form">
	<Checkbox.Root
		bind:checked={standaloneChecked}
		name="standalone"
		value="yes"
		data-testid="standalone"
	/>

	<Checkbox.Group
		bind:value={groupValue}
		name="choices"
		disabled={groupDisabled}
		onValueChange={() => (groupChangeCount += 1)}
	>
		<Checkbox.Root
			bind:checked={dynamicChecked}
			value={dynamicValue}
			data-testid="dynamic"
			onCheckedChange={() => (checkedChangeCount += 1)}
		/>
		<Checkbox.Root bind:checked={betaChecked} value="beta" data-testid="beta" />
	</Checkbox.Group>
</form>
