<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/index.js';
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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		inputRef: boxWith(
			() => inputRef,
			(v) => (inputRef = v)
		),
		inputId: boxWith(() => inputId),
		autocomplete: boxWith(() => autocomplete),
		maxLength: boxWith(() => maxlength),
		textAlign: boxWith(() => textalign),
		disabled: boxWith(() => disabled),
		inputmode: boxWith(() => inputmode),
		pattern: boxWith(() => pattern),
		onComplete: boxWith(() => onComplete),
		value: boxWith(
			() => String(value),
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		pushPasswordManagerStrategy: boxWith(() => pushPasswordManagerStrategy),
		pasteTransformer: boxWith(() => pasteTransformer),
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
