<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title = '', children }: { title?: string; children: Snippet } = $props();
</script>

<div class="overflow-hidden rounded-xl border">
	<div class="flex items-center gap-3 border-b bg-muted/30 px-4 py-2">
		<div class="flex gap-1.5">
			<div class="size-2.5 rounded-full bg-muted-foreground/15"></div>
			<div class="size-2.5 rounded-full bg-muted-foreground/15"></div>
			<div class="size-2.5 rounded-full bg-muted-foreground/15"></div>
		</div>
		<div class="mx-auto max-w-xs flex-1 rounded-md bg-muted/50 px-3 py-0.5 text-center">
			<span class="truncate text-xs text-muted-foreground/60">{title || ''}</span>
		</div>
		<div class="w-[36px]"></div>
	</div>
	<div>
		{@render children()}
	</div>
</div>
