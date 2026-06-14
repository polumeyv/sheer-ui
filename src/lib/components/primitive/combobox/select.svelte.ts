/**
 * Barrel for the select/combobox primitive state.
 *
 * The implementation is split by context concern:
 * - `select-shared.ts`        — shared constants + bits attribute config
 * - `select-root.svelte.ts`   — root context (`SelectRoot`) + root-scoped state
 * - `select-group.svelte.ts`  — group context (`SelectGroupState`)
 * - `select-content.svelte.ts` — content context (`SelectContentState`)
 *
 * This file preserves the original public surface so existing
 * `combobox/primitive/select.svelte` imports keep working unchanged.
 */
export { INTERACTION_KEYS, FIRST_KEYS, LAST_KEYS, FIRST_LAST_KEYS, SELECTION_KEYS, CONTENT_MARGIN } from './select-shared';

export {
	SelectSingleRootState,
	SelectRootState,
	SelectValueState,
	SelectInputState,
	SelectComboTriggerState,
	SelectTriggerState,
	SelectItemState,
	SelectHiddenInputState,
} from './select-root.svelte';

export { SelectGroupState, SelectGroupHeadingState } from './select-group.svelte';

export {
	SelectContentState,
	SelectViewportState,
	SelectScrollButtonImplState,
	SelectScrollDownButtonState,
	SelectScrollUpButtonState,
} from './select-content.svelte';
