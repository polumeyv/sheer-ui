<script lang="ts">
	import { Button } from '../components/button/index.js';
	import { Input } from '../components/input/index.js';
	import { Label } from '../components/label/index.js';

	const popoverId = 'popover-demo-content';
	const anchorName = '--popover-demo-trigger';
</script>

<Button variant='outline' popovertarget={popoverId} style={`anchor-name: ${anchorName};`}>Open dimensions</Button>

<div
	id={popoverId}
	popover='auto'
	data-slot='popover-content'
	data-anchored
	data-side='bottom'
	style:position-anchor={anchorName}
	class='bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 opacity-0 shadow-md outline-hidden transition-[opacity,scale,translate,display,overlay] transition-discrete open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0'>
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
</div>
