<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { RemoteFormField, RemoteFormFieldValue } from '@sveltejs/kit';
	import * as Field from '../components/field/index.js';
	import { Input } from '../components/input/index.js';
	import type { FieldOrientation } from '../components/field/field.svelte';

	let {
		label,
		field,
		type = 'text',
		orientation,
		...rest
	}: Omit<HTMLInputAttributes, 'type'> & {
		label: string;
		field: RemoteFormField<RemoteFormFieldValue>;
		type?: string;
		orientation?: FieldOrientation;
	} = $props();

	const id = $props.id();
</script>

<Field.Field {orientation} data-invalid={!!field.issues()}>
	<Field.Label for={id}>{label}</Field.Label>
	<Input {id} {...field.as(type as 'text')} {...rest} />
	<Field.Error errors={field.issues()} />
</Field.Field>
