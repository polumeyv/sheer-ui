<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { AvatarRootProps } from '../types.js';
	import { AvatarRootState } from '../avatar.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		delayMs = 0,
		loadingStatus = $bindable('loading'),
		onLoadingStatusChange,
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: AvatarRootProps = $props();

	const rootState = AvatarRootState.create({
		get delayMs() {
			return delayMs;
		},
		get loadingStatus() {
			return loadingStatus;
		},
		set loadingStatus(v) {
			if (loadingStatus === v) return;
			loadingStatus = v;
			onLoadingStatusChange?.(v);
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
				'data-slot': 'avatar',
				class: 'relative flex size-8 shrink-0 overflow-hidden rounded-full',
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
