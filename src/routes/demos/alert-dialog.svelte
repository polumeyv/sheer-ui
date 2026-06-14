<script lang="ts">
	import * as AlertDialog from '$lib/components/alert-dialog/index';
	import { buttonVariants } from '$lib/components/button/index';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import LogOutIcon from '@lucide/svelte/icons/log-out';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const DESTRUCTIVE = buttonVariants({ variant: 'destructive' });
	const SECONDARY = buttonVariants({ variant: 'secondary' });
	const OUTLINE = buttonVariants({ variant: 'outline' });

	// 2 — controlled (open bound to external state)
	let open = $state(false);

	// 5 — async confirm with a pending state
	let pending = $state(false);
	let confirmed = $state(false);
	async function runDestructive() {
		pending = true;
		await new Promise((r) => setTimeout(r, 1200));
		pending = false;
		confirmed = true;
	}
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Title, description, Cancel and Action.</p>
		</div>
		<AlertDialog.Root>
			<AlertDialog.Trigger class={OUTLINE}>Delete account</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
					<AlertDialog.Description>
						This action cannot be undone. This will permanently delete your account and remove your
						data from our servers.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action>Continue</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</section>

	<!-- 2 — destructive action -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Destructive</h3>
			<p class="text-muted-foreground mt-1 text-xs">Action styled as a destructive button.</p>
		</div>
		<AlertDialog.Root>
			<AlertDialog.Trigger class={DESTRUCTIVE}>Delete project</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Delete this project?</AlertDialog.Title>
					<AlertDialog.Description>
						The project and all of its deployments will be permanently removed. This cannot be
						reverted.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Keep project</AlertDialog.Cancel>
					<AlertDialog.Action class={DESTRUCTIVE}>Delete</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</section>

	<!-- 3 — with icon -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With icon</h3>
			<p class="text-muted-foreground mt-1 text-xs">Leading icon inside the header.</p>
		</div>
		<AlertDialog.Root>
			<AlertDialog.Trigger class={OUTLINE}>Revoke API key</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<div
						class="bg-destructive/10 text-destructive flex size-10 items-center justify-center rounded-full"
					>
						<TriangleAlertIcon class="size-5" />
					</div>
					<AlertDialog.Title>Revoke this API key?</AlertDialog.Title>
					<AlertDialog.Description>
						Any service still using this key will immediately lose access. You can generate a new key
						afterwards.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action class={DESTRUCTIVE}>Revoke key</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</section>

	<!-- 4 — controlled open state -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Controlled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Open state bound with bind:open.</p>
		</div>
		<button type="button" class={SECONDARY} onclick={() => (open = true)}>Sign out</button>
		<AlertDialog.Root bind:open>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Sign out of all devices?</AlertDialog.Title>
					<AlertDialog.Description>
						You will need to sign in again on each device you use.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Stay signed in</AlertDialog.Cancel>
					<AlertDialog.Action>
						<LogOutIcon class="size-4" />
						Sign out
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
		<p class="text-muted-foreground text-xs">Dialog open: {open}</p>
	</section>

	<!-- 5 — async confirm -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Async confirm</h3>
			<p class="text-muted-foreground mt-1 text-xs">Action runs work; Cancel disabled while pending.</p>
		</div>
		<AlertDialog.Root>
			<AlertDialog.Trigger class={OUTLINE}>Reset workspace</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Reset this workspace?</AlertDialog.Title>
					<AlertDialog.Description>
						All settings return to their defaults. This may take a moment.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel disabled={pending}>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action class={DESTRUCTIVE} disabled={pending} onclick={runDestructive}>
						{pending ? 'Resetting…' : 'Reset'}
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
		{#if confirmed}
			<p class="text-muted-foreground text-xs">Workspace reset.</p>
		{/if}
	</section>
</div>
