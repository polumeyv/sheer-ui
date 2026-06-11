<script lang="ts">
	import Separator from '$lib/components/separator/separator.svelte';
	import { ThemeToggle } from '$lib/components/theme-toggle';
	import type { Component } from 'svelte';

	type NavLink = { href: string; label: string };
	type SocialLink = { href: string; label: string; icon: Component<{ class?: string }> };

	type Props = {
		brandHref?: string;
		copyright?: string;
		navLinks?: NavLink[];
		legalLinks?: NavLink[];
		socialLinks?: SocialLink[];
	};

	let {
		brandHref = '/',
		copyright = `© ${new Date().getFullYear()} POLUMEYV LLC`,
		navLinks = [],
		legalLinks = [],
		socialLinks = [],
	}: Props = $props();
</script>

<Separator />

<footer class="p-10 max-w-7xl mx-auto w-full mb-10">
	<div class="p-5 flex flex-col gap-5">
		<div class="flex flex-col gap-15 lg:flex-row w-full justify-between lg:items-end">
			<div class="flex flex-col gap-2 justify-end">
				<a class="text-sm text-muted-foreground font-bold tracking-wide transition-colors duration-300 hover:text-foreground" href={brandHref}>BY POLUMEYV</a>
				<p class="text-xs text-muted-foreground font-thin tracking-wide">{copyright}</p>
			</div>
			{#if navLinks.length > 0 || legalLinks.length > 0}
				<div
					class="flex flex-col md:flex-row md:items-center md:mb-0 mb-8 md:h-6 gap-5 text-sm text-muted-foreground [&:has(a:hover)_a:not(:hover)]:text-muted-foreground/40">
					{#if navLinks.length > 0}
						<div class="flex gap-5">
							{#each navLinks as link (link.href)}
								<a href={link.href} class="transition-colors duration-300 hover:text-foreground!">{link.label}</a>
							{/each}
						</div>
					{/if}
					{#if navLinks.length > 0 && legalLinks.length > 0}
						<Separator orientation="vertical" class="hidden md:block" />
					{/if}
					{#if legalLinks.length > 0}
						<div class="flex gap-5">
							{#each legalLinks as link (link.href)}
								<a href={link.href} class="transition-colors duration-300 hover:text-foreground!">{link.label}</a>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
		<Separator />
		<div class="flex w-full justify-between">
			<div class="flex gap-6 text-sm text-muted-foreground [&_a]:hover:text-foreground">
				{#each socialLinks as link (link.href)}
					{const Icon = link.icon}
					<a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
						<Icon class="size-5" />
					</a>
				{/each}
			</div>
			<ThemeToggle variant="outline" />
		</div>
	</div>
</footer>
