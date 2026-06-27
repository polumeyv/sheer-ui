<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title = 'Reminder',
		message = 'You have an upcoming appointment',
		time = 'now',
		icon,
	}: {
		title?: string;
		message?: string;
		time?: string;
		icon?: Snippet;
	} = $props();
</script>

<div class="rounded-2xl border bg-card p-3 shadow-sm">
	<div class="flex items-start gap-3">
		<!-- Icon area -->
		{#if icon}
			<div class="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
				{@render icon()}
			</div>
		{/if}

		<!-- Content -->
		<div class="min-w-0 flex-1">
			<p class="truncate text-sm font-semibold text-foreground">{title}</p>
			<p class="mt-0.5 text-xs text-muted-foreground">{message}</p>
		</div>

		<!-- Time -->
		<span class="shrink-0 text-[10px] text-muted-foreground/70">{time}</span>
	</div>
</div>
