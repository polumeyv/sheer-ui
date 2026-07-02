<script lang="ts" module>
	export const title = 'Indeterminate';
</script>

<script lang="ts">
	import { CheckboxNative } from '$lib/components/checkbox-native/index.js';
	import { Label } from '$lib/components/label/index.js';

	let channels = $state({ email: true, sms: false, push: false });
	const values = $derived(Object.values(channels));
	const allChecked = $derived(values.every(Boolean));
	const someChecked = $derived(values.some(Boolean) && !allChecked);
</script>

<div class="flex flex-col gap-3">
	<div class="flex items-center gap-2">
		<CheckboxNative
			id="cbn-all"
			checked={allChecked}
			indeterminate={someChecked}
			onCheckedChange={(c) => (channels = { email: c, sms: c, push: c })} />
		<Label.Root for="cbn-all">All notifications</Label.Root>
	</div>
	<div class="ml-6 flex flex-col gap-3">
		<div class="flex items-center gap-2">
			<CheckboxNative id="cbn-email" bind:checked={channels.email} />
			<Label.Root for="cbn-email">Email</Label.Root>
		</div>
		<div class="flex items-center gap-2">
			<CheckboxNative id="cbn-sms" bind:checked={channels.sms} />
			<Label.Root for="cbn-sms">SMS</Label.Root>
		</div>
		<div class="flex items-center gap-2">
			<CheckboxNative id="cbn-push" bind:checked={channels.push} />
			<Label.Root for="cbn-push">Push</Label.Root>
		</div>
	</div>
</div>
