<script lang="ts">
	import { mergeProps, boxWith } from '$lib/vendor/toolbelt/index.js';
	import { AccordionContentState } from '$lib/bits/accordion/accordion.svelte.js';
	import type { AccordionContentProps } from '$lib/bits/accordion/types.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn, type WithoutChild } from '../../utils';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		forceMount = false,
		class: className,
		children,
		hiddenUntilFound = false,
		...restProps
	}: WithoutChild<AccordionContentProps> = $props();

	const contentState = AccordionContentState.create({
		forceMount: boxWith(() => forceMount),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		hiddenUntilFound: boxWith(() => hiddenUntilFound),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'accordion-content',
				class: 'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm',
			},
			restProps,
			contentState.props,
		),
	);
</script>

<div {...mergedProps}>
	<div class={cn('pt-0 pb-4', className)}>
		{@render children?.()}
	</div>
</div>
