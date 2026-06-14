<script lang="ts">
	import * as Empty from '$lib/components/empty/index';
	import { Button } from '$lib/components/button/index';
	import Search from '@lucide/svelte/icons/search';
</script>

<Empty.Root class="w-full max-w-sm">
	<Empty.Header>
		<Empty.Media variant="icon">
			<Search />
		</Empty.Media>
		<Empty.Title>No results found</Empty.Title>
		<Empty.Description>Try adjusting your search or filters to find what you're looking for.</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button variant="outline">Clear filters</Button>
	</Empty.Content>
</Empty.Root>
