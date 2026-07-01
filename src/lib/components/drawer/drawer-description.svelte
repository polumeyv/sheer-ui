<script lang="ts">
	import { join } from 'overrule';
	import { Description, type DescriptionProps } from '$lib/components/dialog/index.js';

	let { ref = $bindable(null), class: className, ...restProps }: DescriptionProps = $props();
</script>

<Description bind:ref data-slot="drawer-description" class={join('text-muted-foreground text-sm', className)} {...restProps} />
