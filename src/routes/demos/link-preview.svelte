<script lang="ts">
	import * as LinkPreview from '$lib/components/primitive/link-preview/index';
</script>

<LinkPreview.Root>
	<LinkPreview.Trigger
		href="https://svelte.dev"
		target="_blank"
		rel="noreferrer noopener"
		class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2"
	>
		Hover over @sveltejs
	</LinkPreview.Trigger>
	<LinkPreview.Content
		class="bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-none"
	>
		<div class="space-y-2">
			<h4 class="text-sm font-semibold">Svelte</h4>
			<p class="text-muted-foreground text-sm">
				Cybernetically enhanced web apps. A UI framework that compiles your components to
				highly optimized vanilla JavaScript.
			</p>
			<span class="text-xs font-medium">svelte.dev</span>
		</div>
	</LinkPreview.Content>
</LinkPreview.Root>
