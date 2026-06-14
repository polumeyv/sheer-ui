<script lang="ts">
	import * as Empty from '$lib/components/empty/index';
	import { Button } from '$lib/components/button/index';
	import Search from '@lucide/svelte/icons/search';
	import CloudIcon from '@lucide/svelte/icons/cloud';
	import BellIcon from '@lucide/svelte/icons/bell';
	import MessageCircleIcon from '@lucide/svelte/icons/message-circle';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const AVATAR = 'size-12 shrink-0 rounded-full object-cover grayscale';
	const AVATAR_STACK = 'size-8 shrink-0 rounded-full object-cover ring-2 ring-background grayscale';
	const INPUT =
		'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-full rounded-md border ps-9 pe-3 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none';

	const team = [
		{ name: 'Ada', src: 'https://i.pravatar.cc/96?img=1' },
		{ name: 'Linus', src: 'https://i.pravatar.cc/96?img=12' },
		{ name: 'Grace', src: 'https://i.pravatar.cc/96?img=5' }
	];

	let query = $state('');
</script>

<div class="flex w-full max-w-xl flex-col gap-10">
	<!-- 1 — default: icon media + button group (preserved working example) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Icon media with a title, description and action.</p>
		</div>
		<Empty.Root class="w-full">
			<Empty.Header>
				<Empty.Media variant="icon">
					<Search />
				</Empty.Media>
				<Empty.Title>No results found</Empty.Title>
				<Empty.Description>
					Try adjusting your search or filters to find what you're looking for.
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button variant="outline">Clear filters</Button>
			</Empty.Content>
		</Empty.Root>
	</section>

	<!-- 2 — outline: dashed border + single outline button -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Outline</h3>
			<p class="text-muted-foreground mt-1 text-xs">Dashed bordered card for an empty data state.</p>
		</div>
		<Empty.Root class="w-full border">
			<Empty.Header>
				<Empty.Media variant="icon">
					<CloudIcon />
				</Empty.Media>
				<Empty.Title>No projects yet</Empty.Title>
				<Empty.Description>Create your first project to get started.</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button variant="outline">
					<PlusIcon />
					New project
				</Button>
			</Empty.Content>
		</Empty.Root>
	</section>

	<!-- 3 — background: gradient fill + refresh action -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Background</h3>
			<p class="text-muted-foreground mt-1 text-xs">A subtle gradient behind the empty state.</p>
		</div>
		<Empty.Root class="w-full border bg-gradient-to-b from-muted/50 to-background">
			<Empty.Header>
				<Empty.Media variant="icon">
					<BellIcon />
				</Empty.Media>
				<Empty.Title>You're all caught up</Empty.Title>
				<Empty.Description>No new notifications right now.</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button variant="secondary" size="sm">
					<RefreshCwIcon />
					Refresh
				</Button>
			</Empty.Content>
		</Empty.Root>
	</section>

	<!-- 4 — avatar: single image media (default variant, custom content) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Avatar</h3>
			<p class="text-muted-foreground mt-1 text-xs">Use the default media slot to render an avatar.</p>
		</div>
		<Empty.Root class="w-full border">
			<Empty.Header>
				<Empty.Media>
					<img src={team[0].src} alt={team[0].name} class={AVATAR} />
				</Empty.Media>
				<Empty.Title>No messages yet</Empty.Title>
				<Empty.Description>Say hello to {team[0].name} to start the conversation.</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button size="sm">
					<MessageCircleIcon />
					Send a message
				</Button>
			</Empty.Content>
		</Empty.Root>
	</section>

	<!-- 5 — avatar group: stacked images in the media slot -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Avatar group</h3>
			<p class="text-muted-foreground mt-1 text-xs">Stack several avatars in the media area.</p>
		</div>
		<Empty.Root class="w-full border">
			<Empty.Header>
				<Empty.Media>
					<div class="flex -space-x-2">
						{#each team as member (member.name)}
							<img src={member.src} alt={member.name} class={AVATAR_STACK} />
						{/each}
					</div>
				</Empty.Media>
				<Empty.Title>Build your team</Empty.Title>
				<Empty.Description>Invite teammates to collaborate on this workspace.</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button size="sm">
					<UserPlusIcon />
					Invite members
				</Button>
			</Empty.Content>
		</Empty.Root>
	</section>

	<!-- 6 — with input: 404-style state with a search field in the content -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With input</h3>
			<p class="text-muted-foreground mt-1 text-xs">Put a search field in the content area.</p>
		</div>
		<Empty.Root class="w-full border">
			<Empty.Header>
				<Empty.Media variant="icon">
					<Search />
				</Empty.Media>
				<Empty.Title>404 — Page not found</Empty.Title>
				<Empty.Description>The page you were looking for doesn't exist.</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<div class="relative w-full">
					<Search class="text-muted-foreground absolute inset-s-0 top-1/2 ms-3 size-4 -translate-y-1/2" />
					<input
						type="search"
						bind:value={query}
						placeholder="Try a different search…"
						aria-label="Search"
						class={INPUT}
					/>
				</div>
				<Button variant="link" size="sm">Go back home</Button>
			</Empty.Content>
		</Empty.Root>
	</section>
</div>
