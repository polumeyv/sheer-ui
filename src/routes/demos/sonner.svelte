<script lang="ts">
	import { Button } from '$lib/components/button/index';
	import { Toaster, toast } from '$lib/components/sonner/index';

	// Shared layout for the button row inside each example.
	const ROW = 'flex flex-wrap items-center gap-3';

	// 6 — promise toast helper: resolves/rejects after a short delay.
	function fakeSave(shouldFail = false) {
		return new Promise<{ name: string }>((resolve, reject) => {
			setTimeout(() => {
				if (shouldFail) reject(new Error('Network error'));
				else resolve({ name: 'availability.json' });
			}, 1500);
		});
	}
</script>

<!-- A single Toaster instance backs every example below. -->
<Toaster position="bottom-right" closeButton richColors />

<div class="flex w-full max-w-3xl flex-col gap-10">
	<!-- 1 — semantic types (preserved original) -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Types</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Success, error, info and warning each render their own icon.
			</p>
		</div>
		<div class={ROW}>
			<Button variant="outline" onclick={() => toast.success('Hours saved')}>Success</Button>
			<Button
				variant="outline"
				onclick={() =>
					toast.error('Failed to load availability', {
						description: 'Please check your connection and try again.'
					})}
			>
				Error
			</Button>
			<Button variant="outline" onclick={() => toast.info('Please complete your setup.')}>
				Info
			</Button>
			<Button variant="outline" onclick={() => toast.warning('Domain already added')}>
				Warning
			</Button>
		</div>
	</section>

	<!-- 2 — plain + with description -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default & description</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				A bare message, or a title with secondary description text.
			</p>
		</div>
		<div class={ROW}>
			<Button variant="outline" onclick={() => toast('Booking confirmed')}>Default</Button>
			<Button
				variant="outline"
				onclick={() =>
					toast('Booking confirmed', {
						description: 'Sunday, June 14 at 2:00 PM with Dr. Lin.'
					})}
			>
				With description
			</Button>
		</div>
	</section>

	<!-- 3 — action button -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Action</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				An action button that runs a callback when clicked.
			</p>
		</div>
		<div class={ROW}>
			<Button
				variant="outline"
				onclick={() =>
					toast('Appointment cancelled', {
						description: 'The slot has been released.',
						action: {
							label: 'Undo',
							onClick: () => toast.success('Appointment restored')
						}
					})}
			>
				Show action
			</Button>
		</div>
	</section>

	<!-- 4 — cancel button -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Cancel</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				A secondary cancel button that simply dismisses the toast.
			</p>
		</div>
		<div class={ROW}>
			<Button
				variant="outline"
				onclick={() =>
					toast('Deleting workspace…', {
						description: 'This cannot be undone.',
						cancel: {
							label: 'Cancel',
							onClick: () => toast.info('Deletion cancelled')
						}
					})}
			>
				Show cancel
			</Button>
		</div>
	</section>

	<!-- 5 — duration & persistent -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Duration</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Override the auto-dismiss timer, or keep a toast until dismissed.
			</p>
		</div>
		<div class={ROW}>
			<Button
				variant="outline"
				onclick={() => toast('Gone in 10 seconds', { duration: 10000 })}
			>
				10s
			</Button>
			<Button
				variant="outline"
				onclick={() =>
					toast('Stays until dismissed', {
						description: 'Use the close button to hide it.',
						duration: Number.POSITIVE_INFINITY
					})}
			>
				Persistent
			</Button>
		</div>
	</section>

	<!-- 6 — promise toast -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Promise</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Loading state that swaps to success or error when the promise settles.
			</p>
		</div>
		<div class={ROW}>
			<Button
				variant="outline"
				onclick={() =>
					toast.promise(fakeSave(), {
						loading: 'Saving availability…',
						success: (data) => `Saved ${data.name}`,
						error: 'Could not save'
					})}
			>
				Resolves
			</Button>
			<Button
				variant="outline"
				onclick={() =>
					toast.promise(fakeSave(true), {
						loading: 'Saving availability…',
						success: 'Saved',
						error: (err) => `Could not save: ${err instanceof Error ? err.message : 'unknown'}`
					})}
			>
				Rejects
			</Button>
		</div>
	</section>
</div>
