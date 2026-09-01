<script lang="ts">
	import * as DropdownMenu from "../../src/lib/components/dropdown-menu/index.js";

	let {
		value = $bindable([]),
		dynamicValue = "alpha",
		standaloneChecked = $bindable(false),
	}: {
		value?: string[];
		dynamicValue?: string;
		standaloneChecked?: boolean;
	} = $props();

	let dynamicChecked = $state(false);
	let betaChecked = $state(false);
	let groupChangeCount = $state(0);
	let checkedChangeCount = $state(0);
	let selectCount = $state(0);

	function formatList(current: string[]) {
		return `[${current.join(",")}]`;
	}

	export function setValue(next: string[]) {
		value = next;
	}

	export function setDynamicValue(next: string) {
		dynamicValue = next;
	}
</script>

<output data-testid="group-value">{formatList(value)}</output>
<output data-testid="dynamic-checked">{String(dynamicChecked)}</output>
<output data-testid="beta-checked">{String(betaChecked)}</output>
<output data-testid="standalone-checked">{String(standaloneChecked)}</output>
<output data-testid="group-change-count">{groupChangeCount}</output>
<output data-testid="checked-change-count">{checkedChangeCount}</output>
<output data-testid="select-count">{selectCount}</output>

<DropdownMenu.Root open>
	<DropdownMenu.ContentStatic>
		<DropdownMenu.CheckboxGroup
			bind:value
			onValueChange={() => (groupChangeCount += 1)}
			data-testid="group"
		>
			<DropdownMenu.CheckboxItem
				bind:checked={dynamicChecked}
				value={dynamicValue}
				closeOnSelect={false}
				data-testid="dynamic"
				onCheckedChange={() => (checkedChangeCount += 1)}
				onSelect={() => (selectCount += 1)}
			>
				Dynamic
			</DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxItem
				bind:checked={betaChecked}
				value="beta"
				closeOnSelect={false}
				data-testid="beta"
			>
				Beta
			</DropdownMenu.CheckboxItem>
		</DropdownMenu.CheckboxGroup>
		<DropdownMenu.CheckboxItem
			bind:checked={standaloneChecked}
			closeOnSelect={false}
			data-testid="standalone"
		>
			Standalone
		</DropdownMenu.CheckboxItem>
	</DropdownMenu.ContentStatic>
</DropdownMenu.Root>
