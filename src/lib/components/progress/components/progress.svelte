<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ProgressRootProps } from '../types.js';
	import { getProgressPercent, ProgressRootState } from '../progress.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		child,
		children,
		value = 0,
		max = 100,
		min = 0,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: ProgressRootProps = $props();

	const rootState = ProgressRootState.create({
		get value() {
			return value;
		},
		get max() {
			return max;
		},
		get min() {
			return min;
		},
		get id() {
			return id;
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'progress',
				class: 'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
			},
			restProps,
			rootState.props,
		),
	);
	const percent = $derived(getProgressPercent(value, min, max));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		<div
			data-slot="progress-indicator"
			class="bg-primary h-full w-full flex-1 transition-all"
			style="transform: translateX(-{100 - (percent ?? 0)}%)">
		</div>
		{@render children?.()}
	</div>
{/if}
