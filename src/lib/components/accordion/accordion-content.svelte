<script lang="ts">
	import { mergeProps } from '$lib/vendor';
	import { AccordionContentState } from '$lib/components/accordion/primitive/accordion.svelte';
	import type { AccordionContentProps } from '$lib/components/accordion/primitive/index';
	import { createId } from '$lib/vendor/create-id';
	import { cn, type WithoutChild } from '../../vendor/utils';

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
		forceMount: {
			get current() {
				return forceMount;
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
		hiddenUntilFound: {
			get current() {
				return hiddenUntilFound;
			},
		},
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
