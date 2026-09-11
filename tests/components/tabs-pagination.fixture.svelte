<script lang="ts">
	import * as Tabs from '#lib/components/tabs/index.js';
	import * as Pagination from '#lib/components/pagination/index.js';

	let { surface }: { surface: 'tabs' | 'pagination' } = $props();

	let tab = $state('one');
	let page = $state(1);

	export const current = () => ({ tab, page });
</script>

{#if surface === 'tabs'}
	<Tabs.Root bind:value={tab}>
		<Tabs.List>
			<Tabs.Trigger value="one" data-testid="tab-one">One</Tabs.Trigger>
			<Tabs.Trigger value="two" data-testid="tab-two">Two</Tabs.Trigger>
			<Tabs.Trigger value="three" disabled data-testid="tab-three">Three</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="one" data-testid="panel-one">one</Tabs.Content>
		<Tabs.Content value="two" data-testid="panel-two">two</Tabs.Content>
	</Tabs.Root>
{:else}
	<Pagination.Root count={50} perPage={10} bind:page>
		{#snippet children({ pages, currentPage })}
			<Pagination.PrevButton data-testid="prev" />
			{#each pages as item (item.key)}
				{#if item.type === 'page'}
					<Pagination.Page page={item} isActive={currentPage === item.value} data-testid="page-{item.value}" />
				{/if}
			{/each}
			<Pagination.NextButton data-testid="next" />
		{/snippet}
	</Pagination.Root>
{/if}
