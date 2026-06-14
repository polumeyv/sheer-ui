<script lang="ts">
	import { Progress } from '$lib/components/progress/index';

	const value = 60;
</script>

<div class="flex w-full max-w-sm flex-col gap-2">
	<div class="flex items-center justify-between text-sm">
		<span class="text-muted-foreground">Uploading</span>
		<span class="font-medium">{value}%</span>
	</div>
	<Progress {value} max={100} />
</div>
