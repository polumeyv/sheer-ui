<script lang="ts">
	import * as Tooltip from '$lib/components/tooltip/index';
	import { Button } from '$lib/components/button/index';
	import Plus from '@lucide/svelte/icons/plus';
</script>

<Tooltip.Provider delayDuration={200}>
	<div class="flex flex-wrap items-center gap-3">
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline">Hover me</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>Add to library</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" size="icon">
						<Plus />
						<span class="sr-only">Add</span>
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content side="right">Create new item</Tooltip.Content>
		</Tooltip.Root>
	</div>
</Tooltip.Provider>
