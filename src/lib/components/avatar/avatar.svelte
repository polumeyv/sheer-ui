<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { AvatarRootProps } from '$lib/components/avatar/primitive/index.js';
	import { AvatarRootState } from '$lib/components/avatar/primitive/avatar.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
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
		delayMs: boxWith(() => delayMs),
		loadingStatus: boxWith(
			() => loadingStatus,
			(v) => {
				if (loadingStatus !== v) {
					loadingStatus = v;
					onLoadingStatusChange?.(v);
				}
			}
		),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
