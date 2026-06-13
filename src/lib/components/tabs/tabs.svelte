<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { TabsRootProps } from '$lib/components/tabs/primitive/types.js';
	import { TabsRootState } from '$lib/components/tabs/primitive/tabs.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { noop } from '$lib/internal/noop.js';
	import { cn } from '../../utils.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(''),
		onValueChange = noop,
		orientation = 'horizontal',
		loop = true,
		activationMode = 'automatic',
		disabled = false,
		children,
		child,
		class: className,
		...restProps
	}: TabsRootProps = $props();

	const rootState = TabsRootState.create({
		id: boxWith(() => id),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		orientation: boxWith(() => orientation),
		loop: boxWith(() => loop),
		activationMode: boxWith(() => activationMode),
		disabled: boxWith(() => disabled),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'tabs',
				class: cn('flex flex-col gap-2', className),
			},
			restProps,
			rootState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
