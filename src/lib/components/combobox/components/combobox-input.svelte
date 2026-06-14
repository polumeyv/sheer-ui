<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { ComboboxInputProps } from "$lib/components/combobox/index";
	import { useId } from "$lib/vendor/use-id";
	import { FloatingLayer } from "$lib/components/_shared/utilities/floating-layer/index";
	import { SelectInputState } from "$lib/components/combobox/primitive/select.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		defaultValue,
		clearOnDeselect = false,
		...restProps
	}: ComboboxInputProps = $props();

	const inputState = SelectInputState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		clearOnDeselect: { get current() { return clearOnDeselect; } },
	});

	if (defaultValue) {
		inputState.root.opts.inputValue.current = defaultValue;
	}

	const mergedProps = $derived(
		mergeProps(restProps, inputState.props, { value: inputState.root.opts.inputValue.current })
	);
</script>

<FloatingLayer.Anchor {id} ref={inputState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<input {...mergedProps} />
	{/if}
</FloatingLayer.Anchor>
