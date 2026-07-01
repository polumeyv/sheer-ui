<script lang="ts">
	import { join } from 'overrule';
	type Tab = { id: string; label: string; href: string };
	let {
		tabs,
		activeTab,
		class: className,
	}: {
		tabs: Tab[];
		activeTab: string;
		class?: string;
	} = $props();
</script>

<div class={join('relative', className)} role="tablist" aria-orientation="horizontal">
	<div class="flex gap-4">
		{#each tabs as tab (tab.id)}
			<a
				href={tab.href}
				role="tab"
				aria-selected={activeTab === tab.id}
				class="relative px-1 pb-2.5 text-sm font-medium transition-colors {activeTab === tab.id
					? 'text-foreground'
					: 'text-muted-foreground hover:text-foreground/80'}">
				{tab.label}
				{#if activeTab === tab.id}
					<span class="tab-indicator absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-foreground"></span>
				{/if}
			</a>
		{/each}
	</div>
	<div class="absolute bottom-0 left-0 right-0 h-px bg-border"></div>
</div>

<style>
	.tab-indicator {
		view-transition-name: tab-indicator;
	}
	@media (prefers-reduced-motion: no-preference) {
		::view-transition-group(tab-indicator) {
			animation-duration: 150ms;
			animation-timing-function: ease-in-out;
		}
	}
</style>
