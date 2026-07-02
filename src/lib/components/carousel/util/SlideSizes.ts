import { type AxisType } from './Axis'
import { type NodeHandlerType } from './NodeHandler'
import { type NodeRectType } from './NodeHandler'
import { arrayIsLastIndex } from './utils'

export type SlideSizesType = {
  slideSizes: number[]
  slideSizesWithGaps: number[]
  startGap: number
  endGap: number
}

export const SlideSizes = (
  axis: AxisType,
  containerRect: NodeRectType,
  slideRects: NodeRectType[],
  slides: HTMLElement[],
  readEdgeGap: boolean,
  nodeHandler: NodeHandlerType
): SlideSizesType => {
  const { ownerWindow } = nodeHandler
  const { getSize, startEdge, endEdge } = axis
  const withEdgeGap = slideRects[0] && readEdgeGap && ownerWindow

  const getStartGap = (): number => {
    if (!withEdgeGap) return 0
    const slideRect = slideRects[0]
    return Math.abs(containerRect[startEdge] - slideRect[startEdge])
  }

  const getEndGap = (): number => {
    if (!withEdgeGap) return 0
    const style = ownerWindow.getComputedStyle(slides.at(-1)!)
    return parseFloat(style.getPropertyValue(`margin-${endEdge}`))
  }

  const getSlideSizesWithGaps = (): number[] =>
    slideRects
      .map((rect, index, rects) => {
        const isFirst = !index
        const isLast = arrayIsLastIndex(rects, index)
        if (isFirst) return slideSizes[index] + startGap
        if (isLast) return slideSizes[index] + endGap
        return rects[index + 1][startEdge] - rect[startEdge]
      })
      .map(Math.abs)

  const startGap = getStartGap()
  const endGap = getEndGap()
  const slideSizes = slideRects.map(getSize)
  const slideSizesWithGaps = getSlideSizesWithGaps()

  const self: SlideSizesType = {
    slideSizes,
    slideSizesWithGaps,
    startGap,
    endGap
  }
  return self
}
