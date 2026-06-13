<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { AvatarRootProps } from "$lib/components/avatar/primitive/index.js";
	import { AvatarRootState } from "$lib/components/avatar/primitive/avatar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		delayMs = 0,
		loadingStatus = $bindable("loading"),
		onLoadingStatusChange,
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
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

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
