<script lang="ts">
	import type { Component } from 'svelte';
	import * as Empty from "$lib/components/empty";
	import { Button } from "$lib/components/button";
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import Search from '@lucide/svelte/icons/search';
	import Lock from '@lucide/svelte/icons/lock';
	import Clock from '@lucide/svelte/icons/clock';
	import Info from '@lucide/svelte/icons/info';

	const ERROR_CONFIG = {
		NOT_FOUND: { title: 'Not Found', message: "The page or resource you're looking for doesn't exist.", icon: Search, codes: [404, 410] },
		AUTH: { title: 'Access Denied', message: "You don't have permission to access this page.", icon: Lock, codes: [403] },
		SIGN_IN: { title: 'Sign In Required', message: "You don't have permission to access this page.", icon: Lock, codes: [401] },
		TIMEOUT: { title: 'Request Timeout', message: 'The request took too long. Please wait a moment and try again.', icon: Clock, codes: [408, 429, 504] },
		SERVER: { title: 'Something Went Wrong', message: "We're having trouble right now. Please try again later.", icon: AlertCircle, codes: [500, 502, 503] },
		CLIENT: { title: 'Bad Request', message: 'Something went wrong with your request. Please try again.', icon: AlertCircle, codes: [400, 409, 422] },
	};

	const getErrorConfig = (status: number) => {
		const match = Object.values(ERROR_CONFIG).find((c) => c.codes.includes(status));
		return match ?? { title: `Error ${status}`, message: 'An unexpected error occurred.', icon: Info };
	};

	let {
		status,
		message,
		class: className,
		homeHref = '/',
		homeLabel = 'Go Home',
		showBack = true,
		showRetry = true,
		showHome = true,
	}: {
		status: number;
		message?: string | null;
		class?: string;
		homeHref?: string;
		homeLabel?: string;
		showBack?: boolean;
		showRetry?: boolean;
		showHome?: boolean;
	} = $props();

	const errorInfo = $derived(getErrorConfig(status));
</script>

<Empty.Root class={className}>
	<Empty.Header>
		<Empty.Media variant="icon">
			<errorInfo.icon />
		</Empty.Media>
		<Empty.Title>{errorInfo.title}</Empty.Title>
		<Empty.Description>{message || errorInfo.message}</Empty.Description>
	</Empty.Header>
	<Empty.Content class="flex-row gap-6 justify-center">
		{#if showBack}
			<Button variant="outline" onclick={() => history.back()}>Go Back</Button>
		{/if}
		{#if showHome}
			<Button href={homeHref}>{homeLabel}</Button>
		{/if}
	</Empty.Content>
</Empty.Root>
