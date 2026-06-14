<script lang="ts">
	import * as Table from '$lib/components/table/index';
	import { Checkbox } from '$lib/components/checkbox/index';
	import { Badge, type BadgeVariant } from '$lib/components/badge/index';

	// Shared classes, factored out so each example stays copy-paste sized.
	const ROOT = 'w-full max-w-2xl';
	const NUM = 'text-end!';

	// 1 — invoices (preserved original) ------------------------------------
	const invoices = [
		{ invoice: 'INV-001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
		{ invoice: 'INV-002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
		{ invoice: 'INV-003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
		{ invoice: 'INV-004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
	];

	// 2 — selectable rows --------------------------------------------------
	type Person = { id: string; name: string; email: string; role: string };
	const people: Person[] = [
		{ id: 'u1', name: 'Ava Stone', email: 'ava@acme.dev', role: 'Owner' },
		{ id: 'u2', name: 'Ben Cole', email: 'ben@acme.dev', role: 'Member' },
		{ id: 'u3', name: 'Cara Diaz', email: 'cara@acme.dev', role: 'Member' },
		{ id: 'u4', name: 'Dan Frey', email: 'dan@acme.dev', role: 'Viewer' },
	];
	let selected = $state<string[]>(['u2']);
	const allSelected = $derived(selected.length === people.length);
	const someSelected = $derived(selected.length > 0 && !allSelected);

	function toggleRow(id: string, checked: boolean) {
		selected = checked ? [...selected, id] : selected.filter((x) => x !== id);
	}
	function toggleAll(checked: boolean) {
		selected = checked ? people.map((p) => p.id) : [];
	}

	// 3 — status badges ----------------------------------------------------
	type Order = { id: string; customer: string; status: string; variant: BadgeVariant; total: string };
	const orders: Order[] = [
		{ id: '#3201', customer: 'Olivia Martin', status: 'Fulfilled', variant: 'secondary', total: '$1,999.00' },
		{ id: '#3202', customer: 'Jackson Lee', status: 'Processing', variant: 'default', total: '$39.00' },
		{ id: '#3203', customer: 'Isabella Nguyen', status: 'Cancelled', variant: 'destructive', total: '$299.00' },
		{ id: '#3204', customer: 'William Kim', status: 'Pending', variant: 'outline', total: '$99.00' },
	];

	// 4 — compact key/value ------------------------------------------------
	const specs = [
		{ key: 'Plan', value: 'Pro' },
		{ key: 'Seats', value: '12 of 20' },
		{ key: 'Renews', value: 'Jul 1, 2026' },
		{ key: 'Billing', value: 'Monthly' },
	];
</script>

<div class="flex w-full max-w-2xl flex-col gap-10">
	<!-- 1 — invoices -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Invoices</h3>
			<p class="text-muted-foreground mt-1 text-xs">Header, body, and a footer total row.</p>
		</div>
		<Table.Root class={ROOT}>
			<Table.Caption>A list of your recent invoices.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-24">Invoice</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head>Method</Table.Head>
					<Table.Head class={NUM}>Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each invoices as invoice (invoice.invoice)}
					<Table.Row>
						<Table.Cell class="font-medium">{invoice.invoice}</Table.Cell>
						<Table.Cell>{invoice.status}</Table.Cell>
						<Table.Cell>{invoice.method}</Table.Cell>
						<Table.Cell class={NUM}>{invoice.amount}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
			<Table.Footer>
				<Table.Row>
					<Table.Cell colspan={3}>Total</Table.Cell>
					<Table.Cell class={NUM}>$1,200.00</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Root>
	</section>

	<!-- 2 — selectable rows -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Selectable rows</h3>
			<p class="text-muted-foreground mt-1 text-xs">Checkbox column with select-all and per-row state.</p>
		</div>
		<Table.Root class={ROOT}>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-10">
						<Checkbox
							checked={allSelected}
							indeterminate={someSelected}
							onCheckedChange={(v) => toggleAll(v === true)}
							aria-label="Select all"
						/>
					</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head>Email</Table.Head>
					<Table.Head>Role</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each people as person (person.id)}
					{@const isSelected = selected.includes(person.id)}
					<Table.Row data-state={isSelected ? 'selected' : undefined}>
						<Table.Cell>
							<Checkbox
								checked={isSelected}
								onCheckedChange={(v) => toggleRow(person.id, v === true)}
								aria-label={`Select ${person.name}`}
							/>
						</Table.Cell>
						<Table.Cell class="font-medium">{person.name}</Table.Cell>
						<Table.Cell class="text-muted-foreground">{person.email}</Table.Cell>
						<Table.Cell>{person.role}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<p class="text-muted-foreground text-xs">{selected.length} of {people.length} row(s) selected.</p>
	</section>

	<!-- 3 — status badges -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With status badges</h3>
			<p class="text-muted-foreground mt-1 text-xs">Cells can hold any component, like a Badge.</p>
		</div>
		<Table.Root class={ROOT}>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-24">Order</Table.Head>
					<Table.Head>Customer</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head class={NUM}>Total</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each orders as order (order.id)}
					<Table.Row>
						<Table.Cell class="font-medium">{order.id}</Table.Cell>
						<Table.Cell>{order.customer}</Table.Cell>
						<Table.Cell>
							<Badge variant={order.variant}>{order.status}</Badge>
						</Table.Cell>
						<Table.Cell class={NUM}>{order.total}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</section>

	<!-- 4 — compact key/value -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Compact</h3>
			<p class="text-muted-foreground mt-1 text-xs">Headerless two-column layout for key/value pairs.</p>
		</div>
		<Table.Root class="w-full max-w-xs">
			<Table.Body>
				{#each specs as spec (spec.key)}
					<Table.Row>
						<Table.Cell class="text-muted-foreground">{spec.key}</Table.Cell>
						<Table.Cell class={NUM}>{spec.value}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</section>
</div>
