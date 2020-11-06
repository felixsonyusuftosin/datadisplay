import { useState } from 'react'

type AdapterSetter = {
  (key: string | number, value: unknown[]): void
}

type AdapterGetter = {
  (key: string | number): unknown[]
}
type AdapterReturnType = {
  setElementContent: AdapterSetter
  getElementContent: AdapterGetter
}

export const useAdapterRender = (): AdapterReturnType => {
  const [hashes, setHashes] = useState(new Map())

  const setElementContent: AdapterSetter = (
    key: string | number,
    value: unknown[]
  ): void => {
    const hashesCopy: Map<string | number, unknown> = { ...hashes }
    hashesCopy.set(key, value)
    setHashes((hashes: Map<string | number, unknown>) => ({
      ...hashes,
      hashesCopy
    }))
  }

  const getElementContent: AdapterGetter = (
    key: string | number
  ): unknown[] => {
    return hashes.get(key)
  }
  return { setElementContent, getElementContent }
}
