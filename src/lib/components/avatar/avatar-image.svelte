<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { AvatarImageProps } from '$lib/components/avatar/primitive/types.js';
	import { AvatarImageState } from '$lib/components/avatar/primitive/avatar.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../utils';

	const uid = $props.id();

	let {
		src,
		child,
		id = createId(uid),
		ref = $bindable(null),
		crossorigin = undefined,
		referrerpolicy = undefined,
		class: className,
		...restProps
	}: AvatarImageProps = $props();

	const imageState = AvatarImageState.create({
		src: boxWith(() => src),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		crossOrigin: boxWith(() => crossorigin),
		referrerPolicy: boxWith(() => referrerpolicy),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'avatar-image',
				class: cn('aspect-square size-full', className),
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
