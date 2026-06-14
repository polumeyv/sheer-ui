<script lang="ts">
	import * as Item from '$lib/components/item/index';
	import { Button } from '$lib/components/button/index';
	import Bell from '@lucide/svelte/icons/bell';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ShieldAlert from '@lucide/svelte/icons/shield-alert';
	import Plus from '@lucide/svelte/icons/plus';
	import Music from '@lucide/svelte/icons/music';

	// Shared class strings, factored out so each example stays copy-paste sized.
	const AVATAR =
		'bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full border text-xs font-medium';
	const STACKED = `${AVATAR} -ms-2 ring-background ring-2 first:ms-0`;
	const COVER = 'bg-muted flex size-full items-center justify-center';

	const team = ['AB', 'CD', 'EF', 'GH'];

	type Track = { title: string; artist: string };
	const tracks: Track[] = [
		{ title: 'Midnight City', artist: 'M83' },
		{ title: 'Resonance', artist: 'Home' },
		{ title: 'Nightcall', artist: 'Kavinsky' }
	];
</script>

<div class="flex w-full max-w-md flex-col gap-10">
	<!-- 1 — default (icon media + action) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Media, content and trailing actions.</p>
		</div>
		<Item.Group>
			<Item.Root variant="outline">
				<Item.Media variant="icon">
					<Bell />
				</Item.Media>
				<Item.Content>
					<Item.Title>Notifications</Item.Title>
					<Item.Description>Get notified when something needs your attention.</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button variant="ghost" size="icon" aria-label="Open notifications">
						<ChevronRight class="size-4" />
					</Button>
				</Item.Actions>
			</Item.Root>

			<Item.Separator />

			<Item.Root variant="outline">
				<Item.Media variant="icon">
					<CreditCard />
				</Item.Media>
				<Item.Content>
					<Item.Title>Billing</Item.Title>
					<Item.Description>Visa ending in 4242 · Renews on Jul 1, 2026.</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button variant="outline" size="sm">Manage</Button>
				</Item.Actions>
			</Item.Root>
		</Item.Group>
	</section>

	<!-- 2 — variants -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Variants</h3>
			<p class="text-muted-foreground mt-1 text-xs">default, outline and muted.</p>
		</div>
		<div class="flex flex-col gap-3">
			<Item.Root variant="default">
				<Item.Content>
					<Item.Title>Default</Item.Title>
					<Item.Description>Transparent background, no border.</Item.Description>
				</Item.Content>
			</Item.Root>
			<Item.Root variant="outline">
				<Item.Content>
					<Item.Title>Outline</Item.Title>
					<Item.Description>Bordered, transparent background.</Item.Description>
				</Item.Content>
			</Item.Root>
			<Item.Root variant="muted">
				<Item.Content>
					<Item.Title>Muted</Item.Title>
					<Item.Description>Subdued background for secondary content.</Item.Description>
				</Item.Content>
			</Item.Root>
		</div>
	</section>

	<!-- 3 — sizes -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Sizes</h3>
			<p class="text-muted-foreground mt-1 text-xs">sm, default and lg padding.</p>
		</div>
		<div class="flex flex-col gap-3">
			<Item.Root variant="outline" size="sm">
				<Item.Media variant="icon">
					<ShieldAlert />
				</Item.Media>
				<Item.Content>
					<Item.Title>Small</Item.Title>
				</Item.Content>
			</Item.Root>
			<Item.Root variant="outline" size="default">
				<Item.Media variant="icon">
					<ShieldAlert />
				</Item.Media>
				<Item.Content>
					<Item.Title>Default</Item.Title>
				</Item.Content>
			</Item.Root>
			<Item.Root variant="outline" size="lg">
				<Item.Media variant="icon">
					<ShieldAlert />
				</Item.Media>
				<Item.Content>
					<Item.Title>Large</Item.Title>
				</Item.Content>
			</Item.Root>
		</div>
	</section>

	<!-- 4 — avatar group media -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Avatar group</h3>
			<p class="text-muted-foreground mt-1 text-xs">Stacked avatars in the media slot.</p>
		</div>
		<Item.Root variant="outline">
			<Item.Media variant="default">
				<div class="flex">
					{#each team as initials (initials)}
						<span class={STACKED}>{initials}</span>
					{/each}
				</div>
			</Item.Media>
			<Item.Content>
				<Item.Title>Project team</Item.Title>
				<Item.Description>4 members with access to this project.</Item.Description>
			</Item.Content>
			<Item.Actions>
				<Button variant="outline" size="icon" aria-label="Invite member">
					<Plus class="size-4" />
				</Button>
			</Item.Actions>
		</Item.Root>
	</section>

	<!-- 5 — image media list -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Image media</h3>
			<p class="text-muted-foreground mt-1 text-xs">Group of items with artwork.</p>
		</div>
		<Item.Group>
			{#each tracks as track, i (track.title)}
				<Item.Root>
					<Item.Media variant="image">
						<div class={COVER}>
							<Music class="text-muted-foreground size-4" />
						</div>
					</Item.Media>
					<Item.Content>
						<Item.Title>{track.title}</Item.Title>
						<Item.Description>{track.artist}</Item.Description>
					</Item.Content>
				</Item.Root>
				{#if i < tracks.length - 1}
					<Item.Separator />
				{/if}
			{/each}
		</Item.Group>
	</section>

	<!-- 6 — header, footer and clickable link -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Header & footer</h3>
			<p class="text-muted-foreground mt-1 text-xs">A full card with a clickable child.</p>
		</div>
		<Item.Root variant="outline" size="lg">
			{#snippet child({ props })}
				<a href="https://svelte.dev" target="_blank" rel="noreferrer noopener" {...props}>
					<Item.Header>
						<Item.Title>Svelte</Item.Title>
						<ChevronRight class="text-muted-foreground size-4" />
					</Item.Header>
					<Item.Content>
						<Item.Description>
							Cybernetically enhanced web apps. Opens in a new tab.
						</Item.Description>
					</Item.Content>
					<Item.Footer>
						<span class="text-muted-foreground text-xs">svelte.dev</span>
						<span class="text-muted-foreground text-xs">Framework</span>
					</Item.Footer>
				</a>
			{/snippet}
		</Item.Root>
	</section>
</div>
