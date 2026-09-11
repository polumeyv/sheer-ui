<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import { DialogCloseState } from '../dialog.svelte.js';
	import type { DialogCloseProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { children, child, id = createId(uid), ref = $bindable(null), disabled = false, ...restProps }: DialogCloseProps = $props();

	const closeState = DialogCloseState.create({
		variant: 'close',
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

	const mergedProps = $derived(mergeProps({ 'data-slot': 'dialog-close' }, restProps, closeState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
