<script lang="ts" module>
	export const title = 'Disabled';
</script>

<script lang="ts">
	import * as Checkbox from '../../lib/components/checkbox/index.js';
	import { Label } from '../../lib/components/label/index.js';
</script>

<div class="flex items-center gap-2">
	<Checkbox.Root id="disabled-terms" disabled />
	<Label.Root for="disabled-terms">Accept terms and conditions</Label.Root>
</div>
