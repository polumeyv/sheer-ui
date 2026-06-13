<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/index.js";
	import type { MenuCheckboxGroupProps } from "$lib/components/_shared/menu/index.js";
	import { MenuCheckboxGroupState } from "$lib/components/_shared/menu/menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		value = $bindable([]),
		onValueChange = (() => {}),
		...restProps
	}: MenuCheckboxGroupProps = $props();

	const checkboxGroupState = MenuCheckboxGroupState.create({
		value: boxWith(
			() => $state.snapshot(value),
			(v) => {
				value = $state.snapshot(v);
				onValueChange(v);
			}
		),
		onValueChange: boxWith(() => onValueChange),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		id: boxWith(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, checkboxGroupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
