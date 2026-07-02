import { describe, expect, test } from 'bun:test';
import { createLayerStack } from './layer-stack';

type Behavior = 'close' | 'ignore' | 'defer-otherwise-close' | 'defer-otherwise-ignore';
const isClosing = (behavior: Behavior) => behavior === 'close' || behavior === 'ignore';

describe('createLayerStack', () => {
	test('a single registered instance is responsible', () => {
		const stack = createLayerStack<string, Behavior>(isClosing);
		stack.register('a', 'close');
		expect(stack.isResponsible('a')).toBe(true);
	});

	test('an unregistered instance is never responsible', () => {
		const stack = createLayerStack<string, Behavior>(isClosing);
		stack.register('a', 'close');
		expect(stack.isResponsible('never-registered')).toBe(false);
	});

	test('default predicate (always-true): the most recently registered instance is responsible', () => {
		// matches text-selection-layer, which has no behavior-type distinction at all
		const stack = createLayerStack<string, boolean>();
		stack.register('a', true);
		stack.register('b', true);
		expect(stack.isResponsible('b')).toBe(true);
		expect(stack.isResponsible('a')).toBe(false);
	});

	test('the topmost closing layer is responsible even if a later, deferring layer registered after it', () => {
		// matches dismissable-layer / escape-layer: e.g. a context menu (close) opened, then a
		// tooltip (defer) shows on top of it -- the menu still owns the escape/outside-click
		const stack = createLayerStack<string, Behavior>(isClosing);
		stack.register('menu', 'close');
		stack.register('tooltip', 'defer-otherwise-close');
		expect(stack.isResponsible('menu')).toBe(true);
		expect(stack.isResponsible('tooltip')).toBe(false);
	});

	test('when every layer defers, the first-registered layer is responsible', () => {
		const stack = createLayerStack<string, Behavior>(isClosing);
		stack.register('first', 'defer-otherwise-close');
		stack.register('second', 'defer-otherwise-ignore');
		expect(stack.isResponsible('first')).toBe(true);
		expect(stack.isResponsible('second')).toBe(false);
	});

	test('unregistering removes an instance from consideration for both rules', () => {
		const stack = createLayerStack<string, Behavior>(isClosing);
		stack.register('menu', 'close');
		stack.register('popover', 'close');
		expect(stack.isResponsible('popover')).toBe(true);

		stack.unregister('popover');
		expect(stack.isResponsible('menu')).toBe(true);
		expect(stack.isResponsible('popover')).toBe(false);
	});

	test('re-registering an existing instance updates its value without duplicating its stack position', () => {
		const stack = createLayerStack<string, Behavior>(isClosing);
		stack.register('a', 'defer-otherwise-close');
		stack.register('b', 'defer-otherwise-close');
		// both defer -> first ('a') is responsible
		expect(stack.isResponsible('a')).toBe(true);

		// 'a' transitions to a closing behavior (e.g. its overlay's behavior prop changed)
		stack.register('a', 'close');
		expect(stack.isResponsible('a')).toBe(true);
		expect(stack.isResponsible('b')).toBe(false);
	});
});
