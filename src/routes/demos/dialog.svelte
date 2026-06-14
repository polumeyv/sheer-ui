<script lang="ts">
	import * as Dialog from '$lib/components/dialog/index';
	import { Button, buttonVariants } from '$lib/components/button/index';
	import { Input } from '$lib/components/input/index';
	import { Label } from '$lib/components/label/index';
	import CopyIcon from '@lucide/svelte/icons/copy';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const FIELD = 'grid gap-2';
	const TERMS = 'text-muted-foreground text-sm leading-relaxed';

	// 2 — controlled open state
	let open = $state(false);

	// 5 — scrollable terms
	const paragraphs = Array.from({ length: 8 }, (_, i) => i + 1);
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default, with form -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With form</h3>
			<p class="text-muted-foreground mt-1 text-xs">Header, body fields and a footer action.</p>
		</div>
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Edit profile</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-md">
				<Dialog.Header>
					<Dialog.Title>Edit profile</Dialog.Title>
					<Dialog.Description>
						Make changes to your profile here. Click save when you're done.
					</Dialog.Description>
				</Dialog.Header>
				<div class={FIELD}>
					<Label for="profile-name">Name</Label>
					<Input id="profile-name" placeholder="Your name" />
				</div>
				<Dialog.Footer>
					<Button type="submit">Save changes</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</section>

	<!-- 2 — controlled open state -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Controlled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Drive open state from your own value.</p>
		</div>
		<Button variant="outline" onclick={() => (open = true)}>Open dialog</Button>
		<Dialog.Root bind:open>
			<Dialog.Content class="sm:max-w-md">
				<Dialog.Header>
					<Dialog.Title>Controlled dialog</Dialog.Title>
					<Dialog.Description>
						This dialog's visibility is bound to a local <code>$state</code> value.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Button variant="outline" onclick={() => (open = false)}>Dismiss</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</section>

	<!-- 3 — confirmation with Close actions -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Confirmation</h3>
			<p class="text-muted-foreground mt-1 text-xs">Cancel and confirm wrapped in Dialog.Close.</p>
		</div>
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
				Delete account
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-md">
				<Dialog.Header>
					<Dialog.Title>Are you absolutely sure?</Dialog.Title>
					<Dialog.Description>
						This action cannot be undone. This will permanently delete your account and remove your
						data from our servers.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
					<Dialog.Close class={buttonVariants({ variant: 'destructive' })}>Delete</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</section>

	<!-- 4 — share link, custom close button -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Share link</h3>
			<p class="text-muted-foreground mt-1 text-xs">Copyable input with a custom footer Close.</p>
		</div>
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Share</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-md">
				<Dialog.Header>
					<Dialog.Title>Share link</Dialog.Title>
					<Dialog.Description>Anyone with this link can view this document.</Dialog.Description>
				</Dialog.Header>
				<div class="flex items-center gap-2">
					<div class="grid flex-1 gap-2">
						<Label for="share-link" class="sr-only">Link</Label>
						<Input id="share-link" readonly value="https://example.com/share/abc123" />
					</div>
					<Button type="button" size="sm" class="px-3">
						<span class="sr-only">Copy</span>
						<CopyIcon />
					</Button>
				</div>
				<Dialog.Footer class="sm:justify-start">
					<Dialog.Close class={buttonVariants({ variant: 'secondary' })}>Close</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</section>

	<!-- 5 — scrollable content -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Scrollable</h3>
			<p class="text-muted-foreground mt-1 text-xs">Long body that scrolls within a max height.</p>
		</div>
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Read terms</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-lg">
				<Dialog.Header>
					<Dialog.Title>Terms of Service</Dialog.Title>
					<Dialog.Description>Please review before continuing.</Dialog.Description>
				</Dialog.Header>
				<div class="-mx-2 max-h-72 space-y-3 overflow-y-auto px-2">
					{#each paragraphs as n (n)}
						<p class={TERMS}>
							{n}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
							exercitation ullamco laboris.
						</p>
					{/each}
				</div>
				<Dialog.Footer>
					<Dialog.Close class={buttonVariants({ variant: 'default' })}>I agree</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</section>

	<!-- 6 — no built-in close button -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">No close button</h3>
			<p class="text-muted-foreground mt-1 text-xs">Hide the corner X with showCloseButton.</p>
		</div>
		<Dialog.Root>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Subscribe</Dialog.Trigger>
			<Dialog.Content showCloseButton={false} class="sm:max-w-md">
				<Dialog.Header>
					<Dialog.Title>Join the newsletter</Dialog.Title>
					<Dialog.Description>One email a week. No spam, unsubscribe anytime.</Dialog.Description>
				</Dialog.Header>
				<div class={FIELD}>
					<Label for="newsletter-email">Email</Label>
					<Input id="newsletter-email" type="email" placeholder="you@example.com" />
				</div>
				<Dialog.Footer>
					<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Maybe later</Dialog.Close>
					<Button type="submit">Subscribe</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</section>
</div>
