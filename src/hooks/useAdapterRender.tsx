import { useState } from 'react'
import { HashType, TransactionItem } from '../types'

type AdapterSetter = {
  (key: string | number, value: TransactionItem[]): void
}

type AdapterGetter = {
  (key: string | number): TransactionItem[]
}
type AdapterReset = {
  (): HashType<TransactionItem[]>
}

type AdapterReturnType = {
  setElementContent: AdapterSetter
  getElementContent: AdapterGetter
  resetElementContent: AdapterReset
}

const defaultHash: HashType<TransactionItem[]> | any = {}

const useAdapterRender = (): AdapterReturnType => {
  const [hashes, setHash] = useState(defaultHash)

  const setElementContent: AdapterSetter = (
    key: string | number,
    value: TransactionItem[]
  ): void => {
    setHash((h: HashType<TransactionItem[]>) => ({
      ...h,
      [key]: value as TransactionItem[]
    }))
  }

  const getElementContent: AdapterGetter = (
    key: string | number
  ): TransactionItem[] => {
    return hashes[key]
  }

  const resetElementContent: AdapterReset = (): HashType<TransactionItem[]> => {
    setHash({})
    return {}
  }

  return { setElementContent, getElementContent, resetElementContent }
}

export default useAdapterRender
