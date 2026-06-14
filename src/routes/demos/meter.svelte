<script lang="ts">
	import { Meter } from '$lib/components/primitive/meter/index';

	const value = 72;
	const max = 100;
</script>

<div class="grid w-full max-w-sm gap-2">
	<div class="flex items-center justify-between text-sm">
		<span class="text-muted-foreground">Storage used</span>
		<span class="font-medium">{value}%</span>
	</div>
	<Meter.Root
		{value}
		{max}
		class="relative h-2 w-full overflow-hidden rounded-full bg-primary/20"
	>
		<div
			class="bg-primary h-full transition-all"
			style="width: {(value / max) * 100}%"
		></div>
	</Meter.Root>
</div>
