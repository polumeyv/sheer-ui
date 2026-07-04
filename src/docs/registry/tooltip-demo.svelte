<script lang="ts">
	import * as Tooltip from '../../lib/components/tooltip/index.js';
	import { Button } from '../../lib/components/button/index.js';
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Button variant='outline' {...props}>Hover me</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Add to library</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
