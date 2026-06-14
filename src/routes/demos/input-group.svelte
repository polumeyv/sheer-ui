<script lang="ts">
	import * as InputGroup from '$lib/components/input-group/index';
	import Search from '@lucide/svelte/icons/search';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';

	let search = $state('');
	let message = $state('');
</script>

<div class="flex w-full max-w-sm flex-col gap-6">
	<InputGroup.Root>
		<InputGroup.Addon>
			<Search />
		</InputGroup.Addon>
		<InputGroup.Input placeholder="Search..." bind:value={search} />
	</InputGroup.Root>

	<InputGroup.Root>
		<InputGroup.Addon>
			<InputGroup.Text>https://</InputGroup.Text>
		</InputGroup.Addon>
		<InputGroup.Input placeholder="example.com" />
	</InputGroup.Root>

	<InputGroup.Root>
		<InputGroup.Input placeholder="Type a message..." bind:value={message} />
		<InputGroup.Addon align="inline-end">
			<InputGroup.Button size="icon-xs" aria-label="Send" disabled={!message.trim()}>
				<ArrowUp />
			</InputGroup.Button>
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
