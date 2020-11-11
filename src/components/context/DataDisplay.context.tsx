import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  useMemo,
  useCallback
} from 'react'
import {
  UPDATE_PAGINATION,
  FETCHING_TRANSACTIONS,
  FETCHED_TRANSACTIONS,
  ERROR_FETCHING_TRANSACTIONS
} from './action'
import { Transactions } from '../../types'
import { makeRestApiCall } from '../makeApiRequest'
import { getFirstDayOfYear } from '../../utils/dates'
import { DataDisplayReducer, initState } from './DataDisplayReducer'

const DataDisplayContext: any = createContext({})
let componentIsMounted: boolean

const useDataDisplay = () => {
  const context = useContext(DataDisplayContext)
  if (!context) {
    console.error(' Please call within a DataDisplayProvider')
    throw new Error(
      'useLinkedAccount must be used within a DataDisplayProvider'
    )
  }
  return context
}

const DataDisplayProvider = ({ ...restProps }): typeof DataDisplayContext => {
  const [state, dispatch] = useReducer(DataDisplayReducer, initState)
  const [paginationParameters, setPaginationParameters] = useState({
    last: null,
    limit: 50,
    from: getFirstDayOfYear(),
    to: new Date()
  })
  const [transactionsUrl, setTransactionsUrl] = useState('')
  const PROGRAM_ID = process.env.REACT_APP_PROGRAM_ID || ''

  useEffect(() => {
    componentIsMounted = true
    if (componentIsMounted) {
      const url = `programs/${PROGRAM_ID}/transactions`
      
      setTransactionsUrl(() => url)
    }
    return () => {
      componentIsMounted = false
    }
  }, [PROGRAM_ID, setTransactionsUrl])

  useEffect(() => {
    if (componentIsMounted) {
      const start = JSON.stringify(paginationParameters.last)
      const limit = paginationParameters.limit
      const from = paginationParameters.from.toISOString()
      const to = paginationParameters.to.toISOString()
      const url = `programs/${PROGRAM_ID}/transactions`
      const param = new URLSearchParams()

      param.set('start', start)
      param.set('limit', String(limit))
      param.set('from', from)
      param.set('to', to)

      const newContextPagination = {
        ...state.pagination,
        limit: paginationParameters.limit,
        nextPage: JSON.stringify(state?.fetchedTransactions?.last)
      }

      dispatch({ type: UPDATE_PAGINATION, payload: newContextPagination })
      setTransactionsUrl(`${url}?${param.toString()}`)
    }
  }, [
    paginationParameters,
    PROGRAM_ID,
    setTransactionsUrl,
    state.pagination,
    state?.fetchedTransactions?.last
  ])

  const callback = useCallback(async () => {
    dispatch({ type: FETCHING_TRANSACTIONS })
    try {
      const { data } = await makeRestApiCall(transactionsUrl)

      dispatch({ type: FETCHED_TRANSACTIONS, payload: data })
      const { last } = data as Transactions

      setPaginationParameters((p: any) => ({
        ...p,
        last,
        currentPage: p.last || 1
      }))
      return data.items
    } catch (error) {
      dispatch({ type: ERROR_FETCHING_TRANSACTIONS, payload: error.message })
    }
  }, [transactionsUrl])

  const contextValue = useMemo(
    () => ({
      state,
      callback
    }),
    [state, callback]
  )

  return <DataDisplayContext.Provider value={contextValue} {...restProps} />
}

export { DataDisplayProvider, useDataDisplay }
