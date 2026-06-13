<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { CommandLoadingProps } from "$lib/components/command/primitive/types.js";
	import { CommandLoadingState } from "$lib/components/command/primitive/command.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		progress = 0,
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: CommandLoadingProps = $props();

	const loadingState = CommandLoadingState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		progress: boxWith(() => progress),
	});

	const mergedProps = $derived(mergeProps(restProps, loadingState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
