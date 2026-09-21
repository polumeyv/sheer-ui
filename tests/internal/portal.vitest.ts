import { flushSync } from 'svelte';
import { describe, expect, test } from 'vitest';
import { mountInBody, unmount } from '../mount';
import Fixture from './portal.fixture.svelte';

const render = (props: Record<string, unknown> = {}) => {
	const { component, target: host } = mountInBody(Fixture, props);
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
		const { host } = render();
		expect(portaled(host)).toBeNull();
		expect(portaled(document.body)).not.toBeNull();
	});

	test('resolves a string selector', () => {
		const target = document.createElement('div');
		target.id = 'portal-target';
		document.body.append(target);

		render({ to: '#portal-target' });
		expect(portaled(target)).not.toBeNull();
	});

	test('disabled renders inline', () => {
		const target = document.createElement('div');
		document.body.append(target);

		const { host } = render({ to: target, disabled: true });
		expect(portaled(host)).not.toBeNull();
		expect(portaled(target)).toBeNull();
	});

	test('re-teleports when `to` changes', () => {
		const a = document.createElement('div');
		const b = document.createElement('div');
		document.body.append(a, b);

		const { component } = render({ to: a });
		expect(portaled(a)).not.toBeNull();

		component.setTo(b);
		flushSync();
		expect(portaled(a)).toBeNull();
		expect(portaled(b)).not.toBeNull();
	});

	test('a ShadowRoot target receives the node', () => {
		const hostEl = document.createElement('div');
		document.body.append(hostEl);
		const shadow = hostEl.attachShadow({ mode: 'open' });

		render({ to: shadow });
		expect(portaled(shadow)).not.toBeNull();
	});
});
