<script lang="ts">
	import * as Accordion from '../../src/lib/components/accordion/index.js';

	let {
		type,
		value = $bindable(),
	}: {
		type: 'single' | 'multiple';
		value?: string | string[];
	} = $props();

	const items = ['alpha', 'beta', 'gamma'];

	function formatValue(current: string | string[] | undefined) {
		if (Array.isArray(current)) return `[${current.join(',')}]`;
		return current ?? 'undefined';
	}

	export function setValue(next: string | string[] | undefined) {
		value = next;
	}

	export function getValue() {
		return value;
	}
</script>

<output data-testid="value">{formatValue(value)}</output>

<Accordion.Root {type} bind:value>
	{#each items as item (item)}
		<Accordion.Item value={item} data-testid="item-{item}">
			<Accordion.Trigger data-testid="trigger-{item}">{item}</Accordion.Trigger>
			<Accordion.Content>{item} content</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
