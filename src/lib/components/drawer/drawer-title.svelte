<script lang="ts">
	import { join } from 'overrule';
	import { Title, type TitleProps } from '../dialog/index.js';

	let { ref = $bindable(null), class: className, ...restProps }: TitleProps = $props();
</script>

<Title bind:ref data-slot="drawer-title" class={join('text-foreground font-semibold', className)} {...restProps} />
