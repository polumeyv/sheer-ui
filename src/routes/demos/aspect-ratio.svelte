<script lang="ts">
	import { AspectRatio } from '$lib/components/aspect-ratio/index';
</script>

<div class="w-full max-w-sm">
	<AspectRatio ratio={16 / 9} class="overflow-hidden rounded-md bg-muted">
		<img
			src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
			alt="A scenic landscape"
			class="h-full w-full object-cover"
		/>
	</AspectRatio>
</div>
