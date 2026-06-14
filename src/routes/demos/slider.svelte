<script lang="ts">
	import { Slider } from '$lib/components/slider/index';

	let value = $state(50);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium">Volume</span>
		<span class="text-muted-foreground text-sm tabular-nums">{value}%</span>
	</div>
	<Slider type="single" bind:value min={0} max={100} step={1} />
</div>
