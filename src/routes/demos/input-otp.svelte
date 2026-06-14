<script lang="ts">
	import * as InputOTP from '$lib/components/input-otp/index';
	import {
		REGEXP_ONLY_DIGITS,
		REGEXP_ONLY_DIGITS_AND_CHARS
	} from '$lib/components/input-otp/index';

	// Shared bits, factored out so each example stays copy-paste sized.
	const HINT = 'text-muted-foreground text-sm';
	const DOT = 'bg-border h-1.5 w-1.5 rounded-full';

	// 1 — default (preserved working example): 6 digits, split 3 + 3.
	let otp = $state('');

	// 3 — separators: three groups of two with separators between.
	let pairs = $state('');

	// 4 — controlled: echo value + clear button.
	let controlled = $state('123');

	// 5 — pattern: digits and characters.
	let alnum = $state('');
</script>

<div class="flex w-full max-w-3xl flex-col gap-10">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">Six digit code, split into two groups.</p>
		</div>
		<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS} bind:value={otp}>
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
		<p class={HINT}>
			{otp === '' ? 'Enter your one-time password.' : `You entered: ${otp}`}
		</p>
	</section>

	<!-- 2 — pattern (digits + chars) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Pattern</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Accepts digits and letters via REGEXP_ONLY_DIGITS_AND_CHARS.
			</p>
		</div>
		<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} bind:value={alnum}>
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	</section>

	<!-- 3 — separators between every pair -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Separators</h3>
			<p class="text-muted-foreground mt-1 text-xs">Three groups of two with custom separators.</p>
		</div>
		<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS} bind:value={pairs}>
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells.slice(0, 2) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator>
					<div class={DOT}></div>
				</InputOTP.Separator>
				<InputOTP.Group>
					{#each cells.slice(2, 4) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator>
					<div class={DOT}></div>
				</InputOTP.Separator>
				<InputOTP.Group>
					{#each cells.slice(4, 6) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	</section>

	<!-- 4 — controlled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Controlled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Bound value with a live readout and reset.</p>
		</div>
		<InputOTP.Root maxlength={4} pattern={REGEXP_ONLY_DIGITS} bind:value={controlled}>
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
		<div class="flex items-center gap-3">
			<p class={HINT}>Value: <span class="font-mono">{controlled || '—'}</span></p>
			<button
				type="button"
				class="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline disabled:opacity-50"
				disabled={controlled === ''}
				onclick={() => (controlled = '')}
			>
				Clear
			</button>
		</div>
	</section>

	<!-- 5 — disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">Non-interactive, dimmed state.</p>
		</div>
		<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS} value="123" disabled>
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
	</section>
</div>
