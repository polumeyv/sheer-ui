<script lang="ts">
	import { Input } from '$lib/components/input/index';
	import { Label } from '$lib/components/label/index';
	import { Button } from '$lib/components/button/index';

	// Shared layout class for label/control stacks, factored out so each
	// example stays copy-paste sized.
	const FIELD = 'grid w-full items-center gap-2';

	// 5 — with button (subscribe)
	let email = $state('');

	// 6 — invalid (basic validation)
	let username = $state('');
	const usernameInvalid = $derived(username.trim() !== '' && username.trim().length < 3);
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default (with label) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">A labelled email field.</p>
		</div>
		<div class={FIELD}>
			<Label for="email">Email</Label>
			<Input id="email" type="email" placeholder="you@example.com" />
		</div>
	</section>

	<!-- 2 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Non-interactive, dimmed field.</p>
		</div>
		<div class={FIELD}>
			<Label for="email-disabled">Email</Label>
			<Input id="email-disabled" type="email" placeholder="you@example.com" disabled />
		</div>
	</section>

	<!-- 3 — file -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">File</h3>
			<p class="text-muted-foreground mt-1 text-xs">Upload picker with styled button.</p>
		</div>
		<div class={FIELD}>
			<Label for="picture">Picture</Label>
			<Input id="picture" type="file" />
		</div>
	</section>

	<!-- 4 — with helper text -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With description</h3>
			<p class="text-muted-foreground mt-1 text-xs">A hint below the control.</p>
		</div>
		<div class={FIELD}>
			<Label for="display-name">Display name</Label>
			<Input id="display-name" type="text" placeholder="Ada Lovelace" />
			<p class="text-muted-foreground text-xs">This is shown on your public profile.</p>
		</div>
	</section>

	<!-- 5 — with button -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With button</h3>
			<p class="text-muted-foreground mt-1 text-xs">Input grouped with an action.</p>
		</div>
		<div class={FIELD}>
			<Label for="newsletter">Newsletter</Label>
			<div class="flex w-full items-center gap-2">
				<Input id="newsletter" type="email" placeholder="you@example.com" bind:value={email} />
				<Button type="submit">Subscribe</Button>
			</div>
		</div>
	</section>

	<!-- 6 — invalid -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Invalid</h3>
			<p class="text-muted-foreground mt-1 text-xs">Destructive ring via aria-invalid.</p>
		</div>
		<div class={FIELD}>
			<Label for="username">Username</Label>
			<Input
				id="username"
				type="text"
				placeholder="At least 3 characters"
				bind:value={username}
				aria-invalid={usernameInvalid}
				aria-describedby="username-error"
			/>
			{#if usernameInvalid}
				<p id="username-error" class="text-destructive text-xs">
					Username must be at least 3 characters.
				</p>
			{/if}
		</div>
	</section>
</div>
