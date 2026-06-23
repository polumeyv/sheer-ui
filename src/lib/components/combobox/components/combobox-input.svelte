<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { ComboboxInputProps } from '../types.js';
	import { useId } from '$lib/internal/use-id.js';
	import { FloatingLayer } from '$lib/components/utilities/floating-layer/index.js';
	import { SelectInputState } from '$lib/components/select/select.svelte.js';

	let { id = useId(), ref = $bindable(null), child, defaultValue, clearOnDeselect = false, ...restProps }: ComboboxInputProps = $props();

	const inputState = SelectInputState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		clearOnDeselect: boxWith(() => clearOnDeselect),
	});

	if (defaultValue) {
		inputState.root.opts.inputValue.current = defaultValue;
	}

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'combobox-input',
				class:
					'border-border bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border ps-3 pe-10 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			},
			restProps,
			inputState.props,
			{ value: inputState.root.opts.inputValue.current },
		),
	);
</script>

<FloatingLayer.Anchor {id} ref={inputState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<input {...mergedProps} />
	{/if}
</FloatingLayer.Anchor>
