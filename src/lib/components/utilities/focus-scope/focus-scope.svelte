<script lang="ts">
	import { boxWith } from "$lib/internal/toolbelt.js";
	import type { FocusScopeImplProps } from "./types.js";
	import { FocusScope } from "./focus-scope.svelte.js";

	let {
		enabled = false,
		trapFocus = false,
		loop = false,
		onCloseAutoFocus = () => {},
		onOpenAutoFocus = () => {},
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
