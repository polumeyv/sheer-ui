<script lang="ts">
	import * as Tooltip from '$lib/components/tooltip/index';
	import { Button } from '$lib/components/button/index';
	import Plus from '@lucide/svelte/icons/plus';

	// Shared positions for the "sides" example.
	const SIDES = ['top', 'right', 'bottom', 'left'] as const;

	// 5 — controlled open state.
	let open = $state(false);
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default (preserves the original demo) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Hover or focus the trigger to reveal it.</p>
		</div>
		<Tooltip.Provider delayDuration={200}>
			<div class="flex flex-wrap items-center gap-3">
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline">Hover me</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>Add to library</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" size="icon">
								<Plus />
								<span class="sr-only">Add</span>
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content side="right">Create new item</Tooltip.Content>
				</Tooltip.Root>
			</div>
		</Tooltip.Provider>
	</section>

	<!-- 2 — sides -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sides</h3>
			<p class="text-muted-foreground mt-1 text-xs">Place content with the <code>side</code> prop.</p>
		</div>
		<Tooltip.Provider delayDuration={200}>
			<div class="flex flex-wrap items-center gap-3">
				{#each SIDES as side (side)}
					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<Button {...props} variant="outline" size="sm" class="capitalize">{side}</Button>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content {side}>Opens on {side}</Tooltip.Content>
					</Tooltip.Root>
				{/each}
			</div>
		</Tooltip.Provider>
	</section>

	<!-- 3 — instant -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Instant</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				<code>delayDuration={0}</code> shows it with no wait.
			</p>
		</div>
		<Tooltip.Provider delayDuration={0}>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline">No delay</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Appears immediately</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</section>

	<!-- 4 — rich content -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Rich content</h3>
			<p class="text-muted-foreground mt-1 text-xs">Multi-line content with a title and shortcut.</p>
		</div>
		<Tooltip.Provider delayDuration={200}>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline">Keyboard shortcut</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content side="bottom" class="flex flex-col gap-1">
					<span class="font-medium">Save changes</span>
					<span class="text-background/70">
						Press
						<kbd class="bg-background/20 rounded px-1 font-mono">⌘</kbd>
						<kbd class="bg-background/20 rounded px-1 font-mono">S</kbd>
					</span>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</section>

	<!-- 5 — controlled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Controlled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Drive the open state with <code>bind:open</code>.</p>
		</div>
		<Tooltip.Provider delayDuration={200}>
			<div class="flex flex-wrap items-center gap-3">
				<Button variant="secondary" size="sm" onclick={() => (open = !open)}>
					{open ? 'Hide' : 'Show'} tooltip
				</Button>
				<Tooltip.Root bind:open>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline">Target</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content side="top">Toggled from the button</Tooltip.Content>
				</Tooltip.Root>
			</div>
		</Tooltip.Provider>
	</section>

	<!-- 6 — disabled trigger -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled trigger</h3>
			<p class="text-muted-foreground mt-1 text-xs">A disabled trigger never opens the tooltip.</p>
		</div>
		<Tooltip.Provider delayDuration={200}>
			<Tooltip.Root>
				<Tooltip.Trigger disabled>
					{#snippet child({ props })}
						<Button {...props} variant="outline" disabled>Unavailable</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>You won't see this</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</section>
</div>
