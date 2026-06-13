<script lang="ts">
	import { boxWith } from "$lib/vendor/toolbelt/index.js";
	import type { FocusScopeImplProps } from "$lib/components/_shared/utilities/focus-scope/types.js";
	import { noop } from "$lib/internal/noop.js";
	import { FocusScope } from "$lib/components/_shared/utilities/focus-scope/focus-scope.svelte.js";

	let {
		enabled = false,
		trapFocus = false,
		loop = false,
		onCloseAutoFocus = noop,
		onOpenAutoFocus = noop,
		focusScope,
		ref,
	}: FocusScopeImplProps = $props();

	const focusScopeState = FocusScope.use({
		enabled: boxWith(() => enabled),
		trap: boxWith(() => trapFocus),
		loop: loop,
		onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
		onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
		ref,
	});
</script>

{@render focusScope?.({ props: focusScopeState.props })}
