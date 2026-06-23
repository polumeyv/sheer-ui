<script lang="ts" module>
	import { declareVariants } from 'overrule';

	export const navigationMenuTriggerStyle = declareVariants({
		base: 'hover:bg-muted focus:bg-muted data-open:hover:bg-muted data-open:focus:bg-muted data-open:bg-muted/50 focus-visible:ring-ring/50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:outline-1 disabled:opacity-50 group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center outline-none disabled:pointer-events-none',
	});
</script>

<script lang="ts">
	import { boxWith, mountedAttachment } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	import type { NavigationMenuTriggerProps } from '../types.js';
	import { NavigationMenuTriggerState } from '../navigation-menu.svelte.js';

	import VisuallyHidden from '../../utilities/visually-hidden/visually-hidden.svelte';

	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '$lib/utils.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		disabled = false,
		children,
		child,
		ref = $bindable(null),
		class: className,
		tabindex = 0,
		...restProps
	}: NavigationMenuTriggerProps & {
		class?: string;
	} = $props();

	const triggerState = NavigationMenuTriggerState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled ?? false),
		ref: boxWith(
			() => ref,
			(value) => (ref = value),
		),
	});

	const triggerClass = $derived(cn(navigationMenuTriggerStyle(), 'group', className));

	const mergedProps = $derived(
		mergeProps(
			restProps,
			{
				'data-slot': 'navigation-menu-trigger',
				class: triggerClass,
			},
			triggerState.props,
			{ tabindex },
		),
	);

	const mounted = mountedAttachment<HTMLElement>((m) => (triggerState.focusProxyMounted = m));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}

		<ChevronDownIcon
			class="relative top-px ml-1 size-3 transition duration-300 group-data-open/navigation-menu-trigger:rotate-180 group-data-popup-open/navigation-menu-trigger:rotate-180"
			aria-hidden="true" />
	</button>
{/if}

{#if triggerState.open}
	<VisuallyHidden {...mergeProps(triggerState.focusProxyProps, mounted)} />

	{#if triggerState.context.viewportRef.current}
		<span aria-owns={triggerState.itemContext.contentId ?? undefined}></span>
	{/if}
{/if}
