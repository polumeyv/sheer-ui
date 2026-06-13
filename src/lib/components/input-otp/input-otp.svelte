<script lang="ts">
	import { mergeProps } from '$lib/vendor/index.js';
	import type { PinInputRootProps } from '$lib/components/pin-input/index.js';
	import { PinInputRootState } from '$lib/components/pin-input/pin-input.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		inputId = `${createId(uid)}-input`,
		ref = $bindable(null),
		inputRef = $bindable(null),
		maxlength = 6,
		textalign = 'left',
		pattern,
		inputmode = 'numeric',
		onComplete = (() => {}),
		pushPasswordManagerStrategy = 'increase-width',
		class: className,
		children,
		autocomplete = 'one-time-code',
		disabled = false,
		value = $bindable<string | number>(''),
		onValueChange = (() => {}),
		pasteTransformer,
		...restProps
	}: Omit<PinInputRootProps, 'value'> & { value?: string | number } = $props();

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
		value: { get current() { return String(value); }, set current(v) { value = v; onValueChange(v); } },
		pushPasswordManagerStrategy: { get current() { return pushPasswordManagerStrategy; } },
		pasteTransformer: { get current() { return pasteTransformer; } },
	});

	const mergedInputProps = $derived(
		mergeProps({ 'data-slot': 'input-otp' }, restProps, rootState.inputProps)
	);
	const mergedRootProps = $derived(
		mergeProps(rootState.rootProps, {
			class: cn(
				'flex items-center gap-2 has-disabled:opacity-50 [&_input]:disabled:cursor-not-allowed',
				className
			),
		})
	);
	const mergedInputWrapperProps = $derived(mergeProps(rootState.inputWrapperProps, {}));
</script>

<div {...mergedRootProps}>
	{@render children?.(rootState.snippetProps)}

	<div {...mergedInputWrapperProps}>
		<input {...mergedInputProps} />
	</div>
</div>
