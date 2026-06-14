<script lang="ts">
	import { Slider } from '$lib/components/slider/index';

	// Shared layout class for each example's label row, factored out to keep
	// every example copy-paste sized.
	const LABEL_ROW = 'flex items-center justify-between';
	const LABEL = 'text-sm font-medium';
	const VALUE = 'text-muted-foreground text-sm tabular-nums';

	// 1 — single
	let volume = $state(50);

	// 2 — range (two thumbs)
	let price = $state([25, 75]);

	// 3 — stepped
	let temperature = $state(20);

	// 4 — vertical
	let level = $state(40);

	// 5 — disabled
	const fixed = 60;
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — single -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Single</h3>
			<p class="text-muted-foreground mt-1 text-xs">One thumb across a continuous range.</p>
		</div>
		<div class="flex w-full flex-col gap-4">
			<div class={LABEL_ROW}>
				<span class={LABEL}>Volume</span>
				<span class={VALUE}>{volume}%</span>
			</div>
			<Slider type="single" bind:value={volume} min={0} max={100} step={1} />
		</div>
	</section>

	<!-- 2 — range -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Range</h3>
			<p class="text-muted-foreground mt-1 text-xs">Two thumbs select a span of values.</p>
		</div>
		<div class="flex w-full flex-col gap-4">
			<div class={LABEL_ROW}>
				<span class={LABEL}>Price</span>
				<span class={VALUE}>${price[0]} – ${price[1]}</span>
			</div>
			<Slider type="multiple" bind:value={price} min={0} max={100} step={1} />
		</div>
	</section>

	<!-- 3 — stepped -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Stepped</h3>
			<p class="text-muted-foreground mt-1 text-xs">Larger step snaps to coarse increments.</p>
		</div>
		<div class="flex w-full flex-col gap-4">
			<div class={LABEL_ROW}>
				<span class={LABEL}>Temperature</span>
				<span class={VALUE}>{temperature}°C</span>
			</div>
			<Slider type="single" bind:value={temperature} min={10} max={30} step={5} />
		</div>
	</section>

	<!-- 4 — vertical -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Vertical</h3>
			<p class="text-muted-foreground mt-1 text-xs">Orientation set to vertical.</p>
		</div>
		<div class="flex items-center gap-4">
			<Slider type="single" bind:value={level} min={0} max={100} step={1} orientation="vertical" class="h-44" />
			<span class={VALUE}>{level}%</span>
		</div>
	</section>

	<!-- 5 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Non-interactive, dimmed appearance.</p>
		</div>
		<div class="flex w-full flex-col gap-4">
			<div class={LABEL_ROW}>
				<span class={LABEL}>Brightness</span>
				<span class={VALUE}>{fixed}%</span>
			</div>
			<Slider type="single" value={fixed} min={0} max={100} step={1} disabled />
		</div>
	</section>
</div>
