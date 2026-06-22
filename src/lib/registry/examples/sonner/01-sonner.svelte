<script lang="ts">
	import { Toaster, toast } from '$lib/components/sonner/index.js';
	import { Button } from '$lib/components/button/index.js';
</script>

<Toaster />

<div class="flex flex-wrap items-center gap-3">
	<Button
		variant="outline"
		onclick={() =>
			toast.success('Event created', {
				description: 'Sunday, December 03, 2023 at 9:00 AM',
			})}>
		Show toast
	</Button>
	<Button
		variant="outline"
		onclick={() => toast.error('Something went wrong', { description: 'Please try again later.' })}>
		Show error
	</Button>
</div>
