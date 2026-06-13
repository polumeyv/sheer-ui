<script lang="ts">
	import { mergeProps } from '$lib/internal/merge-props.js';
	import type { AccordionHeaderProps, AccordionTriggerProps } from '$lib/components/accordion/primitive/index.js';
	import {
		AccordionHeaderState,
		AccordionTriggerState,
	} from '$lib/components/accordion/primitive/accordion.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { cn, type WithoutChild } from '../../vendor/utils';

	const uid = $props.id();

	let {
		disabled = false,
		ref = $bindable(null),
		id = createId(uid),
		tabindex = 0,
		class: className,
		level = 3,
		children,
		...restProps
	}: WithoutChild<AccordionTriggerProps> & {
		level?: AccordionHeaderProps['level'];
	} = $props();

	const headerId = createId('header', uid);
	let headerRef = $state<HTMLElement | null>(null);

	const headerState = AccordionHeaderState.create({
		id: {
			get current() {
				return headerId;
			},
		},
		level: {
			get current() {
				return level;
			},
		},
		ref: {
			get current() {
				return headerRef;
			},
			set current(v) {
				headerRef = v;
			},
		},
	});

	const triggerState = AccordionTriggerState.create({
		disabled: {
			get current() {
				return disabled;
			},
		},
		id: {
			get current() {
				return id;
			},
		},
		tabindex: {
			get current() {
				return tabindex ?? 0;
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

	const headerProps = $derived(mergeProps({ class: 'flex' }, headerState.props));

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'accordion-trigger',
				class: cn(
					'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-start text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
					className,
				),
			},
			restProps,
			triggerState.props,
		),
	);
</script>

<div {...headerProps}>
	<button type="button" {...mergedProps}>
		{@render children?.()}
		<ChevronDownIcon class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
	</button>
</div>
