<script lang="ts">
	import { Label } from '$lib/components/label/index';
	import { Input } from '$lib/components/input/index';
</script>

<div class="grid w-full max-w-sm items-center gap-3">
	<Label for="email">Email</Label>
	<Input id="email" type="email" placeholder="name@example.com" />
</div>
