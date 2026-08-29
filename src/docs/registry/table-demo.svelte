<script lang="ts">
	import * as Table from '../../lib/components/table/index.js';

	const invoices = [
		{ invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
		{ invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
		{ invoice: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
		{ invoice: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
		{ invoice: 'INV005', status: 'Paid', method: 'PayPal', amount: '$550.00' }
	];
</script>

<Table.Root class="w-full max-w-2xl">
	<Table.Caption>A list of your recent invoices.</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-25">Invoice</Table.Head>
			<Table.Head>Status</Table.Head>
			<Table.Head>Method</Table.Head>
			<Table.Head class="text-right">Amount</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each invoices as invoice (invoice.invoice)}
			<Table.Row>
				<Table.Cell class="font-medium">{invoice.invoice}</Table.Cell>
				<Table.Cell>{invoice.status}</Table.Cell>
				<Table.Cell>{invoice.method}</Table.Cell>
				<Table.Cell class="text-right">{invoice.amount}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
	<Table.Footer>
		<Table.Row>
			<Table.Cell colspan={3}>Total</Table.Cell>
			<Table.Cell class="text-right">$1,750.00</Table.Cell>
		</Table.Row>
	</Table.Footer>
</Table.Root>
