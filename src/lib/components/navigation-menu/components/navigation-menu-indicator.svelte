<script lang="ts">
	import { join } from 'overrule';
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';

	import type { NavigationMenuIndicatorProps } from '../types.js';
	import { NavigationMenuIndicatorState } from '../navigation-menu.svelte.js';
	import NavigationMenuIndicatorImpl from './navigation-menu-indicator-impl.svelte';

	import Portal from '../../utilities/portal/portal.svelte';
	import PresenceLayer from '../../utilities/presence-layer/presence-layer.svelte';

	import { createId } from '$lib/internal/create-id.js';
	import { getDataTransitionAttrs } from '$lib/internal/attrs.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		children,
		child,
		forceMount = false,
		...restProps
	}: NavigationMenuIndicatorProps & {
		class?: string;
	} = $props();

	const indicatorState = NavigationMenuIndicatorState.create();

	const indicatorClass = $derived(
		join(
			'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in',
			className,
		),
	);

	const mergedProps = $derived(
		mergeProps(restProps, {
			'data-slot': 'navigation-menu-indicator',
			class: indicatorClass,
		}),
	);
</script>

{#if indicatorState.context.indicatorTrackRef.current}
	<Portal to={indicatorState.context.indicatorTrackRef.current}>
		<PresenceLayer open={forceMount || indicatorState.isVisible} ref={boxWith(() => ref)}>
			{#snippet presence({ transitionStatus })}
				<NavigationMenuIndicatorImpl {...mergeProps(mergedProps, getDataTransitionAttrs(transitionStatus))} {id} bind:ref {child}>
					{#snippet children()}
						{#if children}
							{@render children()}
						{:else}
							<div class="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md"></div>
						{/if}
					{/snippet}
				</NavigationMenuIndicatorImpl>
			{/snippet}
		</PresenceLayer>
	</Portal>
{/if}
