<script lang="ts">
	import { join } from 'overrule';
	import { OpenCell } from '../internal/open-cell.svelte.js';
	import type { ClassValue } from 'svelte/elements';
	import { Button } from '../components/button';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Plus from '@lucide/svelte/icons/plus';

	interface Props {
		navLinks: { href: string; label: string; children?: { href: string; label: string }[] }[];
		/** Action buttons rendered at the bottom of the panel (e.g. login / book). */
		actions?: {
			href: string;
			label: string;
			variant?: 'default' | 'outline' | 'ghost' | 'card' | 'secondary';
			size?: 'default' | 'sm' | 'lg' | 'icon';
		}[];
		/** Derivation source for the menu's open state. Not bindable. */
		open?: boolean;
		/** A caller-constructed cell used instead of building one from `open`. */
		state?: OpenCell;
		/** Unique id for the popover. Override if mounting multiple instances. */
		id?: string;
		/** Optional extra classes on the trigger button. */
		class?: ClassValue;
	}

	let { navLinks, actions = [], open = false, state: givenCell, id = 'mobile-nav', class: className }: Props = $props();

	// svelte-ignore state_referenced_locally
	const cell = givenCell ?? new OpenCell(() => open);

	let panel: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!panel) return;
		if (cell.open && !panel.matches(':popover-open')) {
			panel.showPopover();
		} else if (!cell.open && panel.matches(':popover-open')) {
			panel.hidePopover();
		}
	});

	function closePopover() {
		panel?.hidePopover();
	}
</script>

<button
	type="button"
	popovertarget={id}
	aria-expanded={cell.open}
	aria-label={cell.open ? 'Close menu' : 'Open menu'}
	class={join(
		'hamburger md:hidden inline-grid size-10 place-items-center relative z-50 bg-transparent border-0 cursor-pointer text-current',
		className,
	)}>
	<span class="bar bar-top"></span>
	<span class="bar bar-mid"></span>
	<span class="bar bar-bot"></span>
</button>

<div
	{id}
	bind:this={panel}
	popover="auto"
	ontoggle={(e) => (cell.open = (e as ToggleEvent).newState === 'open')}
	class="mobile-nav-popover bg-sidebar text-foreground md:hidden">
	<nav class="flex-1 overflow-y-auto px-8 pt-2">
		<ul class="list-none p-0 m-0">
			{#each navLinks as link (link.href)}
				<li class="border-b border-border">
					{#if link.children && link.children.length > 0}
						<details>
							<summary
								class="flex cursor-pointer items-center justify-between py-6 text-3xl pr-5 font-medium tracking-tight transition-colors hover:text-muted-foreground">
								<span>{link.label}</span>
								<Plus class="details-icon size-6 transition-transform duration-300" />
							</summary>
							<ul class="list-none p-0 m-0 pb-2">
								{#each link.children as child (child.href)}
									<li>
										<a
											href={child.href}
											onclick={closePopover}
											class="flex items-center justify-between py-3 pl-4 text-xl text-muted-foreground transition-colors hover:text-foreground">
											<span>{child.label}</span>
											<ChevronRight class="size-5 opacity-60" />
										</a>
									</li>
								{/each}
							</ul>
						</details>
					{:else}
						<a
							href={link.href}
							onclick={closePopover}
							class="flex items-center justify-between py-6 text-3xl pr-5 font-medium tracking-tight transition-colors hover:text-muted-foreground">
							<span>{link.label}</span>
							<ArrowUpRight class="size-6 opacity-60" />
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>

	{#if actions.length > 0}
		<div class="px-6 py-6 flex flex-col gap-3">
			{#each actions as action (action.href)}
				<Button href={action.href} variant={action.variant ?? 'default'} size={action.size ?? 'lg'} onclick={closePopover}>
					{action.label}
				</Button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.hamburger {
		position: relative;
	}

	.bar {
		position: absolute;
		left: 50%;
		width: 1.25rem;
		height: 2px;
		background-color: currentColor;
		border-radius: 2px;
		transform-origin: center;
		transition:
			transform 300ms cubic-bezier(0.19, 1, 0.22, 1),
			top 300ms cubic-bezier(0.19, 1, 0.22, 1),
			opacity 200ms ease;
		margin-left: -0.625rem;
	}

	.bar-top {
		top: calc(50% - 6px);
	}
	.bar-mid {
		top: 50%;
	}
	.bar-bot {
		top: calc(50% + 6px);
	}

	.hamburger[aria-expanded='true'] .bar-top {
		top: 50%;
		transform: rotate(45deg);
	}
	.hamburger[aria-expanded='true'] .bar-mid {
		opacity: 0;
	}
	.hamburger[aria-expanded='true'] .bar-bot {
		top: 50%;
		transform: rotate(-45deg);
	}

	.mobile-nav-popover {
		position: fixed;
		inset: 5rem 0 0 0;
		width: 100%;
		height: calc(100dvh - 5rem);
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 0;
		border: none;
		overflow: hidden;
		/* Rendered even while closed (overriding the UA popover display:none): WebKit lacks `overlay` and
		   yanks a closing popover to display:none instantly, so the exit animation must not involve display.
		   visibility (delayed to the transition's end) does the hiding instead. */
		display: flex;
		flex-direction: column;
		visibility: hidden;
		clip-path: inset(0 0 100% 0);
		transition:
			clip-path 500ms ease-in-out,
			visibility 0s 500ms;
	}

	.mobile-nav-popover:popover-open {
		visibility: visible;
		clip-path: inset(0 0 0 0);
		transition: clip-path 500ms ease-in-out;
	}

	:global(html:has(.mobile-nav-popover:popover-open)) {
		overflow: hidden;
	}

	summary {
		list-style: none;
	}
	summary::-webkit-details-marker {
		display: none;
	}

	details[open] summary :global(.details-icon) {
		transform: rotate(45deg);
	}
</style>
