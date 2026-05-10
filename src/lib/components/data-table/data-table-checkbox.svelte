<script lang="ts">
	import { Checkbox } from '@polumeyv/ui/checkbox';

	type CheckedState = boolean | "indeterminate";

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		onCheckedChange,
		...restProps
	}: {
		checked?: boolean;
		indeterminate?: boolean;
		onCheckedChange?: (checked: CheckedState) => void;
		"aria-label"?: string;
		class?: string;
	} = $props();
</script>

<Checkbox bind:checked bind:indeterminate {onCheckedChange} {...restProps} />
