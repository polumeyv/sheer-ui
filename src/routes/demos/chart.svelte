<script lang="ts">
	import * as Chart from '$lib/components/chart/index';
	import { AreaChart, BarChart, LineChart, PieChart } from 'layerchart';

	// Shared sizing, factored out so each example stays copy-paste sized.
	const CHART = 'h-[250px] w-full';

	// 1 — bar chart (single series). This is the package's ground-truth example.
	const barData = [
		{ month: 'January', desktop: 186 },
		{ month: 'February', desktop: 305 },
		{ month: 'March', desktop: 237 },
		{ month: 'April', desktop: 73 },
		{ month: 'May', desktop: 209 },
		{ month: 'June', desktop: 214 },
	];
	const barConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
	} satisfies Chart.ChartConfig;

	// 2 — grouped bars (two series side-by-side).
	const trafficData = [
		{ month: 'January', desktop: 186, mobile: 80 },
		{ month: 'February', desktop: 305, mobile: 200 },
		{ month: 'March', desktop: 237, mobile: 120 },
		{ month: 'April', desktop: 73, mobile: 190 },
		{ month: 'May', desktop: 209, mobile: 130 },
		{ month: 'June', desktop: 214, mobile: 140 },
	];
	const trafficConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
		mobile: { label: 'Mobile', color: 'var(--chart-2)' },
	} satisfies Chart.ChartConfig;
	const trafficSeries = [
		{ key: 'desktop', label: 'Desktop', color: 'var(--color-desktop)' },
		{ key: 'mobile', label: 'Mobile', color: 'var(--color-mobile)' },
	];

	// 3 — stacked area chart.
	const areaConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
		mobile: { label: 'Mobile', color: 'var(--chart-2)' },
	} satisfies Chart.ChartConfig;

	// 4 — multi-series line chart.
	const lineConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
		mobile: { label: 'Mobile', color: 'var(--chart-2)' },
	} satisfies Chart.ChartConfig;

	// 5 — donut chart (per-slice colors come from the config + `c` accessor).
	const browserData = [
		{ browser: 'chrome', visitors: 275, color: 'var(--color-chrome)' },
		{ browser: 'safari', visitors: 200, color: 'var(--color-safari)' },
		{ browser: 'firefox', visitors: 187, color: 'var(--color-firefox)' },
		{ browser: 'edge', visitors: 173, color: 'var(--color-edge)' },
		{ browser: 'other', visitors: 90, color: 'var(--color-other)' },
	];
	const browserConfig = {
		visitors: { label: 'Visitors' },
		chrome: { label: 'Chrome', color: 'var(--chart-1)' },
		safari: { label: 'Safari', color: 'var(--chart-2)' },
		firefox: { label: 'Firefox', color: 'var(--chart-3)' },
		edge: { label: 'Edge', color: 'var(--chart-4)' },
		other: { label: 'Other', color: 'var(--chart-5)' },
	} satisfies Chart.ChartConfig;
</script>

<div class="flex w-full max-w-2xl flex-col gap-10">
	<!-- 1 — bar chart -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Bar chart</h3>
			<p class="text-muted-foreground mt-1 text-xs">Single series with a hidden-label tooltip.</p>
		</div>
		<Chart.Container config={barConfig} class={CHART}>
			<BarChart
				data={barData}
				x="month"
				y="desktop"
				series={[{ key: 'desktop', label: 'Desktop', color: 'var(--color-desktop)' }]}
				props={{
					bars: { stroke: 'none', rounded: 'top', radius: 4 },
					xAxis: { format: (d: string) => d.slice(0, 3) },
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</BarChart>
		</Chart.Container>
	</section>

	<!-- 2 — grouped bars -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Grouped bars</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Two series side-by-side via <code>seriesLayout="group"</code>.
			</p>
		</div>
		<Chart.Container config={trafficConfig} class={CHART}>
			<BarChart
				data={trafficData}
				x="month"
				series={trafficSeries}
				seriesLayout="group"
				props={{
					bars: { stroke: 'none', rounded: 'top', radius: 4 },
					xAxis: { format: (d: string) => d.slice(0, 3) },
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip indicator="dashed" />
				{/snippet}
			</BarChart>
		</Chart.Container>
	</section>

	<!-- 3 — stacked area -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Stacked area</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Two series stacked via <code>seriesLayout="stack"</code>.
			</p>
		</div>
		<Chart.Container config={areaConfig} class={CHART}>
			<AreaChart
				data={trafficData}
				x="month"
				series={trafficSeries}
				seriesLayout="stack"
				props={{
					xAxis: { format: (d: string) => d.slice(0, 3) },
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip indicator="line" />
				{/snippet}
			</AreaChart>
		</Chart.Container>
	</section>

	<!-- 4 — line chart -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Line chart</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Multiple series with a dot-indicator tooltip.
			</p>
		</div>
		<Chart.Container config={lineConfig} class={CHART}>
			<LineChart
				data={trafficData}
				x="month"
				series={trafficSeries}
				props={{
					xAxis: { format: (d: string) => d.slice(0, 3) },
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip indicator="dot" />
				{/snippet}
			</LineChart>
		</Chart.Container>
	</section>

	<!-- 5 — donut -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Donut</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Pie chart with an <code>innerRadius</code> and per-slice colors.
			</p>
		</div>
		<Chart.Container config={browserConfig} class={CHART}>
			<PieChart
				data={browserData}
				key="browser"
				value="visitors"
				c="color"
				innerRadius={60}
				padAngle={0.02}
			>
				{#snippet tooltip()}
					<Chart.Tooltip nameKey="visitors" hideLabel />
				{/snippet}
			</PieChart>
		</Chart.Container>
	</section>
</div>
