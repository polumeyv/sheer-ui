<script lang="ts">
	import { mergeProps } from "$lib/internal/merge-props.js";
	import type { SwitchRootProps } from "$lib/components/switch/primitive/index.js";
	import { SwitchRootState } from "$lib/components/switch/primitive/switch.svelte.js";
	import SwitchInput from "$lib/components/switch/primitive/components/switch-input.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		disabled = false,
		required = false,
		checked = $bindable(false),
		value = "on",
		name = undefined,
		type = "button",
		onCheckedChange = (() => {}),
		...restProps
	}: SwitchRootProps = $props();

	const rootState = SwitchRootState.create({
		checked: {
			get current() {
				return checked;
			},
			set current(v) {
				checked = v;
				onCheckedChange?.(v);
			},
		},
		disabled: {
			get current() {
				return disabled ?? false;
			},
		},
		required: {
			get current() {
				return required;
			},
		},
		value: {
			get current() {
				return value;
			},
		},
		name: {
			get current() {
				return name;
			},
		},
		id: {
			get current() {
				return id;
			},
		},
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</button>
{/if}

<SwitchInput />
