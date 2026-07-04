<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ComboboxInputProps } from '../types.js';
	import { useId } from '../../../internal/use-id.js';
	import { floatingAnchor } from '../../../internal/floating-layer/index.js';
	import { SelectInputState } from '../select/select.svelte.js';

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

	const anchor = floatingAnchor();
</script>

{#if child}
	{@render child({ props: mergeProps(mergedProps, anchor) })}
{:else}
	<input {...mergeProps(mergedProps, anchor)} />
{/if}
