<script lang="ts">
	import { parseDate, type DateValue } from "@internationalized/date";
	import * as DateField from "../../src/lib/components/date-field/index.js";

	let {
		name = $bindable("birthday"),
		value = $bindable(parseDate("2024-02-03")),
	}: {
		name?: string;
		value?: DateValue;
	} = $props();

	export function setName(next: string | undefined) {
		name = next;
	}
</script>

<form data-testid="form">
	<DateField.Root bind:value>
		<DateField.Input {name} data-testid="field" />
	</DateField.Root>
</form>
