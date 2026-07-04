<script lang="ts">
	import * as Chart from '../../lib/components/chart/index.js';
	import { BarChart } from 'layerchart';

	const chartData = [
		{ month: 'January', desktop: 186 },
		{ month: 'February', desktop: 305 },
		{ month: 'March', desktop: 237 },
		{ month: 'April', desktop: 73 },
		{ month: 'May', desktop: 209 },
		{ month: 'June', desktop: 214 }
	];

	const chartConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' }
	} satisfies Chart.ChartConfig;
</script>

<Chart.Container config={chartConfig} class="h-[250px] w-full max-w-xl">
	<BarChart
		data={chartData}
		x="month"
		axis="x"
		series={[{ key: 'desktop', label: 'Desktop', color: 'var(--color-desktop)' }]}
		props={{ xAxis: { format: (d: string) => d.slice(0, 3) } }}
	>
		{#snippet tooltip()}
			<Chart.Tooltip />
		{/snippet}
	</BarChart>
</Chart.Container>
