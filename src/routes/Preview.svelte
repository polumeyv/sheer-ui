<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="flex min-h-[24rem] w-full items-center justify-center rounded-xl border border-border bg-background p-10"
>
	{@render children()}
</div>
