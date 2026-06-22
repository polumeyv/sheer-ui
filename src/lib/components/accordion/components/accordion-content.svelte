<script lang="ts">
	import { mergeProps, boxWith } from '$lib/internal/toolbelt.js';
	import { AccordionContentState } from '../accordion.svelte.js';
	import type { AccordionContentProps } from '../types.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '$lib/utils.js';

	const uid = $props.id();

	let {
		child,
		ref = $bindable(null),
		id = createId(uid),
		forceMount = false,
		children,
		hiddenUntilFound = false,
		class: className,
		...restProps
	}: AccordionContentProps = $props();

	const contentState = AccordionContentState.create({
		forceMount: boxWith(() => forceMount),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
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

{#if child}
	{@render child({
		props: mergedProps,
		...contentState.snippetProps,
	})}
{:else}
	<div {...mergedProps}>
		<div class={cn('pt-0 pb-4', className)}>
			{@render children?.()}
		</div>
	</div>
{/if}
