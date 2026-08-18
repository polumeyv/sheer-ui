<script lang="ts">
	import { RovingFocusGroup } from '#lib/internal/roving-focus-group.js';
	import { boxWith } from '#lib/internal/tools/index.js';
	import { getTabbableCandidates } from '#lib/internal/tabbable.js';

	type GroupName = 'attr' | 'selector' | 'nodes';

	let root = $state<HTMLElement | null>(null);
	let loop = $state(false);

	const shared = {
		rootNode: boxWith(() => root),
		loop: boxWith(() => loop),
		orientation: boxWith(() => 'vertical' as const),
	};

	const groups: Record<GroupName, RovingFocusGroup> = {
		attr: new RovingFocusGroup({ ...shared, candidateAttr: 'data-item' }),
		selector: new RovingFocusGroup({ ...shared, candidateSelector: '[data-item]' }),
		nodes: new RovingFocusGroup({ ...shared, candidateNodes: getTabbableCandidates }),
	};

	export function setLoop(value: boolean) {
		loop = value;
	}

	export function candidateIds(group: GroupName) {
		return groups[group].getCandidateNodes().map((node) => node.id);
	}

	export function press(group: GroupName, fromId: string, key: string, both = false) {
		const from = root?.querySelector<HTMLElement>(`#${fromId}`) ?? null;
		const event = new KeyboardEvent('keydown', { key, cancelable: true, bubbles: true });
		const focused = groups[group].handleKeydown(from, event, both);
		return {
			focusedId: focused?.id ?? null,
			activeId: document.activeElement?.id ?? null,
			defaultPrevented: event.defaultPrevented,
		};
	}
</script>

<div bind:this={root}>
	<button data-item id="rfg-a">A</button>
	<button data-item data-disabled id="rfg-b">B</button>
	<button data-item id="rfg-c">C</button>
	<span data-item id="rfg-d" tabindex="-1">D</span>
</div>
