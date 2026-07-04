import { srOnlyStylesString } from '../../internal/tools/index.js';
import { isHTMLElement } from '@polumeyv/utilities/dom';
import { BROWSER } from '@polumeyv/utilities/env';

type AnnouncementKind = 'assertive' | 'polite';
type AriaNotifyDocument = Document & {
	ariaNotify: (announcement: string, options?: { priority?: 'high' | 'normal' }) => void;
};

function getAriaNotifyDocument(doc: Document | null): AriaNotifyDocument | null {
	const ariaNotify = (doc as { ariaNotify?: unknown } | null)?.ariaNotify;
	return typeof ariaNotify === 'function' ? (doc as AriaNotifyDocument) : null;
}

function getAnnouncementText(value: string | null | number) {
	return typeof value === 'number' ? value.toString() : value === null ? 'Empty' : value.trim();
}

/**
 * Creates or gets an announcer element which is used to announce messages to screen readers.
 * Within the date components, we use this to announce when the values of the individual segments
 * change, as without it we get inconsistent behavior across screen readers.
 */
function initAnnouncer(doc: Document | null) {
	if (!BROWSER || !doc) return null;
	let el = doc.querySelector('[data-bits-announcer]');

	const createLog = (kind: AnnouncementKind) => {
		const log = Object.assign(doc.createElement('div'), { role: 'log', ariaLive: kind });
		log.setAttribute('aria-relevant', 'additions');
		return log;
	};

	if (!isHTMLElement(el)) {
		const div = doc.createElement('div');
		div.style.cssText = srOnlyStylesString;
		div.setAttribute('data-bits-announcer', '');
		div.append(createLog('assertive'), createLog('polite'));
		doc.body.prepend(div);
		el = div;
	}

	return {
		getLog: (kind: AnnouncementKind) => {
			const log = isHTMLElement(el) ? el.querySelector(`[aria-live="${kind}"]`) : null;
			return isHTMLElement(log) ? log : null;
		},
	};
}

export type Announcer = ReturnType<typeof getAnnouncer>;

/**
 * Creates an announcer object that can be used to make `aria-live` announcements to screen readers.
 */
export function getAnnouncer(doc: Document | null) {
	const announcer = getAriaNotifyDocument(doc) ? null : initAnnouncer(doc);

	return {
		announce(value: string | null | number, kind: AnnouncementKind = 'assertive', timeout = 7500) {
			if (!BROWSER || !doc) return;
			const text = getAnnouncementText(value);
			const nativeDoc = getAriaNotifyDocument(doc);
			if (nativeDoc) {
				nativeDoc.ariaNotify(text, { priority: kind === 'assertive' ? 'high' : 'normal' });
				return;
			}
			if (!announcer) return;
			const log = announcer.getLog(kind);
			const content = Object.assign(doc.createElement('div'), { textContent: text });
			kind === 'assertive' ? log?.replaceChildren(content) : log?.appendChild(content);
			return setTimeout(() => content.remove(), timeout);
		},
	};
}
