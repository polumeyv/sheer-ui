<script lang="ts">
	import { Textarea } from '$lib/components/textarea/index';
	import { Label } from '$lib/components/label/index';
	import { Button } from '$lib/components/button/index';

	// Shared layout classes, factored out so each example stays copy-paste sized.
	const FIELD = 'grid w-full gap-2';
	const HELP = 'text-muted-foreground text-sm';

	// 1 — with label (preserved original example)
	let message = $state('');

	// 4 — with helper text + live count
	const MAX = 280;
	let bio = $state('');
	const remaining = $derived(MAX - bio.length);

	// 5 — with button
	let feedback = $state('');
	let sent = $state(false);
	function send() {
		if (feedback.trim() === '') return;
		sent = true;
		feedback = '';
	}

	// 6 — invalid / destructive
	let required = $state('');
	const invalid = $derived(required.trim() === '');
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — with label -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With label</h3>
			<p class="text-muted-foreground mt-1 text-xs">Associated label, bound value, character count.</p>
		</div>
		<div class={FIELD}>
			<Label for="message">Your message</Label>
			<Textarea id="message" name="message" placeholder="Type your message here..." bind:value={message} />
			<p class={HELP}>{message.length} characters</p>
		</div>
	</section>

	<!-- 2 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">A bare textarea with a placeholder.</p>
		</div>
		<Textarea placeholder="Type your message here..." />
	</section>

	<!-- 3 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Non-interactive, dimmed via the disabled prop.</p>
		</div>
		<Textarea placeholder="Type your message here..." disabled />
	</section>

	<!-- 4 — with helper text -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With text</h3>
			<p class="text-muted-foreground mt-1 text-xs">Helper text and a maxlength-aware counter.</p>
		</div>
		<div class={FIELD}>
			<Label for="bio">Bio</Label>
			<Textarea id="bio" name="bio" placeholder="Tell us a little about yourself" maxlength={MAX} bind:value={bio} />
			<p class={HELP}>{remaining} characters remaining.</p>
		</div>
	</section>

	<!-- 5 — with button -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With button</h3>
			<p class="text-muted-foreground mt-1 text-xs">Paired with a submit action beneath it.</p>
		</div>
		<div class={FIELD}>
			<Textarea
				placeholder="Type your message here..."
				bind:value={feedback}
				oninput={() => (sent = false)}
			/>
			<Button onclick={send} disabled={feedback.trim() === ''} class="w-fit">Send message</Button>
			{#if sent}
				<p class={HELP}>Message sent. Thanks!</p>
			{/if}
		</div>
	</section>

	<!-- 6 — invalid -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Invalid</h3>
			<p class="text-muted-foreground mt-1 text-xs">Destructive ring via aria-invalid when empty.</p>
		</div>
		<div class={FIELD}>
			<Label for="reason">Reason</Label>
			<Textarea
				id="reason"
				name="reason"
				placeholder="Explain your request…"
				aria-invalid={invalid}
				aria-describedby="reason-error"
				bind:value={required}
			/>
			{#if invalid}
				<p id="reason-error" class="text-destructive text-sm">This field is required.</p>
			{/if}
		</div>
	</section>
</div>
