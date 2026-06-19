<script lang="ts">
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import type { PinInputRootProps } from "../types.js";
	import { PinInputRootState } from "../pin-input.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { cn } from "$lib/utils.js";

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
		onComplete = () => {},
		pushPasswordManagerStrategy = "increase-width",
		class: className,
		children,
		autocomplete = "one-time-code",
		disabled = false,
		value = $bindable(""),
		onValueChange = () => {},
		pasteTransformer,
		...restProps
	}: PinInputRootProps = $props();

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
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		pushPasswordManagerStrategy: boxWith(() => pushPasswordManagerStrategy),
		pasteTransformer: boxWith(() => pasteTransformer),
	});

	const mergedInputProps = $derived(
		mergeProps({ "data-slot": "pin-input" }, restProps, rootState.inputProps)
	);
	const mergedRootProps = $derived(
		mergeProps(rootState.rootProps, {
			class: cn(
				"flex items-center gap-2 has-disabled:opacity-50 [&_input]:disabled:cursor-not-allowed",
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
