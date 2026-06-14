<script lang="ts">
	import * as Alert from '$lib/components/alert/index';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import Info from '@lucide/svelte/icons/info';
	import Popcorn from '@lucide/svelte/icons/popcorn';

	// Shared width so every example lines up in the single column.
	const ALERT = 'w-full max-w-md';
</script>

<div class="flex w-full max-w-md flex-col gap-10">
	<!-- 1 — destructive (preserved from the original demo) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Destructive</h3>
			<p class="text-muted-foreground mt-1 text-xs">Error styling for failures and warnings.</p>
		</div>
		<Alert.Root variant="destructive" class={ALERT}>
			<AlertCircle class="size-4" />
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>Your session has expired. Please sign in again.</Alert.Description>
		</Alert.Root>
	</section>

	<!-- 2 — default with icon, title and description -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Icon, title and description.</p>
		</div>
		<Alert.Root class={ALERT}>
			<CircleCheck class="size-4" />
			<Alert.Title>Success! Your changes have been saved.</Alert.Title>
			<Alert.Description>This is an alert with icon, title and description.</Alert.Description>
		</Alert.Root>
	</section>

	<!-- 3 — icon and title only, no description -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Title only</h3>
			<p class="text-muted-foreground mt-1 text-xs">An icon and a title, no description.</p>
		</div>
		<Alert.Root class={ALERT}>
			<Popcorn class="size-4" />
			<Alert.Title>This alert has a title and an icon. No description.</Alert.Title>
		</Alert.Root>
	</section>

	<!-- 4 — without an icon -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">No icon</h3>
			<p class="text-muted-foreground mt-1 text-xs">Plain title and description.</p>
		</div>
		<Alert.Root class={ALERT}>
			<Alert.Title>Heads up!</Alert.Title>
			<Alert.Description>You can add components to your app using the CLI.</Alert.Description>
		</Alert.Root>
	</section>

	<!-- 5 — destructive with a list in the description -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With a list</h3>
			<p class="text-muted-foreground mt-1 text-xs">Rich description content.</p>
		</div>
		<Alert.Root variant="destructive" class={ALERT}>
			<AlertCircle class="size-4" />
			<Alert.Title>Unable to process your payment.</Alert.Title>
			<Alert.Description>
				<p>Please verify your billing information and try again.</p>
				<ul class="list-inside list-disc text-sm">
					<li>Check your card details</li>
					<li>Ensure sufficient funds</li>
					<li>Verify the billing address</li>
				</ul>
			</Alert.Description>
		</Alert.Root>
	</section>

	<!-- 6 — informational, icon and description only -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Description only</h3>
			<p class="text-muted-foreground mt-1 text-xs">An icon and a description, no title.</p>
		</div>
		<Alert.Root class={ALERT}>
			<Info class="size-4" />
			<Alert.Description>A new software update is available. See what's new in version 2.0.</Alert.Description>
		</Alert.Root>
	</section>
</div>
