<script lang="ts">
	import * as Alert from '$lib/components/alert/index';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
</script>

<Alert.Root variant="destructive" class="w-full max-w-md">
	<AlertCircle class="size-4" />
	<Alert.Title>Error</Alert.Title>
	<Alert.Description>Your session has expired. Please sign in again.</Alert.Description>
</Alert.Root>
