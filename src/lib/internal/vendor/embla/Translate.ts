import { type AxisType } from './Axis'
import {
  type NumberStoreInputType,
  mapStoreToNumber
} from './utils'

export type TranslateType = {
  to: (input: NumberStoreInputType) => void
  toggleActive: (active: boolean) => void
  clear: () => void
}

export const Translate = (axis: AxisType, node: HTMLElement): TranslateType => {
  const x = (input: number): string => `translate3d(${input}px,0px,0px)`

  const y = (input: number): string => `translate3d(0px,${input}px,0px)`

  const getTranslate = axis.scroll === 'x' ? x : y
  const nodeStyle = node.style

  let previousTarget: number | null
  let disabled = false

  const to = (input: number): void => {
    if (disabled) return

    const newTarget = Math.round(axis.direction(input) * 100) / 100
    if (newTarget === previousTarget) return
    nodeStyle.transform = getTranslate(newTarget)
    previousTarget = newTarget
  }

  const toggleActive = (active: boolean): void => {
    disabled = !active
  }

  const clear = (): void => {
    nodeStyle.transform = ''
    if (!node.getAttribute('style')) node.removeAttribute('style')
  }

  const self: TranslateType = {
    clear,
    to: mapStoreToNumber(to),
    toggleActive
  }
  return self
}
