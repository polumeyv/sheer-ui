<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/index.js";
	import { FloatingArrowState } from "$lib/components/_shared/utilities/floating-layer/use-floating-layer.svelte.js";
	import { Arrow, type ArrowProps } from "$lib/components/_shared/utilities/arrow/index.js";
	import { useId } from "$lib/internal/use-id.js";

	let { id = useId(), ref = $bindable(null), ...restProps }: ArrowProps = $props();

	const arrowState = FloatingArrowState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, arrowState.props));
</script>

<Arrow {...mergedProps} />
