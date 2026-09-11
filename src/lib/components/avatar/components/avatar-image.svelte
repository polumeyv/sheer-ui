<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { AvatarImageProps } from '../types.js';
	import { AvatarImageState } from '../avatar.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		src,
		child,
		id = createId(uid),
		ref = $bindable(null),
		crossorigin = undefined,
		referrerpolicy = undefined,
		...restProps
	}: AvatarImageProps = $props();

	const imageState = AvatarImageState.create({
		get src() {
			return src;
		},
		get id() {
			return id;
		},
		get crossOrigin() {
			return crossorigin;
		},
		get referrerPolicy() {
			return referrerpolicy;
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
				'data-slot': 'avatar-image',
				class: 'aspect-square size-full',
			},
			restProps,
			imageState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<img {...mergedProps} {src} />
{/if}
