import { flushSync, mount, unmount } from 'svelte';
import { describe, expect, test } from 'vitest';
import MenuContentCompositionFixture from './menu-content-composition.fixture.svelte';

type Family = 'context-menu' | 'dropdown-menu' | 'menubar';

const families: { family: Family; dataSlot: string; minWidth: string; cssVar: string }[] = [
	{
		family: 'dropdown-menu',
		dataSlot: 'dropdown-menu-content',
		minWidth: 'min-w-[8rem]',
		cssVar: '--bits-dropdown-menu-content-transform-origin',
	},
	{
		family: 'context-menu',
		dataSlot: 'context-menu-content',
		minWidth: 'min-w-[8rem]',
		cssVar: '--bits-context-menu-content-transform-origin',
	},
	{ family: 'menubar', dataSlot: 'menubar-content', minWidth: 'min-w-[12rem]', cssVar: '--bits-menu-content-transform-origin' },
];

function render(props: { family: Family; isStatic?: boolean }) {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(MenuContentCompositionFixture, { props, target });
	flushSync();
	return component;
}

function cleanup(component: ReturnType<typeof mount>) {
	unmount(component);
	document.body.innerHTML = '';
}

function getContent(dataSlot: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-slot="${dataSlot}"]`);
	if (!node) throw new Error(`Expected ${dataSlot} to render`);
	return node;
}

function readOpen() {
	const node = document.body.querySelector('[data-testid="open"]');
	if (!node) throw new Error('Expected the open readout to render');
	return node.textContent;
}

describe('menu family Content composition', () => {
	test.each(families)('$family Content keeps its own slot, class and css vars', ({ family, dataSlot, minWidth, cssVar }) => {
		const component = render({ family });

		try {
			const content = getContent(dataSlot);
			expect(content.className).toContain(minWidth);
			expect(content.getAttribute('style')).toContain(cssVar);
		} finally {
			cleanup(component);
		}
	});

	test.each(families)('$family Content is floating and ContentStatic is not', ({ family, dataSlot }) => {
		const floating = render({ family });

		try {
			expect(getContent(dataSlot).closest('[data-bits-floating-content-wrapper]')).not.toBeNull();
		} finally {
			cleanup(floating);
		}

		const staticContent = render({ family, isStatic: true });

		try {
			expect(getContent(dataSlot).closest('[data-bits-floating-content-wrapper]')).toBeNull();
		} finally {
			cleanup(staticContent);
		}
	});

	test.each(families)('$family closes on Escape in both Content variants', ({ family }) => {
		for (const isStatic of [false, true]) {
			const component = render({ family, isStatic });

			try {
				expect(readOpen()).toBe('true');

				document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
				flushSync();

				expect(readOpen()).toBe('false');
			} finally {
				cleanup(component);
			}
		}
	});
});
