import { describe, expect, test } from "bun:test";
import type { Attachment } from "svelte/attachments";
import { attachRef, mountedAttachment, type RefAttachment } from "./attach-ref.js";

function getAttachment<T extends EventTarget>(refAttachment: RefAttachment<T>) {
	const key = Object.getOwnPropertySymbols(refAttachment)[0];
	if (key === undefined) throw new Error("attachRef did not create an attachment key");

	return refAttachment[key] as Attachment<T>;
}

describe("attachRef", () => {
	test("sets and clears writable refs", () => {
		const node = new EventTarget();
		const ref = { current: null as EventTarget | null };
		const changes: Array<EventTarget | null> = [];
		const detach = getAttachment(attachRef(ref, (value) => changes.push(value)))(node);

		expect(ref.current).toBe(node);
		expect(changes).toEqual([node]);

		detach?.();

		expect(ref.current).toBeNull();
		expect(changes).toEqual([node, null]);
	});

	test("sets and clears callback refs", () => {
		const node = new EventTarget();
		const values: Array<EventTarget | null> = [];
		const detach = getAttachment(attachRef((value: EventTarget | null) => values.push(value)))(node);

		expect(values).toEqual([node]);

		detach?.();

		expect(values).toEqual([node, null]);
	});

	test("keeps refs while detached node is still connected", () => {
		const node = Object.assign(new EventTarget(), { isConnected: true });
		const ref = { current: null as typeof node | null };
		const changes: Array<typeof node | null> = [];
		const detach = getAttachment(attachRef(ref, (value) => changes.push(value)))(node);

		detach?.();

		expect(ref.current).toBe(node);
		expect(changes).toEqual([node]);
	});
});

describe("mountedAttachment", () => {
	test("sets mounted true on attach and false on detach", () => {
		const node = new EventTarget();
		const values: boolean[] = [];
		const detach = getAttachment(mountedAttachment<EventTarget>((mounted) => values.push(mounted)))(
			node
		);

		expect(values).toEqual([true]);

		detach?.();

		expect(values).toEqual([true, false]);
	});

	test("sets mounted false whenever the attachment cleans up", () => {
		const node = Object.assign(new EventTarget(), { isConnected: true });
		const values: boolean[] = [];
		const detach = getAttachment(mountedAttachment<typeof node>((mounted) => values.push(mounted)))(
			node
		);

		detach?.();

		expect(values).toEqual([true, false]);
	});
});
