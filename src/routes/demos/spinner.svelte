<script lang="ts">
	import { Spinner } from '$lib/components/spinner/index';
	import { Button } from '$lib/components/button/index';
</script>

<div class="flex flex-wrap items-center gap-6">
	<Spinner />
	<Spinner class="size-6" />
	<Spinner class="size-10 text-muted" />
	<Button disabled>
		<Spinner class="size-4" />
		Loading
	</Button>
</div>
