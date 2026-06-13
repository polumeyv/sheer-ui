<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { AvatarImageProps } from "$lib/components/avatar/primitive/index.js";
	import { AvatarImageState } from "$lib/components/avatar/primitive/avatar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

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
