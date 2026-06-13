<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { AccordionItemProps } from '$lib/bits/accordion/types.js';
	import { AccordionItemState } from '$lib/bits/accordion/accordion.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../utils';

	const uid = $props.id();
	const defaultId = createId(uid);

	let {
		id = defaultId,
		disabled = false,
		value = defaultId,
		class: className,
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: AccordionItemProps = $props();

	const itemState = AccordionItemState.create({
		value: boxWith(() => value),
		disabled: boxWith(() => disabled),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{ 'data-slot': 'accordion-item', class: cn('border-b last:border-b-0', className) },
			restProps,
			itemState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
