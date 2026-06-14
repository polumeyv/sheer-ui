<script lang="ts">
	import { Button } from '$lib/components/button/index';
	import { Toaster, toast } from '$lib/components/sonner/index';
</script>

<div class="flex flex-wrap items-center justify-center gap-3">
	<Toaster />
	<Button variant="outline" onclick={() => toast.success('Hours saved')}>Success</Button>
	<Button
		variant="outline"
		onclick={() =>
			toast.error('Failed to load availability', {
				description: 'Please check your connection and try again.',
			})}
	>
		Error
	</Button>
	<Button variant="outline" onclick={() => toast.info('Please complete your setup.')}>Info</Button>
	<Button variant="outline" onclick={() => toast.warning('Domain already added')}>Warning</Button>
</div>
