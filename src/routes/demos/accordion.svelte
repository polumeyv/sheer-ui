<script lang="ts">
	import * as Accordion from '$lib/components/accordion/index';

	// Shared content so each example stays copy-paste sized.
	const faq = [
		{
			value: 'item-1',
			question: 'Is it accessible?',
			answer: 'Yes. It adheres to the WAI-ARIA design pattern.'
		},
		{
			value: 'item-2',
			question: 'Is it styled?',
			answer: 'Yes. It comes with default styles that match the rest of the kit.'
		},
		{
			value: 'item-3',
			question: 'Is it animated?',
			answer: 'Yes. It is animated by default, but you can disable it.'
		}
	];

	// 2 — single, with a default open item (matches shadcn's default demo)
	let opened = $state('item-1');

	// 3 — multiple: more than one panel open at once
	let openPanels = $state<string[]>(['shipping', 'returns']);
</script>

<div class="flex w-full max-w-md flex-col gap-10">
	<!-- 1 — default single -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Single</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Only one item is open at a time; opening one closes the rest.
			</p>
		</div>
		<Accordion.Root type="single" class="w-full">
			{#each faq as item (item.value)}
				<Accordion.Item value={item.value}>
					<Accordion.Trigger>{item.question}</Accordion.Trigger>
					<Accordion.Content>{item.answer}</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</section>

	<!-- 2 — single with a default open item -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Default open</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				A controlled value pre-expands the first item.
			</p>
		</div>
		<Accordion.Root type="single" bind:value={opened} class="w-full">
			{#each faq as item (item.value)}
				<Accordion.Item value={item.value}>
					<Accordion.Trigger>{item.question}</Accordion.Trigger>
					<Accordion.Content>{item.answer}</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</section>

	<!-- 3 — multiple -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Multiple</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Keep several panels expanded simultaneously.
			</p>
		</div>
		<Accordion.Root type="multiple" bind:value={openPanels} class="w-full">
			<Accordion.Item value="info">
				<Accordion.Trigger>Product information</Accordion.Trigger>
				<Accordion.Content>
					Crafted with premium materials and a focus on durability for everyday use.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="shipping">
				<Accordion.Trigger>Shipping details</Accordion.Trigger>
				<Accordion.Content>
					Free standard shipping on all orders, with delivery in 3–5 business days.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="returns">
				<Accordion.Trigger>Return policy</Accordion.Trigger>
				<Accordion.Content>
					Returns accepted within 30 days for a full refund, no questions asked.
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</section>

	<!-- 4 — disabled item -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled item</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				A single item is disabled and cannot be toggled.
			</p>
		</div>
		<Accordion.Root type="single" class="w-full">
			<Accordion.Item value="account">
				<Accordion.Trigger>Account</Accordion.Trigger>
				<Accordion.Content>Manage your profile, email and password.</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="billing" disabled>
				<Accordion.Trigger>Billing (coming soon)</Accordion.Trigger>
				<Accordion.Content>Billing is not available on your plan yet.</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="notifications">
				<Accordion.Trigger>Notifications</Accordion.Trigger>
				<Accordion.Content>Choose what updates you want to receive.</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</section>

	<!-- 5 — fully disabled -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				The whole accordion is disabled via the root.
			</p>
		</div>
		<Accordion.Root type="single" disabled class="w-full">
			{#each faq as item (item.value)}
				<Accordion.Item value={item.value}>
					<Accordion.Trigger>{item.question}</Accordion.Trigger>
					<Accordion.Content>{item.answer}</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</section>
</div>
