import { flushSync, mount, unmount, type Component } from "svelte";

type AnyProps = Record<string, any>;

const live = new Set<() => void>();

export function render<Props extends AnyProps, Exports extends AnyProps>(
	Fixture: Component<Props, Exports>,
	props?: Props
): { component: Exports; target: HTMLElement; unmount: () => void } {
	const target = document.createElement("div");
	document.body.append(target);

	const component = mount(Fixture, { props: (props ?? {}) as Props, target });
	flushSync();

	const dispose = () => {
		if (!live.delete(dispose)) return;
		unmount(component);
	};
	live.add(dispose);

	return { component, target, unmount: dispose };
}

export function el<E extends Element = HTMLElement>(testId: string): E {
	const node = document.body.querySelector<E>(`[data-testid="${testId}"]`);
	if (!node) throw new Error(`Expected [data-testid="${testId}"] to render`);
	return node;
}

export function text(testId: string): string {
	return el(testId).textContent ?? "";
}

export function click(testId: string): void {
	el(testId).click();
	flushSync();
}

export function cleanup(): void {
	for (const dispose of [...live]) dispose();
	document.body.innerHTML = "";
}
