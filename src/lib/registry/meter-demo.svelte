<script lang="ts">
	import * as Meter from '$lib/components/meter/index.js';

	const value = 72;
	const max = 100;
</script>

<Meter.Root
	{value}
	{max}
	min={0}
	class="flex w-full max-w-xs flex-col gap-2"
>
	<div class="flex items-center justify-between text-sm">
		<span class="text-muted-foreground">Storage used</span>
		<span class="font-medium tabular-nums">{value}%</span>
	</div>
	<div class="bg-primary/20 relative h-2 w-full overflow-hidden rounded-full">
		<div
			class="bg-primary h-full rounded-full transition-all"
			style="width: {(value / max) * 100}%"
		></div>
	</div>
</Meter.Root>
