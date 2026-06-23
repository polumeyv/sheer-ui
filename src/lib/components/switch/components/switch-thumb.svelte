<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { SwitchThumbProps } from '../types.js';
	import { SwitchThumbState } from '../switch.svelte.js';
	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let { child, children, ref = $bindable(null), id = createId(uid), ...restProps }: SwitchThumbProps = $props();

	const thumbState = SwitchThumbState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'switch-thumb',
				class:
					'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
			},
			restProps,
			thumbState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...thumbState.snippetProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.(thumbState.snippetProps)}
	</span>
{/if}
