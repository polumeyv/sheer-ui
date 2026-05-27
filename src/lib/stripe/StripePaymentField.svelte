<script lang="ts">
	import type { Stripe, StripeElements } from '@stripe/stripe-js';
	import { Button } from '@polumeyv/ui/button';
	import { toastError } from '@polumeyv/ui/sonner';
	import { Spinner } from '@polumeyv/ui/spinner';
	import { loadStripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';
	import type { PaymentMethod } from '@polumeyv/lib/public/types';

	let {
		stripeKey,
		createSetupIntent,
		setPayment,
		onsuccess,
		oncancel,
		returnUrl,
		label = 'Save Card',
		title,
		name: billingName,
		email,
	}: {
		stripeKey: string;
		createSetupIntent: () => Promise<{ clientSecret: string; customerSessionClientSecret: string }>;
		setPayment: (paymentMethodId: string) => Promise<typeof PaymentMethod.Type>;
		onsuccess: (pm: typeof PaymentMethod.Type) => void;
		oncancel?: () => void;
		returnUrl: string;
		label?: string;
		title?: string;
		name?: string;
		email?: string;
	} = $props();

	let stripe = $state<Stripe | null>(null);
	let elements = $state<StripeElements | null>(null);
	let submitting = $state(false);
	let loading = $state(true);
	let paymentDiv: HTMLDivElement;

	onMount(() => {
		let paymentEl: { unmount(): void } | null = null;
		Promise.all([createSetupIntent(), loadStripe(stripeKey)])
			.then(([{ clientSecret, customerSessionClientSecret }, s]) => {
				if (!s || !clientSecret) throw new Error('Failed to initialize payment');
				const isDark = document.documentElement.classList.contains('dark');
				stripe = s;
				elements = s.elements({
					clientSecret,
					customerSessionClientSecret,
					appearance: {
						theme: isDark ? 'night' : 'stripe',
						variables: {
							colorPrimary: isDark ? 'hsl(41, 69%, 62%)' : 'hsl(40, 91%, 45%)',
							tabIconColor: isDark ? '#a3a3a3' : '#737373',
							tabIconHoverColor: isDark ? '#ffffff' : '#000000',
							tabIconSelectedColor: '#1f1f1f',
							colorBackground: isDark ? 'hsl(80 2.1% 12.4%)' : '#ffffff',
							logoColor: isDark ? 'light' : 'dark',
						},
					},
				});
				const el = elements.create('payment', {
					defaultValues: {
						billingDetails: {
							name: billingName || undefined,
							email: email || undefined,
						},
					},
				});
				el.mount(paymentDiv);
				el.on('ready', () => (loading = false));
				paymentEl = el;
			})
			.catch(() => (loading = false));
		return () => paymentEl?.unmount();
	});

	const submit = () => {
		if (!stripe || !elements) return;
		submitting = true;
		stripe
			.confirmSetup({ elements, confirmParams: { return_url: returnUrl }, redirect: 'if_required' })
			.then(({ error, setupIntent }) => {
				if (error) return void toastError(error.message || 'Payment setup failed');
				const pmId = typeof setupIntent?.payment_method === 'string' ? setupIntent.payment_method : setupIntent?.payment_method?.id;
				if (!pmId) return void toastError('Could not identify payment method');
				return setPayment(pmId).then(onsuccess);
			}, toastError)
			.finally(() => void (submitting = false));
	};
</script>

<div class="relative min-h-100">
	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center">
			<Spinner class="size-20 text-muted" />
		</div>
	{/if}
	<div class="w-full pt-1 flex flex-col justify-between min-h-full" class:hidden={loading}>
		{#if title}
			<h3 class="text-base font-medium mb-4">{title}</h3>
		{/if}
		<div bind:this={paymentDiv} class="w-full"></div>
		<div class="flex justify-end gap-2 mt-4">
			{#if oncancel}
				<Button variant="outline" disabled={submitting} onclick={oncancel}>Cancel</Button>
			{/if}
			<Button disabled={submitting || !elements} onclick={submit}>
				{#if submitting}<Spinner class="size-4" />{/if}
				{label}
			</Button>
		</div>
	</div>
</div>
