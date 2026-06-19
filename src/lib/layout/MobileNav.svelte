<script lang="ts">
	import { Button } from "$lib/components/button";
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Plus from '@lucide/svelte/icons/plus';
	import { cn } from "$lib/utils.js";

	interface Props {
		navLinks: { href: string; label: string; children?: { href: string; label: string }[] }[];
		/** Action buttons rendered at the bottom of the panel (e.g. login / book). */
		actions?: { href: string; label: string; variant?: 'default' | 'outline' | 'ghost' | 'card' | 'secondary' }[];
		/** Optional extra classes on the trigger button. */
		class?: string;
		/** Unique id for the popover. Defaults to a stable value; override if mounting multiple instances. */
		id?: string;
	}

	let { navLinks, actions = [], class: className, id = 'polumeyv-mobile-nav' }: Props = $props();

	let open = $state(false);

	function closePopover() {
		document.getElementById(id)?.hidePopover();
	}
</script>

<button
	type="button"
	popovertarget={id}
	aria-expanded={open}
	aria-label={open ? 'Close menu' : 'Open menu'}
	class={cn('hamburger md:hidden inline-flex size-10 items-center justify-center', className)}>
	<span class="bar bar-top"></span>
	<span class="bar bar-mid"></span>
	<span class="bar bar-bot"></span>
</button>

<div
	{id}
	popover="auto"
	ontoggle={(e) => (open = (e as ToggleEvent).newState === 'open')}
	class="mobile-nav-popover bg-background text-foreground md:hidden">
	<nav class="flex-1 overflow-y-auto px-6 py-4">
		<ul class="list-none p-0 m-0">
			{#each navLinks as link (link.href)}
				<li class="border-b border-border/40">
					{#if link.children && link.children.length > 0}
						<details>
							<summary class="flex cursor-pointer items-center justify-between py-4 text-lg font-medium">
								<span>{link.label}</span>
								<Plus class="details-icon size-5 transition-transform duration-300" />
							</summary>
							<ul class="list-none p-0 m-0 pb-2">
								{#each link.children as child (child.href)}
									<li>
										<a
											href={child.href}
											onclick={closePopover}
											class="flex items-center justify-between py-3 pl-4 text-base text-muted-foreground transition-colors hover:text-foreground">
											<span>{child.label}</span>
											<ChevronRight class="size-4" />
										</a>
									</li>
								{/each}
							</ul>
						</details>
					{:else}
						<a
							href={link.href}
							onclick={closePopover}
							class="flex items-center justify-between py-4 text-lg font-medium transition-colors hover:text-muted-foreground">
							<span>{link.label}</span>
							<ChevronRight class="size-5" />
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>

	{#if actions.length > 0}
		<div class="flex flex-col gap-3 border-t border-border/40 px-6 py-4">
			{#each actions as action (action.href)}
				<Button href={action.href} variant={action.variant ?? 'default'} onclick={closePopover}>
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

	.bar-top { top: calc(50% - 6px); }
	.bar-mid { top: 50%; }
	.bar-bot { top: calc(50% + 6px); }

	.hamburger[aria-expanded='true'] .bar-top { top: 50%; transform: rotate(45deg); }
	.hamburger[aria-expanded='true'] .bar-mid { opacity: 0; }
	.hamburger[aria-expanded='true'] .bar-bot { top: 50%; transform: rotate(-45deg); }

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
	}

	.mobile-nav-popover:popover-open {
		display: flex;
		flex-direction: column;
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
