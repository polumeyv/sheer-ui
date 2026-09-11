import { createContext } from 'svelte';
import { attachRef } from '../../internal/tools/index.js';
import type { Page, PageItem } from './types.js';
import type { BitsKeyboardEvent, BitsMouseEvent, RefAttachment, RefOpts } from '../../internal/types.js';
import { createBitsAttrs } from '../../internal/attrs.js';
import { kbd } from '../../internal/kbd.js';
import { RovingFocusGroup } from '../../internal/roving-focus-group.svelte.js';
import { type Orientation } from '../../internal/index.js';

const paginationAttrs = createBitsAttrs({
	component: 'pagination',
	parts: ['root', 'page', 'prev', 'next'],
});

const [getPaginationRoot, setPaginationRoot] = createContext<PaginationRootState>();

interface PaginationRootStateOpts extends RefOpts {
	readonly count: number;
	readonly perPage: number;
	readonly siblingCount: number;
	readonly orientation: Orientation;
	readonly loop: boolean;
	page: number;
}

export class PaginationRootState {
	static create(opts: PaginationRootStateOpts) {
		return setPaginationRoot(new PaginationRootState(opts));
	}
	readonly opts: PaginationRootStateOpts;
	readonly attachment: RefAttachment;
	readonly totalPages = $derived.by(() => {
		if (this.opts.count === 0) return 1;
		return Math.ceil(this.opts.count / this.opts.perPage);
	});
	readonly range = $derived.by(() => {
		const start = (this.opts.page - 1) * this.opts.perPage;
		const end = Math.min(start + this.opts.perPage, this.opts.count);
		return { start: start + 1, end };
	});
	readonly pages = $derived.by(() =>
		getPageItems({
			page: this.opts.page,
			totalPages: this.totalPages,
			siblingCount: this.opts.siblingCount,
		}),
	);
	readonly hasPrevPage = $derived.by(() => this.opts.page > 1);
	readonly hasNextPage = $derived.by(() => this.opts.page < this.totalPages);

	readonly rovingFocusGroup: RovingFocusGroup;

	constructor(opts: PaginationRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));
		this.rovingFocusGroup = new RovingFocusGroup({
			candidateSelector: [paginationAttrs.selector('prev'), paginationAttrs.selector('page'), paginationAttrs.selector('next')].join(', '),
			rootNode: () => opts.ref,
			loop: () => opts.loop,
			orientation: () => opts.orientation,
		});
	}

	prevPage() {
		this.opts.page = Math.max(this.opts.page - 1, 1);
	}

	nextPage() {
		this.opts.page = Math.min(this.opts.page + 1, this.totalPages);
	}

	readonly snippetProps = $derived.by(() => ({
		pages: this.pages,
		range: this.range,
		currentPage: this.opts.page,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				'data-orientation': this.opts.orientation,
				[paginationAttrs.root]: '',
				...this.attachment,
			}) as const,
	);
}

interface PaginationPageStateOpts extends RefOpts {
	readonly page: Page;
	readonly disabled: boolean;
}

export class PaginationPageState {
	static create(opts: PaginationPageStateOpts) {
		return new PaginationPageState(opts, getPaginationRoot());
	}
	readonly opts: PaginationPageStateOpts;
	readonly root: PaginationRootState;
	readonly attachment: RefAttachment;
	readonly #isSelected = $derived.by(() => this.opts.page.value === this.root.opts.page);

	constructor(opts: PaginationPageStateOpts, root: PaginationRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled) return;
		if (e.button !== 0) return;
		this.root.opts.page = this.opts.page.value;
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.opts.page = this.opts.page.value;
		} else {
			this.root.rovingFocusGroup.handleKeydown(this.opts.ref, e);
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
				'aria-label': `Page ${this.opts.page.value}`,
				'data-value': `${this.opts.page.value}`,
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

interface PaginationButtonStateOpts extends RefOpts {
	readonly disabled: boolean;
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
		this.attachment = attachRef<HTMLElement>((v) => (opts.ref = v));

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#action() {
		this.opts.type === 'prev' ? this.root.prevPage() : this.root.nextPage();
	}

	readonly #isDisabled = $derived.by(() => {
		if (this.opts.disabled) return true;
		if (this.opts.type === 'prev') return !this.root.hasPrevPage;
		if (this.opts.type === 'next') return !this.root.hasNextPage;
		return false;
	});

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled) return;
		if (e.button !== 0) return;
		this.#action();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#action();
		} else {
			this.root.rovingFocusGroup.handleKeydown(this.opts.ref, e);
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id,
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

	// A gap directly after page 1 is the leading ellipsis; any other gap is the trailing one.
	// These keys are stable across navigation, so the each-block reuses the ellipsis nodes.
	function* emit(): Generator<PageItem> {
		let lastNumber = 0;
		for (const value of [...pagesToShow].sort((a, b) => a - b)) {
			if (value - lastNumber > 1) yield { type: 'ellipsis', key: lastNumber === 1 ? 'ellipsis-lead' : 'ellipsis-trail' };
			yield { type: 'page', value, key: `page-${value}` };
			lastNumber = value;
		}
	}
	return [...emit()];
}
