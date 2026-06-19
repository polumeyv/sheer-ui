import { type AxisType } from './Axis'
import { type EventHandlerType } from './EventHandler'
import { type EventStoreType } from './EventStore'
import { type ScrollBodyType } from './ScrollBody'
import { type ScrollToType } from './ScrollTo'
import { type ScrollSnapListType } from './ScrollSnapList'
import { isNumber, type WindowType } from './utils'

export type SlideFocusType = {
	init: (ownerWindow: WindowType) => void
}

export function SlideFocus<API>(
	axis: AxisType,
	active: boolean,
	root: HTMLElement,
	slides: HTMLElement[],
	scrollSnapList: ScrollSnapListType,
	scrollTo: ScrollToType,
	scrollBody: ScrollBodyType,
	eventStore: EventStoreType,
	eventHandler: EventHandlerType<API>
): SlideFocusType {
	const focusListenerOptions = { passive: true, capture: true }
	let lastTabPressTime = 0

	function init(ownerWindow: WindowType): void {
		if (!active) return

		eventStore.add(ownerWindow.document, 'keydown', onKeyDown, false)

		slides.forEach((slide, slideIndex) => {
			eventStore.add(
				slide,
				'focus',
				(evt: FocusEvent) => onFocus(evt, slideIndex),
				focusListenerOptions
			)
		})
	}

	function onFocus(evt: FocusEvent, slideIndex: number): void {
		const nowTime = new Date().getTime()
		const diffTime = nowTime - lastTabPressTime

		if (diffTime > 10) return

		const event = eventHandler.createEvent('slidefocus', evt)
		const preventDefault = !event.emit()
		if (preventDefault) return

		root[axis.nativeScroll] = 0

		const snapIndex = scrollSnapList.snapBySlide[slideIndex]

		if (!isNumber(snapIndex)) return

		scrollBody.useDuration(0)
		scrollTo.index(snapIndex, 0)
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (event.code === 'Tab') lastTabPressTime = new Date().getTime()
	}

	const self: SlideFocusType = {
		init
	}

	return self
}