<script lang="ts">
	import * as Popover from '$lib/components/popover/index.js';
	import { Button } from '$lib/components/button/index.js';
	import { Input } from '$lib/components/input/index.js';
	import { Label } from '$lib/components/label/index.js';
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button variant='outline' {...props}>Open dimensions</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content>
		<div class='flex flex-col gap-3'>
			<div class='flex flex-col gap-1'>
				<h4 class='font-medium leading-none'>Dimensions</h4>
				<p class='text-muted-foreground text-sm'>Set the dimensions for the layer.</p>
			</div>
			<div class='grid gap-2'>
				<div class='grid grid-cols-3 items-center gap-4'>
					<Label.Root for='width'>Width</Label.Root>
					<Input id='width' value='100%' class='col-span-2 h-8' />
				</div>
				<div class='grid grid-cols-3 items-center gap-4'>
					<Label.Root for='height'>Height</Label.Root>
					<Input id='height' value='25px' class='col-span-2 h-8' />
				</div>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
