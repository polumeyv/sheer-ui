<script lang="ts" module>
	export const title = 'States';
</script>

<script lang="ts">
	import { CheckboxNative } from '../../lib/components/checkbox-native/index.js';
	import { Label } from '../../lib/components/label/index.js';
</script>

<div class="grid gap-4 sm:grid-cols-2">
	<div class="flex items-center gap-2">
		<CheckboxNative id="cbn-s-disabled" disabled />
		<Label.Root for="cbn-s-disabled" class="opacity-50">Disabled</Label.Root>
	</div>
	<div class="flex items-center gap-2">
		<CheckboxNative id="cbn-s-disabled-checked" disabled checked />
		<Label.Root for="cbn-s-disabled-checked" class="opacity-50">Disabled, checked</Label.Root>
	</div>
	<div class="flex items-center gap-2">
		<CheckboxNative id="cbn-s-readonly" readonly checked />
		<Label.Root for="cbn-s-readonly">Readonly (click does nothing)</Label.Root>
	</div>
	<div class="flex items-center gap-2">
		<CheckboxNative id="cbn-s-invalid" aria-invalid="true" />
		<Label.Root for="cbn-s-invalid">Invalid</Label.Root>
	</div>
</div>
