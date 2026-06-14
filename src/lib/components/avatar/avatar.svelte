<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { AvatarRootProps } from '$lib/components/primitive/avatar/index';
	import { AvatarRootState } from '$lib/components/primitive/avatar/avatar.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		delayMs = 0,
		loadingStatus = $bindable('loading'),
		onLoadingStatusChange,
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarRootProps = $props();

	const rootState = AvatarRootState.create({
		delayMs: { get current() { return delayMs; } },
		loadingStatus: { get current() { return loadingStatus; }, set current(v) { if (loadingStatus !== v) {
                        					loadingStatus = v;
                        					onLoadingStatusChange?.(v);
                        				} } },
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'avatar',
				class: cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className),
			},
			restProps,
			rootState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
