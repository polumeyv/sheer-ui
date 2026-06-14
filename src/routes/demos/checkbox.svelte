<script lang="ts">
	import { Checkbox } from '$lib/components/checkbox/index';
	import { Label } from '$lib/components/label/index';

	let checked = $state(true);
</script>

<div class="flex items-start gap-3">
	<Checkbox id="terms" bind:checked class="mt-0.5" />
	<Label for="terms" class="text-sm leading-tight">
		I agree to the Terms of Service and Privacy Policy
	</Label>
</div>
