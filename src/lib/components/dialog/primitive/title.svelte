<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/index.js';
	import { DialogTitleState } from '$lib/components/dialog/primitive/dialog.svelte.js';
	import type { DialogTitleProps } from '$lib/components/dialog/primitive/index.js';
	import { createId } from '$lib/internal/create-id.js';

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
		id: boxWith(() => id),
		level: boxWith(() => level),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
