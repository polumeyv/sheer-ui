<script lang="ts">
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import type { RadioGroupRootProps } from "../types.js";
	import { RadioGroupRootState } from "../radio-group.svelte.js";
	import RadioGroupInput from "./radio-group-input.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		disabled = false,
		children,
		child,
		value = $bindable(""),
		ref = $bindable(null),
		orientation = "vertical",
		loop = true,
		name = undefined,
		required = false,
		readonly = false,
		id = createId(uid),
		onValueChange = () => {},
		...restProps
	}: RadioGroupRootProps = $props();

	const rootState = RadioGroupRootState.create({
		orientation: boxWith(() => orientation),
		disabled: boxWith(() => disabled),
		loop: boxWith(() => loop),
		name: boxWith(() => name),
		required: boxWith(() => required),
		readonly: boxWith(() => readonly),
		id: boxWith(() => id),
		value: boxWith(
			() => value,
			(v) => {
				if (v === value) return;
				value = v;
				onValueChange?.(v);
			}
		),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps({ "data-slot": "radio-group", class: "grid gap-3" }, restProps, rootState.props)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

<RadioGroupInput />
