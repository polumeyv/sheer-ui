<script lang="ts">
	import * as Field from '$lib/components/field/index';
	import { Input } from '$lib/components/input/index';
	import { Switch } from '$lib/components/switch/index';

	let marketing = $state(true);
</script>

<Field.Set class="w-full max-w-sm">
	<Field.Legend>Profile</Field.Legend>
	<Field.Description>Update your account details below.</Field.Description>
	<Field.Group>
		<Field.Field>
			<Field.Label for="demo-name">Name</Field.Label>
			<Input id="demo-name" placeholder="Ada Lovelace" />
		</Field.Field>
		<Field.Field data-invalid={true}>
			<Field.Label for="demo-email">Email</Field.Label>
			<Input id="demo-email" type="email" value="not-an-email" aria-invalid={true} />
			<Field.Error errors={[{ message: 'Enter a valid email address.' }]} />
		</Field.Field>
		<Field.Separator />
		<Field.Field orientation="horizontal">
			<Field.Content>
				<Field.Label for="demo-marketing">Marketing emails</Field.Label>
				<Field.Description>Receive product updates and offers.</Field.Description>
			</Field.Content>
			<Switch id="demo-marketing" bind:checked={marketing} />
		</Field.Field>
	</Field.Group>
</Field.Set>
