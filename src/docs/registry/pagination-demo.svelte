<script lang="ts">
	import * as Pagination from '../../lib/components/pagination/index.js';
	import MoreHorizontalIcon from '@lucide/svelte/icons/ellipsis';
</script>

<Pagination.Root count={100} perPage={10}>
	{#snippet children({ pages, currentPage })}
		<Pagination.PrevButton />
		{#each pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<span class="grid size-9 place-items-center">
					<MoreHorizontalIcon class="size-4" />
					<span class="sr-only">More pages</span>
				</span>
			{:else}
				<Pagination.Page {page} isActive={currentPage === page.value}>
					{page.value}
				</Pagination.Page>
			{/if}
		{/each}
		<Pagination.NextButton />
	{/snippet}
</Pagination.Root>
