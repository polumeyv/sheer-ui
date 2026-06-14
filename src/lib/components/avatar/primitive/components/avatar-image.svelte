<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { AvatarImageProps } from "$lib/components/avatar/primitive/index";
	import { AvatarImageState } from "$lib/components/avatar/primitive/avatar.svelte";
	import { createId } from "$lib/vendor/create-id";

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
		src: { get current() { return src; } },
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		crossOrigin: { get current() { return crossorigin; } },
		referrerPolicy: { get current() { return referrerpolicy; } },
	});

	const mergedProps = $derived(mergeProps(restProps, imageState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<img {...mergedProps} {src} />
{/if}
