<script lang="ts">
	import * as Sheet from '../../lib/components/sheet/index.js';
	import { Button } from '../../lib/components/button/index.js';
	import { Input } from '../../lib/components/input/index.js';
	import { Label } from '../../lib/components/label/index.js';
</script>

<Sheet.Root>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button variant='outline' {...props}>Open sheet</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content side='right'>
		<Sheet.Header>
			<Sheet.Title>Edit profile</Sheet.Title>
			<Sheet.Description>Make changes to your profile here. Click save when you're done.</Sheet.Description>
		</Sheet.Header>
		<div class='grid flex-1 gap-4 px-4'>
			<div class='grid gap-2'>
				<Label.Root for='sheet-name'>Name</Label.Root>
				<Input id='sheet-name' value='Pedro Duarte' />
			</div>
			<div class='grid gap-2'>
				<Label.Root for='sheet-username'>Username</Label.Root>
				<Input id='sheet-username' value='@peduarte' />
			</div>
		</div>
		<Sheet.Footer>
			<Button>Save changes</Button>
			<Sheet.Close>
				{#snippet child({ props })}
					<Button variant='outline' {...props}>Close</Button>
				{/snippet}
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
