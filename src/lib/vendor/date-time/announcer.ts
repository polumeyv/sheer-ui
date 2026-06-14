import { srOnlyStyles } from '$lib/vendor';
import { styleToString, type StyleObject } from 'overrule/props';

type AnnouncementKind = 'assertive' | 'polite';

type AnnouncerElement = HTMLElement & {
	__bitsAnnouncer?: true;
};

const announcers = new WeakMap<Document, AnnouncerRoot>();

class AnnouncerRoot {
	readonly #doc: Document;
	readonly #root: HTMLElement;

	constructor(doc: Document) {
		this.#doc = doc;
		this.#root = this.#getOrCreateRoot();
		this.#ensureLog('assertive');
		this.#ensureLog('polite');
	}

	#getOrCreateRoot() {
		const existing = this.#doc.querySelector('[data-bits-announcer]');

		if (existing instanceof HTMLElement) {
			return existing;
		}

		const root = this.#doc.createElement('div') as AnnouncerElement;
		root.__bitsAnnouncer = true;
		root.style.cssText = styleToString(srOnlyStyles as StyleObject);
		root.setAttribute('data-bits-announcer', '');

		this.#doc.body.insertBefore(root, this.#doc.body.firstChild);

		return root;
	}

	#ensureLog(kind: AnnouncementKind) {
		const existing = this.getLog(kind);

		if (existing) {
			return existing;
		}

		const log = this.#doc.createElement('div');
		log.setAttribute('role', 'log');
		log.setAttribute('aria-live', kind);
		log.setAttribute('aria-relevant', 'additions');

		this.#root.appendChild(log);

		return log;
	}

	getLog(kind: AnnouncementKind) {
		const log = this.#root.querySelector(`[aria-live="${kind}"]`);
		return log instanceof HTMLElement ? log : null;
	}

	announce(value: string | number | null, kind: AnnouncementKind = 'assertive', timeout = 7500) {
		const log = this.getLog(kind);
		if (!log) return;

		const content = this.#doc.createElement('div');
		content.textContent = normalizeAnnouncement(value);

		if (kind === 'assertive') {
			log.replaceChildren(content);
		} else {
			log.appendChild(content);
		}

		const timer = this.#doc.defaultView?.setTimeout(() => {
			content.remove();
		}, timeout);

		return () => {
			if (timer !== undefined) {
				this.#doc.defaultView?.clearTimeout(timer);
			}

			content.remove();
		};
	}
}

function normalizeAnnouncement(value: string | number | null) {
	if (typeof value === 'number') return value.toString();
	if (value === null) return 'Empty';

	const trimmed = value.trim();
	return trimmed || 'Empty';
}

export function getAnnouncer(doc: Document | null) {
	const root = doc ? getAnnouncerRoot(doc) : null;

	return {
		announce(value: string | number | null, kind: AnnouncementKind = 'assertive', timeout = 7500) {
			return root?.announce(value, kind, timeout);
		},
	};
}

function getAnnouncerRoot(doc: Document) {
	const existing = announcers.get(doc);

	if (existing) {
		return existing;
	}

	const announcer = new AnnouncerRoot(doc);
	announcers.set(doc, announcer);

	return announcer;
}

export type Announcer = ReturnType<typeof getAnnouncer>;
