<script lang="ts">
	import { Label } from '$lib/components/label/index';
	import { Input } from '$lib/components/input/index';
	import { Checkbox } from '$lib/components/checkbox/index';
	import { Switch } from '$lib/components/switch/index';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const INPUT =
		'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';
	const FIELD = 'grid w-full max-w-sm items-center gap-3';
	const ROW = 'flex items-center gap-3';

	// 2 — checkbox
	let terms = $state(false);

	// 3 — switch
	let notifications = $state(true);

	// 5 — required / destructive form field
	let username = $state('');
	const usernameError = $derived(username.trim() === '' ? 'Username is required.' : '');
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — with input -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With input</h3>
			<p class="text-muted-foreground mt-1 text-xs">Associate a label with a field via `for`/`id`.</p>
		</div>
		<div class={FIELD}>
			<Label for="email">Email</Label>
			<Input id="email" type="email" placeholder="name@example.com" class={INPUT} />
		</div>
	</section>

	<!-- 2 — with checkbox -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With checkbox</h3>
			<p class="text-muted-foreground mt-1 text-xs">Inline label for a selection control.</p>
		</div>
		<div class={ROW}>
			<Checkbox id="terms" bind:checked={terms} />
			<Label for="terms">Accept terms and conditions</Label>
		</div>
	</section>

	<!-- 3 — with switch -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With switch</h3>
			<p class="text-muted-foreground mt-1 text-xs">Label toggling a setting on or off.</p>
		</div>
		<div class={ROW}>
			<Switch id="notifications" bind:checked={notifications} />
			<Label for="notifications">Email notifications</Label>
		</div>
	</section>

	<!-- 4 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				`peer-disabled` dims the label when its control is disabled.
			</p>
		</div>
		<div class={FIELD}>
			<Label for="disabled-input">API key</Label>
			<Input id="disabled-input" placeholder="Unavailable" disabled class={INPUT} />
		</div>
	</section>

	<!-- 5 — required / destructive -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Required field</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Mark requirement and surface a validation error.
			</p>
		</div>
		<div class={FIELD}>
			<Label for="username" class={usernameError ? 'text-destructive' : ''}>
				Username
				<span class="text-destructive">*</span>
			</Label>
			<Input
				id="username"
				bind:value={username}
				placeholder="shadcn"
				aria-invalid={usernameError ? 'true' : undefined}
				class={INPUT}
			/>
			{#if usernameError}
				<p class="text-destructive text-xs">{usernameError}</p>
			{/if}
		</div>
	</section>
</div>
