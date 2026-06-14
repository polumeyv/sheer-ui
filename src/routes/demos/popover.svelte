<script lang="ts">
	import * as Popover from '$lib/components/popover/index';
	import { Button } from '$lib/components/button/index';
	import { Label } from '$lib/components/label/index';
	import { Input } from '$lib/components/input/index';
	import XIcon from '@lucide/svelte/icons/x';
	import SettingsIcon from '@lucide/svelte/icons/settings-2';
	import TrashIcon from '@lucide/svelte/icons/trash-2';

	// Shared class strings, factored out so each example stays copy-paste sized.
	const FIELD = 'grid grid-cols-3 items-center gap-4';
	const CLOSE =
		'ring-offset-background focus-visible:ring-ring absolute end-3 top-3 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none';

	// 2 — controlled open state
	let open = $state(false);

	// 4 — settings with bound state
	let notifications = $state(true);
	let marketing = $state(false);
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default (dimensions form) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">A trigger that reveals a small form.</p>
		</div>
		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Open popover</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-80">
				<div class="grid gap-4">
					<div class="space-y-1">
						<h4 class="text-sm leading-none font-medium">Dimensions</h4>
						<p class="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
					</div>
					<div class="grid gap-2">
						<div class={FIELD}>
							<Label for="width">Width</Label>
							<Input id="width" value="100%" class="col-span-2 h-8" />
						</div>
						<div class={FIELD}>
							<Label for="height">Height</Label>
							<Input id="height" value="25px" class="col-span-2 h-8" />
						</div>
					</div>
				</div>
			</Popover.Content>
		</Popover.Root>
	</section>

	<!-- 2 — controlled + close button -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Controlled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Bound open state with an explicit close.</p>
		</div>
		<Popover.Root bind:open>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>
						{open ? 'Opened' : 'Open'}
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="relative w-80">
				<Popover.Close class={CLOSE} aria-label="Close">
					{#snippet child({ props })}
						<button {...props}>
							<XIcon class="size-4" />
						</button>
					{/snippet}
				</Popover.Close>
				<div class="grid gap-1 pe-6">
					<h4 class="text-sm leading-none font-medium">Share document</h4>
					<p class="text-muted-foreground text-sm">
						Anyone with the link can view this document.
					</p>
				</div>
			</Popover.Content>
		</Popover.Root>
	</section>

	<!-- 3 — positioning (side / align / offset) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Positioning</h3>
			<p class="text-muted-foreground mt-1 text-xs">side, align and sideOffset placement.</p>
		</div>
		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Open right</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content side="right" align="start" sideOffset={8} class="w-64">
				<p class="text-sm">Rendered to the right, aligned to the start edge.</p>
			</Popover.Content>
		</Popover.Root>
	</section>

	<!-- 4 — settings with bound switches -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Icon trigger</h3>
			<p class="text-muted-foreground mt-1 text-xs">Compact trigger with bound toggles.</p>
		</div>
		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" size="icon" aria-label="Settings" {...props}>
						<SettingsIcon class="size-4" />
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-72">
				<div class="grid gap-3">
					<h4 class="text-sm leading-none font-medium">Notifications</h4>
					<label class="flex items-center justify-between gap-4 text-sm">
						Push notifications
						<input type="checkbox" bind:checked={notifications} class="size-4" />
					</label>
					<label class="flex items-center justify-between gap-4 text-sm">
						Marketing emails
						<input type="checkbox" bind:checked={marketing} class="size-4" />
					</label>
				</div>
			</Popover.Content>
		</Popover.Root>
	</section>

	<!-- 5 — open on hover -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Open on hover</h3>
			<p class="text-muted-foreground mt-1 text-xs">Reveals on hover with a short delay.</p>
		</div>
		<Popover.Root>
			<Popover.Trigger openOnHover openDelay={150} closeDelay={150}>
				{#snippet child({ props })}
					<Button variant="link" {...props}>@sveltejs</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-64">
				<div class="grid gap-1">
					<h4 class="text-sm leading-none font-medium">SvelteKit</h4>
					<p class="text-muted-foreground text-sm">The fastest way to build Svelte apps.</p>
				</div>
			</Popover.Content>
		</Popover.Root>
	</section>

	<!-- 6 — destructive confirm -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Destructive</h3>
			<p class="text-muted-foreground mt-1 text-xs">A confirm/cancel action pair.</p>
		</div>
		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button variant="destructive" {...props}>
						<TrashIcon class="size-4" />
						Delete
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-72">
				<div class="grid gap-3">
					<div class="grid gap-1">
						<h4 class="text-sm leading-none font-medium">Delete project?</h4>
						<p class="text-muted-foreground text-sm">This action cannot be undone.</p>
					</div>
					<div class="flex justify-end gap-2">
						<Popover.Close>
							{#snippet child({ props })}
								<Button variant="outline" size="sm" {...props}>Cancel</Button>
							{/snippet}
						</Popover.Close>
						<Popover.Close>
							{#snippet child({ props })}
								<Button variant="destructive" size="sm" {...props}>Delete</Button>
							{/snippet}
						</Popover.Close>
					</div>
				</div>
			</Popover.Content>
		</Popover.Root>
	</section>
</div>
