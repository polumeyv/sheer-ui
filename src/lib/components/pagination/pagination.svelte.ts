import { createContext } from 'svelte';
import { attachRef, type ReadableBoxedValues, type WritableBoxedValues } from '../../internal/tools/index.js';
import type { Page, PageItem } from './types.js';
import type { BitsKeyboardEvent, BitsMouseEvent, RefAttachment, WithRefOpts } from '../../internal/types.js';
import { createBitsAttrs } from '../../internal/attrs.js';
import { kbd } from '../../internal/kbd.js';
import { RovingFocusGroup } from '../../internal/roving-focus-group.js';
import { type Orientation, useId } from '../../internal/index.js';

const paginationAttrs = createBitsAttrs({
	component: 'pagination',
	parts: ['root', 'page', 'prev', 'next'],
});

const [getPaginationRoot, setPaginationRoot] = createContext<PaginationRootState>();

interface PaginationRootStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			count: number;
			perPage: number;
			siblingCount: number;
			orientation: Orientation;
			loop: boolean;
		}>,
		WritableBoxedValues<{
			page: number;
		}> {}

export class PaginationRootState {
	static create(opts: PaginationRootStateOpts) {
		return setPaginationRoot(new PaginationRootState(opts));
	}
	readonly opts: PaginationRootStateOpts;
	readonly attachment: RefAttachment;
	readonly totalPages = $derived.by(() => {
		if (this.opts.count.current === 0) return 1;
		return Math.ceil(this.opts.count.current / this.opts.perPage.current);
	});
	readonly range = $derived.by(() => {
		const start = (this.opts.page.current - 1) * this.opts.perPage.current;
		const end = Math.min(start + this.opts.perPage.current, this.opts.count.current);
		return { start: start + 1, end };
	});
	readonly pages = $derived.by(() =>
		getPageItems({
			page: this.opts.page.current,
			totalPages: this.totalPages,
			siblingCount: this.opts.siblingCount.current,
		}),
	);
	readonly hasPrevPage = $derived.by(() => this.opts.page.current > 1);
	readonly hasNextPage = $derived.by(() => this.opts.page.current < this.totalPages);

	readonly rovingFocusGroup: RovingFocusGroup;

	constructor(opts: PaginationRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.rovingFocusGroup = new RovingFocusGroup({
			candidateSelector: [paginationAttrs.selector('prev'), paginationAttrs.selector('page'), paginationAttrs.selector('next')].join(', '),
			rootNode: this.opts.ref,
			loop: this.opts.loop,
			orientation: this.opts.orientation,
		});
	}

	setPage(page: number) {
		this.opts.page.current = page;
	}

	prevPage() {
		this.opts.page.current = Math.max(this.opts.page.current - 1, 1);
	}

	nextPage() {
		this.opts.page.current = Math.min(this.opts.page.current + 1, this.totalPages);
	}

	readonly snippetProps = $derived.by(() => ({
		pages: this.pages,
		range: this.range,
		currentPage: this.opts.page.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'data-orientation': this.opts.orientation.current,
				[paginationAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}

interface PaginationPageStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			page: Page;
			disabled: boolean;
		}> {}

export class PaginationPageState {
	static create(opts: PaginationPageStateOpts) {
		return new PaginationPageState(opts, getPaginationRoot());
	}
	readonly opts: PaginationPageStateOpts;
	readonly root: PaginationRootState;
	readonly attachment: RefAttachment;
	readonly #isSelected = $derived.by(() => this.opts.page.current.value === this.root.opts.page.current);

	constructor(opts: PaginationPageStateOpts, root: PaginationRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		if (e.button !== 0) return;
		this.root.setPage(this.opts.page.current.value);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.setPage(this.opts.page.current.value);
		} else {
			this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				'aria-label': `Page ${this.opts.page.current.value}`,
				'data-value': `${this.opts.page.current.value}`,
				'data-selected': this.#isSelected ? '' : undefined,
				[paginationAttrs.page]: '',
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}

//
// NEXT/PREV BUTTON
//

interface PaginationButtonStateOpts
	extends
		WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {
	type: 'prev' | 'next';
}

export class PaginationButtonState {
	static create(opts: PaginationButtonStateOpts) {
		return new PaginationButtonState(opts, getPaginationRoot());
	}
	readonly opts: PaginationButtonStateOpts;
	readonly root: PaginationRootState;
	readonly attachment: RefAttachment;

	constructor(opts: PaginationButtonStateOpts, root: PaginationRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#action() {
		this.opts.type === 'prev' ? this.root.prevPage() : this.root.nextPage();
	}

	readonly #isDisabled = $derived.by(() => {
		if (this.opts.disabled.current) return true;
		if (this.opts.type === 'prev') return !this.root.hasPrevPage;
		if (this.opts.type === 'next') return !this.root.hasNextPage;
		return false;
	});

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		if (e.button !== 0) return;
		this.#action();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#action();
		} else {
			this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[paginationAttrs[this.opts.type]]: '',
				disabled: this.#isDisabled,
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const,
	);
}

//
// HELPERS
//

interface GetPageItemsProps {
	page?: number;
	totalPages: number;
	siblingCount?: number;
}

/**
 * Returns an array of page items used to render out the
 * pagination page triggers.
 *
 * Credit: https://github.com/melt-ui/melt-ui
 */
function getPageItems({ page = 1, totalPages, siblingCount = 1 }: GetPageItemsProps): PageItem[] {
	const pageItems: PageItem[] = [];
	const pagesToShow = new Set([1, totalPages]);
	const firstItemWithSiblings = 3 + siblingCount;
	const lastItemWithSiblings = totalPages - 2 - siblingCount;

	if (firstItemWithSiblings > lastItemWithSiblings) {
		for (let i = 2; i <= totalPages - 1; i++) {
			pagesToShow.add(i);
		}
	} else if (page < firstItemWithSiblings) {
		for (let i = 2; i <= Math.min(firstItemWithSiblings, totalPages); i++) {
			pagesToShow.add(i);
		}
	} else if (page > lastItemWithSiblings) {
		for (let i = totalPages - 1; i >= Math.max(lastItemWithSiblings, 2); i--) {
			pagesToShow.add(i);
		}
	} else {
		for (let i = Math.max(page - siblingCount, 2); i <= Math.min(page + siblingCount, totalPages); i++) {
			pagesToShow.add(i);
		}
	}

	function addPage(value: number): void {
		pageItems.push({ type: 'page', value, key: `page-${value}` });
	}

	function addEllipsis(): void {
		const id = useId();
		pageItems.push({ type: 'ellipsis', key: `ellipsis-${id}` });
	}

	let lastNumber = 0;

	for (const p of Array.from(pagesToShow).sort((a, b) => a - b)) {
		if (p - lastNumber > 1) {
			addEllipsis();
		}
		addPage(p);
		lastNumber = p;
	}

	return pageItems;
}
