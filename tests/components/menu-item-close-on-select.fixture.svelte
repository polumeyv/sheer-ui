<script lang="ts">
	import * as DropdownMenu from "../../src/lib/components/dropdown-menu/index.js";

	let checked = $state(false);
	let radio = $state("a");
</script>

<output data-testid="checked">{String(checked)}</output>
<output data-testid="radio">{radio}</output>

<DropdownMenu.Root open>
	{#snippet children(menu)}
		<output data-testid="open">{String(menu.open)}</output>
		<DropdownMenu.ContentStatic>
			<DropdownMenu.Item data-testid="item">Item</DropdownMenu.Item>
			<DropdownMenu.Item data-testid="kept-item" onSelect={(e) => e.preventDefault()}>Kept item</DropdownMenu.Item>
			<DropdownMenu.CheckboxItem bind:checked data-testid="checkbox">Checkbox</DropdownMenu.CheckboxItem>
			<DropdownMenu.RadioGroup bind:value={radio}>
				<DropdownMenu.RadioItem value="b" data-testid="radio-b">B</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="c" data-testid="kept-radio-c" onSelect={(e) => e.preventDefault()}>C</DropdownMenu.RadioItem>
			</DropdownMenu.RadioGroup>
		</DropdownMenu.ContentStatic>
	{/snippet}
</DropdownMenu.Root>
