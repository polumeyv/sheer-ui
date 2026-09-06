<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import * as Tooltip from '../tooltip';
	import { join } from 'overrule';
	import type { WithElementRef } from '../../internal/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { SIDEBAR_COOKIE_MAX_AGE, SIDEBAR_COOKIE_NAME, SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from './constants';
	import { setSidebar, SidebarState } from './context.svelte';
	import { OpenCell } from '../../internal/open-cell.svelte.js';
	import type { Snippet } from 'svelte';

	let {
		ref = $bindable(null),
		open = true,
		state: givenCell,
		class: className,
		style,
		children,
		...restProps
	}: Omit<WithElementRef<HTMLAttributes<HTMLDivElement>>, 'children'> & {
		/** Derivation source for the sidebar's open state. Not bindable. */
		open?: boolean;
		/** A caller-constructed cell used instead of building one from `open`. */
		state?: OpenCell;
		/** Children receive the state cell, typed and guaranteed within the tree. */
		children?: Snippet<[OpenCell]>;
	} = $props();

	// svelte-ignore state_referenced_locally
	const cell = givenCell ?? new OpenCell(() => open);

	const sidebar = setSidebar(
		new SidebarState({
			open: () => cell.open,
			setOpen: (value: boolean) => {
				cell.open = value;

				// This sets the cookie to keep the sidebar state.
				document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
			},
		}),
	);

	// Closes the mobile sidebar on navigation, since clicking a nav link doesn't dismiss it.
	// The sheet is only ever open on a phone, so no viewport check.
	beforeNavigate(sidebar.closeSheet);
</script>

<svelte:window onkeydown={sidebar.handleShortcutKeydown} />

<Tooltip.Provider delayDuration={0}>
	<div
		data-slot="sidebar-wrapper"
		style="--sidebar-width: {SIDEBAR_WIDTH}; --sidebar-width-icon: {SIDEBAR_WIDTH_ICON}; {style}"
		class={join('group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full', className)}
		bind:this={ref}
		{...restProps}>
		{@render children?.(cell)}
	</div>
</Tooltip.Provider>
