<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from './Header.svelte';
	import Sidebar from './Sidebar.svelte';

	let { children } = $props();
</script>

<ModeWatcher />

<div class="min-h-screen bg-background text-foreground">
	<Header />
	<div class="mx-auto flex w-full max-w-screen-2xl">
		<aside
			class="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border md:block"
		>
			<Sidebar />
		</aside>
		<main class="min-w-0 flex-1 px-4 py-8 sm:px-8">
			{@render children()}
		</main>
	</div>
</div>
