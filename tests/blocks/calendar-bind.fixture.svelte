<script lang="ts">
	import { parseDate, type DateValue } from "@internationalized/date";
	import Calendar from "../../src/lib/blocks/calendar.svelte";

	let { preventDeselect = false, initial }: { preventDeselect?: boolean; initial?: DateValue } = $props();

	let value = $state<DateValue | undefined>(initial);
	let writes = $state<string[]>([]);
	const placeholder = parseDate("2030-01-15");

	export function resetWrites() {
		writes = [];
	}
</script>

<output data-testid="value">{value?.toString() ?? "undefined"}</output>
<output data-testid="writes">{writes.join(",")}</output>

<Calendar
	type="single"
	bind:value={() => value,
	(v) => {
		writes.push(v?.toString() ?? "undefined");
		value = v;
	}}
	{placeholder}
	{preventDeselect} />
