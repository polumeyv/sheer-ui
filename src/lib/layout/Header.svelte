<script lang="ts">
	import { Button } from "../components/button";
	import MobileDropdown from './MobileDropdown.svelte';

	type NavLink = { href: string; label: string };
	type ActionButton = {
		href: string;
		label: string;
		variant?: 'default' | 'outline' | 'ghost' | 'card' | 'secondary';
	};

	interface Props {
		brand: string;
		brandHref?: string;
		navLinks?: NavLink[];
		actions?: ActionButton[];
		mobileActions?: ActionButton[];
		showBorder?: boolean;
		mobileId?: string;
	}

	let {
		brand,
		brandHref = '/',
		navLinks = [],
		actions = [],
		mobileActions,
		showBorder = false,
		mobileId = 'mobile-nav',
	}: Props = $props();

	let mobileOpen = $state(false);
</script>

<div
	class="py-4 sticky top-0 justify-center items-center flex z-50 transition-colors duration-500 ease-in-out {showBorder
		? 'border-b'
		: ''} {mobileOpen ? 'bg-transparent' : 'bg-background'}">
	<div class="flex w-full relative">
		<div class="flex w-full justify-between relative z-50 max-w-7xl mx-auto px-8">
			<a href={brandHref} onclick={() => (mobileOpen = false)} class="text-xl flex items-center relative z-50">{brand}</a>
			<nav>
				<div class="flex justify-end justify-self-end gap-2">
					<ul class="hidden md:flex grow list-none mx-5 gap-2">
						{#each navLinks as link (link.href)}
							<li class="self-center">
								<a href={link.href} class="p-3 font-medium text-sm">
									{link.label}
								</a>
							</li>
						{/each}
						{#each actions as action (action.href)}
							<li>
								<Button variant={action.variant ?? 'default'} class="hidden md:inline-flex" href={action.href}>
									{action.label}
								</Button>
							</li>
						{/each}
					</ul>
				</div>
			</nav>

			<MobileDropdown {navLinks} actions={mobileActions ?? actions} bind:open={mobileOpen} id={mobileId} />
		</div>
	</div>
</div>
