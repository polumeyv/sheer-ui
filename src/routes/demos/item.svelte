<script lang="ts">
	import * as Item from '$lib/components/item/index';
	import { Button } from '$lib/components/button/index';
	import Bell from '@lucide/svelte/icons/bell';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
</script>

<Item.Group class="w-full max-w-md">
	<Item.Root variant="outline">
		<Item.Media variant="icon">
			<Bell />
		</Item.Media>
		<Item.Content>
			<Item.Title>Notifications</Item.Title>
			<Item.Description>Get notified when something needs your attention.</Item.Description>
		</Item.Content>
		<Item.Actions>
			<Button variant="ghost" size="icon" aria-label="Open notifications">
				<ChevronRight class="size-4" />
			</Button>
		</Item.Actions>
	</Item.Root>

	<Item.Separator />

	<Item.Root variant="outline">
		<Item.Media variant="icon">
			<CreditCard />
		</Item.Media>
		<Item.Content>
			<Item.Title>Billing</Item.Title>
			<Item.Description>Visa ending in 4242 · Renews on Jul 1, 2026.</Item.Description>
		</Item.Content>
		<Item.Actions>
			<Button variant="outline" size="sm">Manage</Button>
		</Item.Actions>
	</Item.Root>
</Item.Group>
