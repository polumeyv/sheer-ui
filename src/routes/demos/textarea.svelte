<script lang="ts">
	import { Textarea } from '$lib/components/textarea/index';
	import { Label } from '$lib/components/label/index';

	let value = $state('');
</script>

<div class="grid w-full max-w-sm items-center gap-2">
	<Label for="message">Your message</Label>
	<Textarea id="message" name="message" placeholder="Type your message here..." bind:value />
	<p class="text-muted-foreground text-sm">{value.length} characters</p>
</div>
