<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { AvatarFallbackProps } from "$lib/components/avatar/primitive/index";
	import { AvatarFallbackState } from "$lib/components/avatar/primitive/avatar.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: AvatarFallbackProps = $props();

	const fallbackState = AvatarFallbackState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, fallbackState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
