<script lang="ts">
	import * as InputGroup from '../components/input-group';
	import * as Select from '../components/select';

	const COUNTRIES = { US: 1, CA: 1, MX: 52 } as const;
	type CountryCode = keyof typeof COUNTRIES;

	let {
		name,
		value = $bindable(''),
		onchange,
		error,
		placeholder = 'Phone Number',
		disabled = false,
	}: {
		name?: string;
		value?: string;
		onchange?: (value: string) => void;
		error?: string;
		placeholder?: string;
		disabled?: boolean;
	} = $props();

	let raw = $state('');
	let country: CountryCode = $state('US');

	const clean = (v: string) => v.replace(/\D/g, '').slice(0, 10);
	const toE164 = () => (raw ? `+${COUNTRIES[country]}${clean(raw)}` : '');
</script>

<div class="flex w-full gap-2">
	<Select.Root
		type="single"
		value={country}
		onValueChange={(v) => {
			country = v as CountryCode;
			value = toE164();
			onchange?.(value);
		}}
		{disabled}>
		<Select.Trigger>{country}</Select.Trigger>
		<Select.Content>
			{#each Object.entries(COUNTRIES) as [code, dial] (code)}
				<Select.Item value={code}>{code}: +{dial}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	<InputGroup.Root>
		<InputGroup.Text class="ml-2 select-none">+{COUNTRIES[country]}</InputGroup.Text>
		<InputGroup.Input
			type="tel"
			{placeholder}
			autocomplete="tel-national"
			inputmode="numeric"
			class="w-full"
			aria-invalid={!!error || undefined}
			value={clean(raw)}
			{disabled}
			onbeforeinput={(e) => e.data && /\D/.test(e.data) && e.preventDefault()}
			oninput={(e: Event) => {
				raw = clean((e.target as HTMLInputElement).value);
				value = toE164();
				onchange?.(value);
			}} />
	</InputGroup.Root>
	{#if name}
		<input type="hidden" {name} value={toE164()} />
	{/if}
</div>
