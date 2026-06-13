<script lang="ts">
	import { Button } from '../components/button';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { cn } from '../vendor/utils.js';

	interface Props {
		navLinks: { href: string; label: string }[];
		actions?: {
			href: string;
			label: string;
			variant?: 'default' | 'outline' | 'ghost' | 'card' | 'secondary';
			size?: 'default' | 'sm' | 'lg' | 'icon';
		}[];
		open?: boolean;
		id?: string;
		class?: string;
	}

	let {
		navLinks,
		actions = [],
		open = $bindable(false),
		id = 'mobile-dropdown',
		class: className
	}: Props = $props();

	function close() {
		open = false;
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (open = false)} />

<button
	type="button"
	onclick={() => (open = !open)}
	aria-expanded={open}
	aria-controls={id}
	aria-label={open ? 'Close menu' : 'Open menu'}
	class={cn(
		'group md:hidden inline-flex size-10 items-center justify-center relative z-50 bg-transparent border-0 cursor-pointer text-current',
		className
	)}
>
	<span
		class="absolute left-1/2 -translate-x-1/2 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] top-[calc(50%-6px)] group-aria-expanded:top-1/2 group-aria-expanded:rotate-45"
	></span>
	<span
		class="absolute left-1/2 -translate-x-1/2 w-5 h-0.5 bg-current rounded-full transition-opacity duration-200 top-1/2 group-aria-expanded:opacity-0"
	></span>
	<span
		class="absolute left-1/2 -translate-x-1/2 w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] top-[calc(50%+6px)] group-aria-expanded:top-1/2 group-aria-expanded:-rotate-45"
	></span>
</button>

<div
	{id}
	inert={!open}
	aria-hidden={!open}
	class="md:hidden fixed inset-0 w-screen h-dvh bg-sidebar text-foreground overflow-y-auto flex flex-col z-40 transition-[clip-path] duration-500 ease-in-out {open
		? '[clip-path:inset(0_0_0_0)]'
		: '[clip-path:inset(0_0_100%_0)]'}"
>
	<div class="h-20 shrink-0"></div>
	<nav class="flex-1 px-8 pt-2">
		<ul class="list-none p-0 m-0">
			{#each navLinks as link (link.href)}
				<li class="border-b border-border">
					<a
						href={link.href}
						onclick={close}
						class="flex items-center justify-between py-6 text-3xl pr-5 font-medium tracking-tight transition-colors hover:text-muted-foreground"
					>
						<span>{link.label}</span>
						<ArrowUpRight class="size-6 opacity-60" />
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	{#if actions.length > 0}
		<div class="px-6 py-6 flex flex-col gap-3">
			{#each actions as action (action.href)}
				<Button
					href={action.href}
					variant={action.variant ?? 'default'}
					size={action.size ?? 'lg'}
					onclick={close}>{action.label}</Button
				>
			{/each}
		</div>
	{/if}
</div>
