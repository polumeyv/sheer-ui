<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { SelectScrollUpButtonProps } from "$lib/components/select/primitive/types.js";
	import { SelectScrollUpButtonState } from "$lib/components/select/primitive/select.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { Mounted } from "$lib/components/_shared/utilities/index.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		delay = () => 50,
		child,
		children,
		...restProps
	}: SelectScrollUpButtonProps = $props();

	const scrollButtonState = SelectScrollUpButtonState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		delay: boxWith(() => delay),
	});

	const mergedProps = $derived(mergeProps(restProps, scrollButtonState.props));
</script>

{#if scrollButtonState.canScrollUp}
	<Mounted bind:mounted={scrollButtonState.scrollButtonState.mounted} />
	{#if child}
		{@render child({ props: restProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
