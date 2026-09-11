<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import { DialogTriggerState } from '../dialog.svelte.js';
	import type { DialogTriggerProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), children, child, disabled = false, ...restProps }: DialogTriggerProps = $props();

	const triggerState = DialogTriggerState.create({
		get id() {
			return id;
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
		get disabled() {
			return Boolean(disabled);
		},
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
