<script lang="ts">
	import * as Tabs from '$lib/components/tabs/index';
	import User from '@lucide/svelte/icons/user';
	import Lock from '@lucide/svelte/icons/lock';
	import Bell from '@lucide/svelte/icons/bell';
	import CreditCard from '@lucide/svelte/icons/credit-card';

	// Shared part styling, factored out so each example stays copy-paste sized.
	const PANEL = 'rounded-lg border p-4 text-sm';
	const PANEL_TITLE = 'font-medium';
	const PANEL_BODY = 'text-muted-foreground mt-1';
	const FIELD = 'flex flex-col gap-1.5';
	const LABEL = 'text-sm font-medium';
	const INPUT =
		'border-input bg-background ring-offset-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none';
	const BUTTON =
		'bg-primary text-primary-foreground hover:bg-primary/90 mt-1 inline-flex h-9 w-fit items-center justify-center rounded-md px-4 text-sm font-medium';

	// 1 — default (with icons), mirrors the original demo
	let account = $state('account');

	// 2 — simple text tabs
	let view = $state('overview');

	// 3 — vertical orientation
	let pane = $state('general');

	// 4 — disabled tab + manual activation
	let billing = $state('plan');

	// 5 — with form fields, controlled value shown live
	let settings = $state('profile');
</script>

<div class="grid w-full max-w-3xl gap-x-10 gap-y-10 sm:grid-cols-2">
	<!-- 1 — default with icons -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With icons</h3>
			<p class="text-muted-foreground mt-1 text-xs">Triggers can hold an icon plus a label.</p>
		</div>
		<Tabs.Root bind:value={account} class="w-full">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="account">
					<User />
					Account
				</Tabs.Trigger>
				<Tabs.Trigger value="password">
					<Lock />
					Password
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="account" class={PANEL}>
				<p class={PANEL_TITLE}>Account</p>
				<p class={PANEL_BODY}>Make changes to your account here. Click save when you're done.</p>
			</Tabs.Content>
			<Tabs.Content value="password" class={PANEL}>
				<p class={PANEL_TITLE}>Password</p>
				<p class={PANEL_BODY}>Change your password here. After saving, you'll be logged out.</p>
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<!-- 2 — simple text tabs -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Text only</h3>
			<p class="text-muted-foreground mt-1 text-xs">The minimal three-trigger setup.</p>
		</div>
		<Tabs.Root bind:value={view} class="w-full">
			<Tabs.List>
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
				<Tabs.Trigger value="reports">Reports</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="overview" class={PANEL}>
				<p class={PANEL_TITLE}>Overview</p>
				<p class={PANEL_BODY}>A high-level summary of everything at a glance.</p>
			</Tabs.Content>
			<Tabs.Content value="analytics" class={PANEL}>
				<p class={PANEL_TITLE}>Analytics</p>
				<p class={PANEL_BODY}>Charts and trends over the selected period.</p>
			</Tabs.Content>
			<Tabs.Content value="reports" class={PANEL}>
				<p class={PANEL_TITLE}>Reports</p>
				<p class={PANEL_BODY}>Exportable breakdowns you can share.</p>
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<!-- 3 — vertical orientation -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Vertical</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				<code>orientation="vertical"</code> stacks the list beside the panel.
			</p>
		</div>
		<Tabs.Root bind:value={pane} orientation="vertical" class="w-full flex-row gap-4">
			<Tabs.List class="h-auto flex-col">
				<Tabs.Trigger value="general" class="w-full justify-start">General</Tabs.Trigger>
				<Tabs.Trigger value="appearance" class="w-full justify-start">Appearance</Tabs.Trigger>
				<Tabs.Trigger value="advanced" class="w-full justify-start">Advanced</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="general" class={PANEL}>
				<p class={PANEL_TITLE}>General</p>
				<p class={PANEL_BODY}>Name, language and regional preferences.</p>
			</Tabs.Content>
			<Tabs.Content value="appearance" class={PANEL}>
				<p class={PANEL_TITLE}>Appearance</p>
				<p class={PANEL_BODY}>Theme, density and accent color.</p>
			</Tabs.Content>
			<Tabs.Content value="advanced" class={PANEL}>
				<p class={PANEL_TITLE}>Advanced</p>
				<p class={PANEL_BODY}>Experimental flags and developer options.</p>
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<!-- 4 — disabled tab + manual activation -->
	<section class="space-y-2">
		<div>
			<h3 class="text-sm leading-none font-medium">Disabled tab</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				One trigger is disabled; <code>activationMode="manual"</code>.
			</p>
		</div>
		<Tabs.Root bind:value={billing} activationMode="manual" class="w-full">
			<Tabs.List class="grid w-full grid-cols-3">
				<Tabs.Trigger value="plan">
					<CreditCard />
					Plan
				</Tabs.Trigger>
				<Tabs.Trigger value="usage">
					<Bell />
					Usage
				</Tabs.Trigger>
				<Tabs.Trigger value="invoices" disabled>Invoices</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="plan" class={PANEL}>
				<p class={PANEL_TITLE}>Plan</p>
				<p class={PANEL_BODY}>You're on the Pro plan. Renews monthly.</p>
			</Tabs.Content>
			<Tabs.Content value="usage" class={PANEL}>
				<p class={PANEL_TITLE}>Usage</p>
				<p class={PANEL_BODY}>You've used 62% of your included quota.</p>
			</Tabs.Content>
			<Tabs.Content value="invoices" class={PANEL}>
				<p class={PANEL_TITLE}>Invoices</p>
				<p class={PANEL_BODY}>No invoices yet.</p>
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<!-- 5 — with form fields -->
	<section class="space-y-2 sm:col-span-2">
		<div>
			<h3 class="text-sm leading-none font-medium">With forms</h3>
			<p class="text-muted-foreground mt-1 text-xs">
				Each panel holds its own form; the active value is bound.
			</p>
		</div>
		<Tabs.Root bind:value={settings} class="w-full max-w-md">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="profile">Profile</Tabs.Trigger>
				<Tabs.Trigger value="security">Security</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="profile" class="{PANEL} space-y-3">
				<div class={FIELD}>
					<label class={LABEL} for="tabs-name">Name</label>
					<input id="tabs-name" class={INPUT} value="Ada Lovelace" />
				</div>
				<div class={FIELD}>
					<label class={LABEL} for="tabs-username">Username</label>
					<input id="tabs-username" class={INPUT} value="@ada" />
				</div>
				<button type="button" class={BUTTON}>Save changes</button>
			</Tabs.Content>
			<Tabs.Content value="security" class="{PANEL} space-y-3">
				<div class={FIELD}>
					<label class={LABEL} for="tabs-current">Current password</label>
					<input id="tabs-current" type="password" class={INPUT} value="" />
				</div>
				<div class={FIELD}>
					<label class={LABEL} for="tabs-new">New password</label>
					<input id="tabs-new" type="password" class={INPUT} value="" />
				</div>
				<button type="button" class={BUTTON}>Update password</button>
			</Tabs.Content>
		</Tabs.Root>
	</section>
</div>
