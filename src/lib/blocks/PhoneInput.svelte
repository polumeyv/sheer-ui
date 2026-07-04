<script lang="ts">
	import * as NativeSelect from '../components/native-select';
	import { Input } from '../components/input';

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
	<NativeSelect.Root
		value={country}
		widthClass="w-26 bg-border/30"
		onchange={(e) => {
			country = e.currentTarget.value as CountryCode;
			value = toE164();
			onchange?.(value);
		}}
		{disabled}>
		{#each Object.keys(COUNTRIES) as code (code)}
			<NativeSelect.Option value={code}>{code}</NativeSelect.Option>
		{/each}
	</NativeSelect.Root>
	<div data-slot="input-group" class="wrap-input-identity group/input-group">
		<div class="select-none text-muted-foreground h-auto pl-2 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50">
			+{COUNTRIES[country]}
		</div>
		<Input
			type="tel"
			{placeholder}
			autocomplete="tel-national"
			inputmode="numeric"
			variant="invisible"
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
	</div>
	{#if name}
		<input type="hidden" {name} value={toE164()} />
	{/if}
</div>
