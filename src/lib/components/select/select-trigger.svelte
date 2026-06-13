<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import { SelectTriggerState } from '$lib/components/select/primitive/select.svelte.js';
	import type { SelectTriggerProps } from '$lib/components/select/primitive/types.js';
	import { createId } from '$lib/internal/create-id.js';
	import { FloatingLayer } from '$lib/components/_shared/utilities/floating-layer/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { cn } from '../../utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		type = 'button',
		class: className,
		size = 'default',
		...restProps
	}: SelectTriggerProps & {
		size?: 'sm' | 'default' | 'lg';
	} = $props();

	const triggerState = SelectTriggerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'select-trigger',
				'data-size': size,
				class: cn(
					"border-input data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none select-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=sm]:h-8 data-[size=default]:h-9 data-[size=lg]:h-11 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
					className,
				),
			},
			restProps,
			triggerState.props,
			{ type }
		)
	);
</script>

<FloatingLayer.Anchor {id} ref={triggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
			<ChevronDownIcon class="size-4 opacity-50" />
		</button>
	{/if}
</FloatingLayer.Anchor>
