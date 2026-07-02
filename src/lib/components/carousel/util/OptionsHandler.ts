import { MediaQuery } from 'svelte/reactivity'
import { BROWSER } from '@polumeyv/utilities/env'
import { type LooseOptionsType, type CreateOptionsType } from './Options'
import { objectsMergeDeep } from './utils'

type OptionsType = Partial<CreateOptionsType<LooseOptionsType>>

export type OptionsHandlerType = {
  mergeOptions: <TypeA extends OptionsType, TypeB extends OptionsType>(
    optionsA: TypeA,
    optionsB?: TypeB
  ) => TypeA
  optionsAtMedia: <Type extends OptionsType>(options: Type) => Type
}

// One MediaQuery per query string, shared across carousels. Reading `current`
// inside an effect subscribes it; reads outside reactive contexts are plain.
const mediaQueries = new Map<string, MediaQuery>()

function matchesMedia(query: string): boolean {
  if (!BROWSER) return false

  let mediaQuery = mediaQueries.get(query)

  if (!mediaQuery) {
    mediaQuery = new MediaQuery(query)
    mediaQueries.set(query, mediaQuery)
  }

  return mediaQuery.current
}

// Reads every declared breakpoint so a tracked caller (the carousel config
// effect) re-runs when any of them flips. Replaces embla's matchMedia
// 'change' listeners.
export function observeOptionsBreakpoints(optionsList: OptionsType[]): void {
  for (const options of optionsList) {
    for (const query of Object.keys(options.breakpoints || {})) {
      matchesMedia(query)
    }
  }
}

export function OptionsHandler(): OptionsHandlerType {
  function mergeOptions<TypeA extends OptionsType, TypeB extends OptionsType>(
    optionsA: TypeA,
    optionsB?: TypeB
  ): TypeA {
    return <TypeA>objectsMergeDeep(optionsA, optionsB || {})
  }

  function optionsAtMedia<Type extends OptionsType>(options: Type): Type {
    const optionsAtMedia = options.breakpoints || {}
    const matchedMediaOptions = Object.keys(optionsAtMedia)
      .filter((media) => matchesMedia(media))
      .map((media) => optionsAtMedia[media])
      .reduce(
        (mediaOptions, mediaOption) => mergeOptions(mediaOptions, mediaOption),
        {}
      )

    return mergeOptions(options, matchedMediaOptions)
  }

  const self: OptionsHandlerType = {
    mergeOptions,
    optionsAtMedia
  }
  return self
}
