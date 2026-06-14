<script lang="ts">
	import * as InputGroup from '$lib/components/input-group/index';
	import Search from '@lucide/svelte/icons/search';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import Mail from '@lucide/svelte/icons/mail';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	// 1 — icon + send button
	let message = $state('');

	// 2 — search
	let search = $state('');

	// 3 — text prefix / suffix
	let domain = $state('');
	let amount = $state('');

	// 4 — copy button
	let token = $state('npx shadcn-svelte@latest add input-group');
	let copied = $state(false);
	function copy() {
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	// 5 — textarea with block-end addon + counter
	let bio = $state('');
	const MAX = 180;
	const remaining = $derived(MAX - bio.length);
</script>

<div class="flex w-full max-w-md flex-col gap-10">
	<!-- 1 — icon addon + inline-end button -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Icon &amp; button</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Leading icon addon and a trailing icon button.
			</p>
		</div>
		<InputGroup.Root>
			<InputGroup.Addon>
				<Mail />
			</InputGroup.Addon>
			<InputGroup.Input placeholder="Type a message..." bind:value={message} />
			<InputGroup.Addon align="inline-end">
				<InputGroup.Button size="icon-xs" aria-label="Send" disabled={!message.trim()}>
					<ArrowUp />
				</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>
	</section>

	<!-- 2 — search -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Search</h3>
			<p class="text-muted-foreground mt-1 text-xs">A single leading icon addon.</p>
		</div>
		<InputGroup.Root>
			<InputGroup.Addon>
				<Search />
			</InputGroup.Addon>
			<InputGroup.Input placeholder="Search..." bind:value={search} />
		</InputGroup.Root>
	</section>

	<!-- 3 — text prefix and suffix -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Text addons</h3>
			<p class="text-muted-foreground mt-1 text-xs">Static text as a prefix or a suffix.</p>
		</div>
		<InputGroup.Root>
			<InputGroup.Addon>
				<InputGroup.Text>https://</InputGroup.Text>
			</InputGroup.Addon>
			<InputGroup.Input placeholder="example.com" bind:value={domain} />
		</InputGroup.Root>
		<InputGroup.Root>
			<InputGroup.Addon>
				<InputGroup.Text>$</InputGroup.Text>
			</InputGroup.Addon>
			<InputGroup.Input placeholder="0.00" inputmode="decimal" bind:value={amount} />
			<InputGroup.Addon align="inline-end">
				<InputGroup.Text>USD</InputGroup.Text>
			</InputGroup.Addon>
		</InputGroup.Root>
	</section>

	<!-- 4 — copy button -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Copy</h3>
			<p class="text-muted-foreground mt-1 text-xs">Read-only value with a copy action.</p>
		</div>
		<InputGroup.Root>
			<InputGroup.Input readonly value={token} class="font-mono text-xs" />
			<InputGroup.Addon align="inline-end">
				<InputGroup.Button size="icon-xs" aria-label="Copy" onclick={copy}>
					{#if copied}
						<Check />
					{:else}
						<Copy />
					{/if}
				</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>
	</section>

	<!-- 5 — loading / spinner -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Loading</h3>
			<p class="text-muted-foreground mt-1 text-xs">A trailing spinner for a busy state.</p>
		</div>
		<InputGroup.Root>
			<InputGroup.Addon>
				<Search />
			</InputGroup.Addon>
			<InputGroup.Input placeholder="Searching..." disabled />
			<InputGroup.Addon align="inline-end">
				<LoaderCircle class="animate-spin" />
			</InputGroup.Addon>
		</InputGroup.Root>
	</section>

	<!-- 6 — textarea with block-end addon -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Textarea</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Multi-line control with a block-end addon and counter.
			</p>
		</div>
		<InputGroup.Root>
			<InputGroup.Textarea placeholder="Tell us about yourself..." rows={3} maxlength={MAX} bind:value={bio} />
			<InputGroup.Addon align="block-end">
				<InputGroup.Text class="ms-auto tabular-nums">{remaining} left</InputGroup.Text>
			</InputGroup.Addon>
		</InputGroup.Root>
	</section>
</div>
