<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef } from '../../internal/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import ChartStyle from './chart-style.svelte';
	import { setChartContext, type ChartConfig } from './chart-utils.js';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = uid,
		class: className,
		style,
		children,
		config,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & {
		config: ChartConfig;
	} = $props();

	const chartId = $derived(`chart-${id || uid.replace(/:/g, '')}`);

	setChartContext({
		get config() {
			return config;
		},
	});

	// Plain colors become inline custom properties; per-theme colors need real
	// selectors (`.dark`) and keep the <ChartStyle> stylesheet path.
	const colorVars = $derived(
		Object.entries(config)
			.filter(([, item]) => item.color)
			.map(([key, item]) => `--color-${key}: ${item.color};`)
			.join(' '),
	);
	const hasThemedColors = $derived(Object.values(config).some((item) => item.theme));
</script>

<div
	bind:this={ref}
	data-chart={chartId}
	data-slot="chart"
	class={join('flex aspect-video justify-center overflow-visible text-xs', className)}
	style={[colorVars, style].filter(Boolean).join(' ') || undefined}
	{...restProps}>
	{#if hasThemedColors}
		<ChartStyle id={chartId} {config} />
	{/if}
	{@render children?.()}
</div>
