<script lang="ts">
	import * as Pagination from '$lib/components/pagination/index';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	// Shared trigger styling for the compact prev/next-only example, factored out
	// so each example stays copy-paste sized.
	const ICON_BTN =
		'border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-md border text-sm focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';

	// 1 — default (mirrors the original demo)
	let page = $state(2);

	// 2 — wider window of sibling page links
	let siblingsPage = $state(5);

	// 3 — range summary driven by the snippet's `range`
	let rangePage = $state(1);

	// 4 — vertical orientation
	let verticalPage = $state(3);

	// 5 — prev/next only, with disabled edges
	let simplePage = $state(1);
	const simpleTotalPages = 8;
</script>

<div class="flex w-full max-w-2xl flex-col gap-10">
	<!-- 1 — default -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Numbered links with ellipsis, Previous and Next.
			</p>
		</div>
		<Pagination.Root count={60} perPage={10} bind:page>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.Previous />
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage === page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.Next />
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	</section>

	<!-- 2 — more siblings -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">More siblings</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				`siblingCount={2}` shows a wider window around the active page.
			</p>
		</div>
		<Pagination.Root count={200} perPage={10} siblingCount={2} bind:page={siblingsPage}>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.Previous />
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage === page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.Next />
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	</section>

	<!-- 3 — with range summary -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With range summary</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Use the snippet's `range` to show which items are visible.
			</p>
		</div>
		<Pagination.Root count={96} perPage={12} bind:page={rangePage}>
			{#snippet children({ pages, currentPage, range })}
				<div class="flex flex-col items-center gap-2">
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.Previous />
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.Next />
						</Pagination.Item>
					</Pagination.Content>
					<p class="text-muted-foreground text-xs">
						Showing {range.start + 1}–{range.end} of 96
					</p>
				</div>
			{/snippet}
		</Pagination.Root>
	</section>

	<!-- 4 — vertical orientation -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Vertical</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				`orientation="vertical"` stacks the page links.
			</p>
		</div>
		<Pagination.Root
			count={50}
			perPage={10}
			orientation="vertical"
			bind:page={verticalPage}
		>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content class="flex-col">
					<Pagination.Item>
						<Pagination.Previous />
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage === page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.Next />
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	</section>

	<!-- 5 — prev/next only -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Prev / Next only</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Icon-only controls with disabled edges and a page counter.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<button
				type="button"
				class={ICON_BTN}
				aria-label="Go to previous page"
				disabled={simplePage === 1}
				onclick={() => (simplePage = Math.max(1, simplePage - 1))}
			>
				<ChevronLeftIcon class="size-4" />
			</button>
			<span class="text-muted-foreground min-w-24 text-center text-sm">
				Page {simplePage} of {simpleTotalPages}
			</span>
			<button
				type="button"
				class={ICON_BTN}
				aria-label="Go to next page"
				disabled={simplePage === simpleTotalPages}
				onclick={() => (simplePage = Math.min(simpleTotalPages, simplePage + 1))}
			>
				<ChevronRightIcon class="size-4" />
			</button>
		</div>
	</section>
</div>
