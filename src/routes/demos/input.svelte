<script lang="ts">
	import { Input } from '$lib/components/input/index';
	import { Label } from '$lib/components/label/index';
</script>

<div class="grid w-full max-w-sm items-center gap-2">
	<Label for="email">Email</Label>
	<Input id="email" type="email" placeholder="you@example.com" />
</div>
