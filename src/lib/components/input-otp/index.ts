import type { PinInputCellProps } from '$lib/bits/pin-input/types.js';
export { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from '$lib/bits/pin-input/pin-input.svelte.js';
import Root from './input-otp.svelte';
import Group from './input-otp-group.svelte';
import Separator from './input-otp-separator.svelte';
import Slot from './input-otp-slot.svelte';

export type Cell = PinInputCellProps['cell'];
export type RootSnippetProps = { cells: Cell[]; isFocused: boolean; isHovering: boolean };

export {
	Root,
	Group,
	Slot,
	Separator,
	Root as InputOTP,
	Group as InputOTPGroup,
	Slot as InputOTPSlot,
	Separator as InputOTPSeparator,
};
