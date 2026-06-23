<script lang="ts">
	import * as Field from '$lib/components/field/index.js';
	import { Input } from '$lib/components/input/index.js';
</script>

<Field.Set class="w-full sm:max-w-sm">
	<Field.Legend>Profile</Field.Legend>
	<Field.Description>This information will be displayed publicly.</Field.Description>
	<Field.Group>
		<Field.Field>
			<Field.Label for="field-name">Name</Field.Label>
			<Input id="field-name" placeholder="Evil Rabbit" />
			<Field.Description>This is your public display name.</Field.Description>
		</Field.Field>
		<Field.Field>
			<Field.Label for="field-email">Email</Field.Label>
			<Input id="field-email" type="email" placeholder="hi@example.com" />
			<Field.Description>We'll never share your email.</Field.Description>
		</Field.Field>
	</Field.Group>
</Field.Set>
