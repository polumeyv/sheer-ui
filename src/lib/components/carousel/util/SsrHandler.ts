import { type OptionsHandlerType } from './OptionsHandler'
import { type CreateOptionsType, type OptionsType } from './Options'
import { type EngineType } from './Engine'
import { type NodesType } from './NodeHandler'

export type EmblaSsrHandlerType = {
  getNodes: () => NodesType
  getStyles: (containerSelector: string, slidesSelector?: string) => string
  setup(
    createEngine: (
      options: OptionsType,
      container: HTMLElement,
      slides: HTMLElement[],
      useCachedRects?: boolean
    ) => EngineType,
    mergeOptions: OptionsHandlerType['mergeOptions'],
    options: OptionsType
  ): void
}

export type EmblaSsrOptionsType = Omit<
  CreateOptionsType<{ slideSizes: number[] }>,
  'active'
>


