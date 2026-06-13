import { tick } from "svelte";
import type { AnyFn } from "$lib/vendor/toolbelt/types.js";

export function afterTick(fn: AnyFn) {
	tick().then(fn);
}
