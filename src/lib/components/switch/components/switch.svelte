<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { SwitchRootProps } from '../types.js';
	import { SwitchRootState } from '../switch.svelte.js';
	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		disabled = false,
		required = false,
		checked = $bindable(false),
		type = 'button',
		onCheckedChange = () => {},
		...restProps
	}: SwitchRootProps = $props();

	const rootState = SwitchRootState.create({
		checked: boxWith(
			() => checked,
			(v) => {
				checked = v;
				onCheckedChange?.(v);
			},
		),
		disabled: boxWith(() => disabled ?? false),
		required: boxWith(() => required),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'switch',
				class:
					'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-border focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-border/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
			},
			restProps,
			rootState.props,
			{ type },
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</button>
{/if}
