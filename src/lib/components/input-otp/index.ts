import type { PinInputCellProps } from '$lib/components/primitive/pin-input/index';
export { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from '$lib/components/primitive/pin-input/pin-input.svelte';
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
