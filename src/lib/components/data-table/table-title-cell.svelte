<script lang="ts">
	import { Badge } from '../badge';

	let {
		value,
		labelValue,
		labels,
	}: {
		value: string;
		labelValue?: string;
		labels?: Array<{ value: string; label: string }>;
	} = $props();

	const label = $derived(labels?.find((l) => l.value === labelValue));
</script>

<div class="flex space-x-2">
	{#if label}
		<Badge variant="outline">{label.label}</Badge>
	{/if}
	<span class="max-w-125 truncate font-medium">
		{value}
	</span>
</div>
