<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { AvatarImageProps } from '$lib/components/primitive/avatar/index';
	import { AvatarImageState } from '$lib/components/primitive/avatar/avatar.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn } from '../../vendor/utils';

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
		src: { get current() { return src; } },
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		crossOrigin: { get current() { return crossorigin; } },
		referrerPolicy: { get current() { return referrerpolicy; } },
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
