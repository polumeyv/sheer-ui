<script lang="ts">
	import { join } from 'overrule';
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import { AccordionContentState } from '../accordion.svelte.js';
	import type { AccordionContentProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';

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
		<div class={join('pt-0 pb-4', className)}>
			{@render children?.()}
		</div>
	</div>
{/if}
