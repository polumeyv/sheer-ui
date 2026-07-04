<script lang="ts">
	import * as Accordion from '../components/accordion/index.js';
</script>

<Accordion.Root type="single" value="item-1" class="w-full sm:max-w-[70%]">
	<Accordion.Item value="item-1">
		<Accordion.Header>
			<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content>Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="item-2">
		<Accordion.Header>
			<Accordion.Trigger>Is it styled?</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content>Yes. It comes with default styles that match the other components.</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="item-3">
		<Accordion.Header>
			<Accordion.Trigger>Is it animated?</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content>Yes. It is animated by default, but you can disable it.</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
