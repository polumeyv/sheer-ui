<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { PinInputRootProps } from "$lib/components/pin-input/index";
	import { PinInputRootState } from "$lib/components/pin-input/pin-input.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		inputId = `${createId(uid)}-input`,
		ref = $bindable(null),
		inputRef = $bindable(null),
		maxlength = 6,
		textalign = "left",
		pattern,
		inputmode = "numeric",
		onComplete = (() => {}),
		pushPasswordManagerStrategy = "increase-width",
		class: containerClass = "",
		children,
		autocomplete = "one-time-code",
		disabled = false,
		value = $bindable(""),
		onValueChange = (() => {}),
		pasteTransformer,
		...restProps
	}: PinInputRootProps = $props();

	const rootState = PinInputRootState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		inputRef: { get current() { return inputRef; }, set current(v) { (inputRef = v); } },
		inputId: { get current() { return inputId; } },
		autocomplete: { get current() { return autocomplete; } },
		maxLength: { get current() { return maxlength; } },
		textAlign: { get current() { return textalign; } },
		disabled: { get current() { return disabled; } },
		inputmode: { get current() { return inputmode; } },
		pattern: { get current() { return pattern; } },
		onComplete: { get current() { return onComplete; } },
		value: { get current() { return value; }, set current(v) { value = v; onValueChange(v); } },
		pushPasswordManagerStrategy: { get current() { return pushPasswordManagerStrategy; } },
		pasteTransformer: { get current() { return pasteTransformer; } },
	});

	const mergedInputProps = $derived(mergeProps(restProps, rootState.inputProps));
	const mergedRootProps = $derived(mergeProps(rootState.rootProps, { class: containerClass }));
	const mergedInputWrapperProps = $derived(mergeProps(rootState.inputWrapperProps, {}));
</script>

<div {...mergedRootProps}>
	{@render children?.(rootState.snippetProps)}

	<div {...mergedInputWrapperProps}>
		<input {...mergedInputProps} />
	</div>
</div>
