<script lang="ts">
	import * as InputOTP from '$lib/components/input-otp/index';
	import { REGEXP_ONLY_DIGITS } from '$lib/components/input-otp/index';

	let value = $state('');
</script>

<div class="flex flex-col items-center gap-3">
	<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS} bind:value>
		{#snippet children({ cells })}
			<InputOTP.Group>
				{#each cells.slice(0, 3) as cell (cell)}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
			<InputOTP.Separator />
			<InputOTP.Group>
				{#each cells.slice(3, 6) as cell (cell)}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>

	<p class="text-muted-foreground text-sm">
		{value === '' ? 'Enter your one-time password.' : `You entered: ${value}`}
	</p>
</div>
