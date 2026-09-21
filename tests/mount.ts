import { flushSync, mount, unmount as destroy, type Component } from "svelte";

const mounted = new Set<Record<string, any>>();

// Mounts into a fresh <div> on the body (or `target`) and flushes. `cleanup` runs after every test
// from setup.ts, so a suite only unmounts by hand when the unmount is what it asserts on.
export function mountInBody<Props extends Record<string, any>, Exports extends Record<string, any>>(
	component: Component<Props, Exports, any>,
	props?: Props,
	target: HTMLElement = document.body.appendChild(document.createElement("div")),
) {
	const instance = mount(component, { target, props } as Parameters<typeof mount<Props, Exports>>[1]);
	mounted.add(instance);
	flushSync();
	return { component: instance, target };
}

// svelte's own `unmount` warns on a second call, so suites unmount through here and `cleanup` skips them.
export function unmount(component: Record<string, any>) {
	mounted.delete(component);
	return destroy(component);
}

export function cleanup() {
	for (const component of mounted) void destroy(component);
	mounted.clear();
	document.body.innerHTML = "";
}
