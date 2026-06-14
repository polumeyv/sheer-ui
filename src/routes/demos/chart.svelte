<script lang="ts">
	import * as Chart from '$lib/components/chart/index';
	import { BarChart } from 'layerchart';

	const chartData = [
		{ month: 'January', desktop: 186 },
		{ month: 'February', desktop: 305 },
		{ month: 'March', desktop: 237 },
		{ month: 'April', desktop: 73 },
		{ month: 'May', desktop: 209 },
		{ month: 'June', desktop: 214 },
	];

	const chartConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
	} satisfies Chart.ChartConfig;
</script>

<Chart.Container config={chartConfig} class="h-[250px] w-full max-w-md">
	<BarChart
		data={chartData}
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
