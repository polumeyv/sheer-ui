<script lang="ts">
	import { type WritableBox, boxWith } from "$lib/vendor/toolbelt/index.js";
	import { mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { ToggleGroupRootProps } from "$lib/components/toggle-group/primitive/types.js";
	import { ToggleGroupRootState } from "$lib/components/toggle-group/primitive/toggle-group.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";
	import { watch } from "$lib/vendor/runed/index.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		type,
		disabled = false,
		loop = true,
		orientation = "horizontal",
		rovingFocus = true,
		child,
		children,
		...restProps
	}: ToggleGroupRootProps = $props();

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = type === "single" ? "" : [];
	}

	// SSR
	handleDefaultValue();

	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const rootState = ToggleGroupRootState.create({
		id: boxWith(() => id),
		value: boxWith(
			() => value!,
			(v) => {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		disabled: boxWith(() => disabled),
		loop: boxWith(() => loop),
		orientation: boxWith(() => orientation),
		rovingFocus: boxWith(() => rovingFocus),
		type,
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
