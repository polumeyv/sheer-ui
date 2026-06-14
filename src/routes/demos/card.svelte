<script lang="ts">
	import * as Card from '$lib/components/card/index';
	import { Button } from '$lib/components/button/index';
	import { Input } from '$lib/components/input/index';
	import { Label } from '$lib/components/label/index';
	import BellIcon from '@lucide/svelte/icons/bell';
	import CheckIcon from '@lucide/svelte/icons/check';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const CARD = 'w-full max-w-sm';
	const FIELD = 'grid gap-2';

	// 3 — notification toggles
	const notifications = [
		{ id: 'everything', label: 'Everything', description: 'Email digest, mentions & replies.' },
		{ id: 'available', label: 'Available', description: 'Only mentions and replies.' },
		{ id: 'ignoring', label: 'Ignoring', description: 'Turn off all notifications.' }
	];
	let selected = $state('available');

	// 5 — danger zone confirm
	let confirm = $state('');
	const canDelete = $derived(confirm.trim() === 'DELETE');
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default form card (preserved from the original demo) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Header, content and a split footer.</p>
		</div>
		<Card.Root class={CARD}>
			<Card.Header>
				<Card.Title>Create project</Card.Title>
				<Card.Description>Deploy your new project in one click.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class={FIELD}>
					<Label for="project-name">Name</Label>
					<Input id="project-name" placeholder="Name of your project" />
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Deploy</Button>
			</Card.Footer>
		</Card.Root>
	</section>

	<!-- 2 — login form with a header action -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With header action</h3>
			<p class="text-muted-foreground mt-1 text-xs">Card.Action sits beside the title.</p>
		</div>
		<Card.Root class={CARD}>
			<Card.Header>
				<Card.Title>Login to your account</Card.Title>
				<Card.Description>Enter your email below to sign in.</Card.Description>
				<Card.Action>
					<Button variant="link" class="px-0">Sign up</Button>
				</Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<div class={FIELD}>
					<Label for="login-email">Email</Label>
					<Input id="login-email" type="email" placeholder="m@example.com" />
				</div>
				<div class={FIELD}>
					<div class="flex items-center">
						<Label for="login-password">Password</Label>
						<a href="##" class="ms-auto text-xs underline-offset-4 hover:underline">
							Forgot?
						</a>
					</div>
					<Input id="login-password" type="password" />
				</div>
			</Card.Content>
			<Card.Footer class="flex-col gap-2">
				<Button class="w-full">Sign in</Button>
				<Button variant="outline" class="w-full">Continue with Google</Button>
			</Card.Footer>
		</Card.Root>
	</section>

	<!-- 3 — notification list, no footer -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Notifications</h3>
			<p class="text-muted-foreground mt-1 text-xs">Header with an icon and selectable rows.</p>
		</div>
		<Card.Root class={CARD}>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<BellIcon class="size-4" />
					Notifications
				</Card.Title>
				<Card.Description>Choose what you want to be notified about.</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-2">
				{#each notifications as item (item.id)}
					<button
						type="button"
						onclick={() => (selected = item.id)}
						class="hover:bg-accent flex items-start gap-3 rounded-md border p-3 text-start"
						aria-pressed={selected === item.id}
					>
						<span
							class="mt-1 flex size-4 items-center justify-center rounded-full border"
							class:bg-primary={selected === item.id}
							class:text-primary-foreground={selected === item.id}
						>
							{#if selected === item.id}<CheckIcon class="size-3" />{/if}
						</span>
						<span class="grid gap-0.5">
							<span class="text-sm leading-none font-medium">{item.label}</span>
							<span class="text-muted-foreground text-xs">{item.description}</span>
						</span>
					</button>
				{/each}
			</Card.Content>
		</Card.Root>
	</section>

	<!-- 4 — stat / summary card -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Stat</h3>
			<p class="text-muted-foreground mt-1 text-xs">Compact metric with a footer hint.</p>
		</div>
		<Card.Root class={CARD}>
			<Card.Header>
				<Card.Description>Total revenue</Card.Description>
				<Card.Title class="text-3xl tabular-nums">$15,231.89</Card.Title>
				<Card.Action>
					<span class="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs">
						+20.1%
					</span>
				</Card.Action>
			</Card.Header>
			<Card.Footer>
				<p class="text-muted-foreground text-xs">Trending up vs. last month.</p>
			</Card.Footer>
		</Card.Root>
	</section>

	<!-- 5 — destructive / danger zone -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Danger zone</h3>
			<p class="text-muted-foreground mt-1 text-xs">Type DELETE to enable the action.</p>
		</div>
		<Card.Root class="{CARD} border-destructive/40">
			<Card.Header>
				<Card.Title class="text-destructive flex items-center gap-2">
					<TriangleAlertIcon class="size-4" />
					Delete account
				</Card.Title>
				<Card.Description>This action is permanent and cannot be undone.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class={FIELD}>
					<Label for="confirm-delete">Type <span class="font-mono">DELETE</span> to confirm</Label>
					<Input id="confirm-delete" bind:value={confirm} placeholder="DELETE" />
				</div>
			</Card.Content>
			<Card.Footer>
				<Button variant="destructive" class="w-full" disabled={!canDelete}>
					Delete this account
				</Button>
			</Card.Footer>
		</Card.Root>
	</section>

	<!-- 6 — simple content-only card -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Content only</h3>
			<p class="text-muted-foreground mt-1 text-xs">Just a padded surface, no header or footer.</p>
		</div>
		<Card.Root class={CARD}>
			<Card.Content class="grid gap-2">
				<p class="text-sm font-medium">Welcome back</p>
				<p class="text-muted-foreground text-sm">
					You have 3 unread messages and 2 pending invitations waiting for review.
				</p>
			</Card.Content>
		</Card.Root>
	</section>
</div>
