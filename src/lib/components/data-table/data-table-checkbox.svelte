<script lang="ts">
	import { Checkbox } from '../checkbox';
	import type { ClassValue } from 'svelte/elements';
	import type { CheckedState } from './data-table.svelte.js';

	// The table owns selection state: `checked`/`indeterminate` are derived from the table
	// (getIsSelected / getIsAllPageRowsSelected) and clicks flow out via `onCheckedChange`.
	// So this is a *controlled* checkbox — passing the values one-way. Using `bind:` here makes
	// the checkbox manage its own copy, which desyncs from the table (and trips
	// ownership_invalid_mutation, since the table passes these by spread, not `bind:`).
	let {
		checked = false,
		indeterminate = false,
		onCheckedChange,
		...restProps
	}: {
		checked?: boolean;
		indeterminate?: boolean;
		onCheckedChange?: (checked: CheckedState) => void;
		'aria-label'?: string;
		class?: ClassValue;
	} = $props();
</script>

<Checkbox {checked} {indeterminate} {onCheckedChange} {...restProps} />
