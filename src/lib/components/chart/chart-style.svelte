<script lang="ts">
	import { THEMES, type ChartConfig } from './chart-utils.js';

	let { id, config }: { id: string; config: ChartConfig } = $props();

	// Only entries with per-theme colors reach this component; plain colors are
	// inlined as custom properties by chart-container.
	const themedConfig = $derived(Object.entries(config).flatMap(([key, item]) => (item.theme ? [[key, item.theme] as const] : [])));

	const themeContents = $derived.by(() => {
		if (!themedConfig.length) return;

		return Object.entries(THEMES)
			.map(([theme, prefix]) =>
				[
					`${prefix} [data-chart=${id}] {`,
					...themedConfig.map(([key, themeColors]) => `\t--color-${key}: ${themeColors[theme as keyof typeof THEMES]};`),
					'}',
				].join('\n'),
			)
			.join('\n');
	});
</script>

{#if themeContents}
	<svelte:element this={'style'}>
		{themeContents}
	</svelte:element>
{/if}
