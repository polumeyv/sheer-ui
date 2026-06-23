<script lang="ts">
	import './layout.css';
	import * as Sidebar from '$lib/components/sidebar/index.js';
	import { ModeWatcher, ThemeToggle } from '$lib/components/theme-toggle/index.js';
	import AppSidebar from './components/_app-sidebar.svelte';

	let { children } = $props();
</script>

<ModeWatcher />

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="bg-background/80 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
			<Sidebar.Trigger class="-ml-1" />
			<span class="text-sm font-semibold">Component demo</span>
			<div class="ml-auto">
				<ThemeToggle />
			</div>
		</header>
		<main class="flex-1 p-6 md:p-8">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
