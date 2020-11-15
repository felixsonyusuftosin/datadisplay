import { useState } from 'react'

type AdapterSetter = {
  (key: string | number, value: unknown[]): void
}

type AdapterGetter = {
  (key: string | number): unknown[]
}
type AdapterReset = {
  (): {}
}
type AdapterReturnType = {
  setElementContent: AdapterSetter
  getElementContent: AdapterGetter
  resetElementContent: AdapterReset
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

  const resetElementContent: AdapterReset = (): {} => {
    console.log('resetting hash ')
    setHash({})
    return {}
  }

  return { setElementContent, getElementContent, resetElementContent }
}

export default useAdapterRender
