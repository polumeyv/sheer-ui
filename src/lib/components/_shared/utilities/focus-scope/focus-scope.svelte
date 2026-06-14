<script lang="ts">
		import type { FocusScopeImplProps } from "$lib/components/_shared/utilities/focus-scope/index";
	import { FocusScope } from "$lib/components/_shared/utilities/focus-scope/use-focus-scope.svelte";

	let {
		enabled = false,
		trapFocus = false,
		loop = false,
		onCloseAutoFocus = (() => {}),
		onOpenAutoFocus = (() => {}),
		focusScope,
		ref,
	}: FocusScopeImplProps = $props();

	const focusScopeState = FocusScope.use({
		enabled: { get current() { return enabled; } },
		trap: { get current() { return trapFocus; } },
		loop: loop,
		onCloseAutoFocus: { get current() { return onCloseAutoFocus; } },
		onOpenAutoFocus: { get current() { return onOpenAutoFocus; } },
		ref,
	});
</script>

{@render focusScope?.({ props: focusScopeState.props })}
