<script lang="ts">
	import { boxWith } from '../../../../internal/tools/index.js';
	import { mergeProps } from '../../../../merge-props.js';
	import { FloatingArrowState } from '../use-floating-layer.svelte.js';
	import { Arrow, type ArrowProps } from '../../../../components/utilities/arrow/index.js';
	import { useId } from '../../../../internal/use-id.js';

	let { id = useId(), ref = $bindable(null), ...restProps }: ArrowProps = $props();

	const arrowState = FloatingArrowState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps(restProps, arrowState.props));
</script>

<Arrow {...mergedProps} />
