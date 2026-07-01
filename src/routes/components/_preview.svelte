<script lang="ts">
	import type { Snippet } from 'svelte';
	import { join } from 'overrule';

	let {
		children,
		class: className,
		align = 'center',
	}: { children: Snippet; class?: string; align?: 'center' | 'start' | 'end' } = $props();
</script>

<!--
	The "individual display unit", ported from shadcn-svelte's component-preview:
	a bordered, rounded stage that frames a single live example. It adds NO
	styling to what it frames — the component renders with its own library
	styling. `align` controls vertical placement (center | start | end).
-->
<div class={join('relative rounded-lg border', className)}>
	<div
		data-align={align}
		class="flex min-h-87.5 w-full flex-wrap justify-center gap-4 p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start">
		{@render children()}
	</div>
</div>
