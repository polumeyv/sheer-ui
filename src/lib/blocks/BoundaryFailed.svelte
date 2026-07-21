<script lang="ts">
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { Button } from '../components/button';
	import * as Empty from '../components/empty';

	let {
		error,
		reset,
		class: className,
	}: {
		error: unknown;
		reset: () => void;
		class?: ClassValue;
	} = $props();
</script>

<Empty.Root class={join('py-12', className)}>
	<Empty.Header>
		<Empty.Media variant="icon">
			<AlertCircle />
		</Empty.Media>
		<Empty.Title>Something went wrong</Empty.Title>
		<Empty.Description>
			{Error.isError(error) ? error.message : 'An unexpected error occurred'}
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button variant="outline" onclick={() => history.back()}>Go Back</Button>
		<Button onclick={reset}>Try Again</Button>
	</Empty.Content>
</Empty.Root>
