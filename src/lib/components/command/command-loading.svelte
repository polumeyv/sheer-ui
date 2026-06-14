<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { CommandLoadingProps } from '$lib/components/primitive/command/index';
	import { CommandLoadingState } from '$lib/components/primitive/command/command.svelte';
	import { createId } from '$lib/vendor/create-id';

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
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		progress: { get current() { return progress; } },
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
