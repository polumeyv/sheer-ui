<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import { DialogTitleState } from '$lib/components/dialog/primitive/dialog.svelte';
	import type { DialogTitleProps } from '$lib/components/dialog/primitive/index';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		level = 2,
		...restProps
	}: DialogTitleProps = $props();

	const titleState = DialogTitleState.create({
		id: { get current() { return id; } },
		level: { get current() { return level; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, titleState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
