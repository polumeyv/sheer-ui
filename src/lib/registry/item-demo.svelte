<script lang="ts">
	// `item` ships no `Title`/`Actions` parts — the title is a styled element
	// inside `Item.Content` and the trailing action sits as the last child of
	// `Item.Root`, matching the shadcn item composition.
	import * as Item from '$lib/components/item/index.js';
	import { Button } from '$lib/components/button/index.js';
	import BellIcon from '@lucide/svelte/icons/bell';
</script>

<Item.Root variant="outline" class="w-full sm:max-w-md">
	<Item.Media variant="icon">
		<BellIcon class="size-4" />
	</Item.Media>
	<Item.Content>
		<span class="text-sm font-medium leading-none">Notifications</span>
		<Item.Description>Manage how you receive alerts.</Item.Description>
	</Item.Content>
	<Button variant="outline" size="sm">Configure</Button>
</Item.Root>
