<script lang="ts">
	import { Toaster, toast } from '../components/sonner/index.js';
	import { Button } from '../components/button/index.js';
</script>

<Toaster closeButton />

<div class="flex flex-wrap items-center gap-3">
	<Button
		variant="outline"
		onclick={() =>
			toast.success('Event created', {
				description: 'Sunday, December 03, 2023 at 9:00 AM',
			})}>
		Success
	</Button>
	<Button variant="outline" onclick={() => toast.error('Something went wrong', { description: 'Please try again later.' })}>
		Error
	</Button>
	<Button variant="outline" onclick={() => toast.warning('Heads up', { description: 'This action needs your attention.' })}>
		Warning
	</Button>
	<Button variant="outline" onclick={() => toast.info('Did you know?', { description: 'These icons come straight from lucide.' })}>
		Info
	</Button>
	<Button variant="outline" onclick={() => toast.loading('Loading…', { description: 'Hang tight while we work.' })}>
		Loading
	</Button>
	<Button variant="outline" onclick={() => toast('Plain message', { description: 'A default toast has no icon.' })}>
		Default
	</Button>
</div>
