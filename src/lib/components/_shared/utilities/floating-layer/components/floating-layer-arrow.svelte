<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { FloatingArrowState } from "$lib/components/_shared/utilities/floating-layer/use-floating-layer.svelte";
	import { Arrow, type ArrowProps } from "$lib/components/_shared/utilities/arrow/index";
	import { useId } from "$lib/vendor/use-id";

	let { id = useId(), ref = $bindable(null), ...restProps }: ArrowProps = $props();

	const arrowState = FloatingArrowState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, arrowState.props));
</script>

<Arrow {...mergedProps} />
