<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { RatingGroupRootProps } from "$lib/components/rating-group/index.js";
	import { RatingGroupRootState } from "$lib/components/rating-group/rating-group.svelte.js";
	import RatingGroupInput from "$lib/components/rating-group/components/rating-group-input.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		disabled = false,
		children,
		child,
		value = $bindable(0),
		ref = $bindable(null),
		orientation = "horizontal",
		name = undefined,
		required = false,
		min = 0,
		max = 5,
		allowHalf = false,
		readonly = false,
		id = createId(uid),
		onValueChange = (() => {}),
		"aria-label": ariaLabel,
		"aria-valuetext": ariaValuetextProp,
		hoverPreview = true,
		...restProps
	}: RatingGroupRootProps = $props();

	if (value < min || value > max) {
		value = Math.max(min, Math.min(max, value));
	}

	const ariaValuetext: NonNullable<RatingGroupRootProps["aria-valuetext"]> = $derived.by(() => {
		if (ariaValuetextProp) return ariaValuetextProp;
		return (value: number, max: number) => `${value} out of ${max}`;
	});

	const rootState = RatingGroupRootState.create({
		orientation: { get current() { return orientation; } },
		disabled: { get current() { return disabled; } },
		name: { get current() { return name; } },
		required: { get current() { return required; } },
		min: { get current() { return min; } },
		max: { get current() { return max; } },
		allowHalf: { get current() { return allowHalf; } },
		readonly: { get current() { return readonly; } },
		id: { get current() { return id; } },
		value: { get current() { return value; }, set current(v) { if (v === value) return; value = v; onValueChange?.(v); } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		ariaValuetext: { get current() { return ariaValuetext; } },
		hoverPreview: { get current() { return hoverPreview; } },
	});

	const mergedProps = $derived(
		mergeProps(restProps, rootState.props, { "aria-label": ariaLabel })
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</div>
{/if}

<RatingGroupInput />
