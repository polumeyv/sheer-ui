<script lang="ts" module>
	import { cn } from '../../vendor/utils';
	import { navigationMenuTriggerStyle } from './variants';
	export { navigationMenuTriggerStyle };
</script>

<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { NavigationMenuTriggerProps } from '$lib/components/navigation-menu/primitive/index';
	import { NavigationMenuTriggerState } from '$lib/components/navigation-menu/primitive/navigation-menu.svelte';
	import { createId } from '$lib/vendor/create-id';
	import VisuallyHidden from '$lib/components/_shared/utilities/visually-hidden/visually-hidden.svelte';
	import Mounted from '$lib/components/_shared/utilities/mounted.svelte';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	const uid = $props.id();

	let {
		id = createId(uid),
		disabled = false,
		children,
		child,
		ref = $bindable(null),
		tabindex = 0,
		class: className,
		...restProps
	}: NavigationMenuTriggerProps = $props();

	const triggerState = NavigationMenuTriggerState.create({
		id: { get current() { return id; } },
		disabled: { get current() { return disabled ?? false; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'navigation-menu-trigger',
				class: cn(navigationMenuTriggerStyle(), 'group', className),
			},
			restProps,
			triggerState.props,
			{ tabindex }
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}

		<ChevronDownIcon
			class="relative top-[1px] ms-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
			aria-hidden="true"
		/>
	</button>
{/if}

{#if triggerState.open}
	<VisuallyHidden {...triggerState.focusProxyProps} />
	<Mounted bind:mounted={triggerState.focusProxyMounted} />
	{#if triggerState.context.viewportRef.current}
		<span aria-owns={triggerState.itemContext.contentId ?? undefined}></span>
	{/if}
{/if}
