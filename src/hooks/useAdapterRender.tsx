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

const defaultHash: any = {}

const useAdapterRender = (): AdapterReturnType => {
  const [hashes, setHash] = useState(defaultHash)

  const setElementContent: AdapterSetter = (
    key: string | number,
    value: unknown[]
  ): void => {
    setHash((h: any) => ({ ...h, [key]: value }))
  }

  const getElementContent: AdapterGetter = (
    key: string | number
  ): unknown[] => {
    return hashes[key]
  }

  return { setElementContent, getElementContent }
}

export default useAdapterRender
