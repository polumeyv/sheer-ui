<script lang="ts">
	// `link-preview` Content ships its own surface styling; only the inline
	// trigger anchor takes a couple of link utilities.
	import { LinkPreview } from '../../lib/components/link-preview/index.js';
</script>

<p class="text-sm">
	Built and maintained by the
	<LinkPreview.Root>
		<LinkPreview.Trigger>
			{#snippet child({ props })}
				<a
					{...props}
					href="https://svelte.dev"
					target="_blank"
					rel="noreferrer noopener"
					class="font-medium underline underline-offset-4">
					Svelte
				</a>
			{/snippet}
		</LinkPreview.Trigger>
		<LinkPreview.Content>
			<div class="flex flex-col gap-1">
				<p class="text-sm font-semibold">Svelte</p>
				<p class="text-muted-foreground text-sm">
					Cybernetically enhanced web apps. Build user interfaces with less code.
				</p>
			</div>
		</LinkPreview.Content>
	</LinkPreview.Root>
	team.
</p>
