import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test } from 'vitest';
import Fixture from './portal.fixture.svelte';

afterEach(() => {
	document.body.innerHTML = '';
});

const render = (props: Record<string, unknown> = {}) => {
	const host = document.createElement('div');
	document.body.append(host);
	const component = mount(Fixture, { target: host, props });
	flushSync();
	return { host, component };
};

const portaled = (root: ParentNode) => root.querySelector('[data-testid="portaled"]');

describe('Portal', () => {
	test('mounts into the target and removes itself on unmount', () => {
		const target = document.createElement('div');
		document.body.append(target);

		const { host, component } = render({ to: target });
		expect(portaled(target)).not.toBeNull();
		expect(portaled(host)).toBeNull();

		unmount(component);
		flushSync();
		expect(portaled(target)).toBeNull();
	});

	test('defaults to document.body', () => {
		const { host, component } = render();
		try {
			expect(portaled(host)).toBeNull();
			expect(portaled(document.body)).not.toBeNull();
		} finally {
			unmount(component);
		}
	});

	test('resolves a string selector', () => {
		const target = document.createElement('div');
		target.id = 'portal-target';
		document.body.append(target);

		const { component } = render({ to: '#portal-target' });
		try {
			expect(portaled(target)).not.toBeNull();
		} finally {
			unmount(component);
		}
	});

	test('disabled renders inline', () => {
		const target = document.createElement('div');
		document.body.append(target);

		const { host, component } = render({ to: target, disabled: true });
		try {
			expect(portaled(host)).not.toBeNull();
			expect(portaled(target)).toBeNull();
		} finally {
			unmount(component);
		}
	});

	test('re-teleports when `to` changes', () => {
		const a = document.createElement('div');
		const b = document.createElement('div');
		document.body.append(a, b);

		const { component } = render({ to: a });
		try {
			expect(portaled(a)).not.toBeNull();

			component.setTo(b);
			flushSync();
			expect(portaled(a)).toBeNull();
			expect(portaled(b)).not.toBeNull();
		} finally {
			unmount(component);
		}
	});

	test('a ShadowRoot target receives the node', () => {
		const hostEl = document.createElement('div');
		document.body.append(hostEl);
		const shadow = hostEl.attachShadow({ mode: 'open' });

		const { component } = render({ to: shadow });
		try {
			expect(portaled(shadow)).not.toBeNull();
		} finally {
			unmount(component);
		}
	});
});
