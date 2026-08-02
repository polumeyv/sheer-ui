<script lang="ts" generics="T extends string">
	import type { Component } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { join } from 'overrule';

	type Tab<T extends string> = {
		id: T;
		label: string;
		href?: string;
		icon?: Component<{ class?: string }>;
	};

	let {
		title,
		tabs,
		activeTab,
		class: className,
	}: {
		title?: string;
		tabs?: readonly Tab<T>[];
		activeTab?: T;
		class?: ClassValue;
	} = $props();

	let tabEls = $state<Partial<Record<T, HTMLElement>>>({});

	const indicator = $derived.by(() => {
		const el = activeTab ? tabEls[activeTab] : undefined;
		if (!el) return { x: 0, width: 0 };
		return { x: el.offsetLeft, width: el.offsetWidth };
	});
</script>

<div
	data-slot="heading"
	class={join(
		'w-full has-data-[slot=heading-nav]:mb-6',
		'[&:not(:has([data-slot=heading-nav]))]:mb-2 [&:not(:has([data-slot=heading-nav]))]:md:mb-4 [&:not(:has([data-slot=heading-nav]))]:lg:mb-6',
		className,
	)}>
	{#if title !== undefined}
		<div
			data-slot="heading-title"
			class={join(
				'flex flex-wrap items-center justify-between gap-4',
				'has-[~[data-slot=heading-nav]]:pb-6',
				'[&:not(:has(~[data-slot=heading-nav]))]:pb-4 [&:not(:has(~[data-slot=heading-nav]))]:border-b [&:not(:has(~[data-slot=heading-nav]))]:border-border',
			)}>
			<h1 class="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
		</div>
	{/if}
	{#if tabs && tabs.length > 0}
		<nav data-slot="heading-nav" class="w-full border-b mb-2 md:mb-4 lg:mb-6 min-h-9 inline-flex">
			<div role="tablist" aria-orientation="horizontal" class="relative flex">
				{#each tabs as tab (tab.id)}
					{const isActive = $derived(activeTab === tab.id)}
					{const Icon = tab.icon}

					<svelte:element
						this={tab.href ? 'a' : 'button'}
						bind:this={tabEls[tab.id]}
						href={tab.href}
						type={!tab.href ? 'button' : undefined}
						role="tab"
						aria-selected={isActive}
						aria-current={tab.href && isActive ? 'page' : undefined}
						tabindex={isActive ? 0 : -1}
						class={join(
							'relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
							isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
						)}>
						{#if Icon}<Icon class="size-4" />{/if}
						{tab.label}
					</svelte:element>
				{/each}

				<div
					role="presentation"
					class="absolute bottom-0 left-0 h-0.5 bg-primary transition-[transform,width] duration-200 ease-out motion-reduce:transition-none"
					style:transform="translateX({indicator.x}px)"
					style:width="{indicator.width}px">
				</div>
			</div>
		</nav>
	{/if}
</div>
