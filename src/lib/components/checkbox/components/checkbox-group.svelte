<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { CheckboxGroupProps } from '../types.js';
	import { CheckboxGroupState } from '../checkbox.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		value = $bindable([]),
		onValueChange = () => {},
		required,
		disabled,
		children,
		child,
		readonly,
		...restProps
	}: CheckboxGroupProps = $props();

	const groupState = CheckboxGroupState.create({
		get id() {
			return id;
		},
		get disabled() {
			return Boolean(disabled);
		},
		get required() {
			return Boolean(required);
		},
		get readonly() {
			return Boolean(readonly);
		},
		get value() {
			return $state.snapshot(value);
		},
		set value(v) {
			value = $state.snapshot(v);
			onValueChange(v);
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
