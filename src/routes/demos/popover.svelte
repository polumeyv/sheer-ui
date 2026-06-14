<script lang="ts">
	import * as Popover from '$lib/components/popover/index';
	import { Button } from '$lib/components/button/index';
	import { Label } from '$lib/components/label/index';
	import { Input } from '$lib/components/input/index';
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>Open popover</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-80">
		<div class="grid gap-4">
			<div class="space-y-1">
				<h4 class="text-sm font-medium leading-none">Dimensions</h4>
				<p class="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
			</div>
			<div class="grid gap-2">
				<div class="grid grid-cols-3 items-center gap-4">
					<Label for="width">Width</Label>
					<Input id="width" value="100%" class="col-span-2 h-8" />
				</div>
				<div class="grid grid-cols-3 items-center gap-4">
					<Label for="height">Height</Label>
					<Input id="height" value="25px" class="col-span-2 h-8" />
				</div>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
