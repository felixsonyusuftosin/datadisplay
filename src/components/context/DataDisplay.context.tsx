import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
  useRef
} from 'react'
import {
  UPDATE_PAGINATION,
  FETCHING_TRANSACTIONS,
  FETCHED_TRANSACTIONS,
  ERROR_FETCHING_TRANSACTIONS
} from './action'
import { DataDisplayContextState, Transactions } from '../../types'
import { makeRestApiCall } from '../makeApiRequest'
import { getFirstDayOfYear } from '../../utils/dates'
import { DataDisplayReducer, initState } from './DataDisplayReducer'

const DataDisplayContext: any = createContext({})
const PROGRAM_ID = process.env.REACT_APP_PROGRAM_ID || ''
const url = `programs/${PROGRAM_ID}/transactions`

type UseDataDisplay = { 
  callback: () => Promise<any>,
  state: DataDisplayContextState,
  transactionsUrl: string
}

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
  const componentIsMountedRef = useRef(false)

  const constructPaginationUrlParameters = (): string => { 
    const param = new URLSearchParams()
    const start = paginationParameters.last && JSON.stringify(paginationParameters.last)
    const limit = paginationParameters.limit
    const from = paginationParameters.from.toISOString()
    const to = paginationParameters.to.toISOString()

    if (start ) {
      param.set('start', start)
    }
    param.set('limit', String(limit))
    param.set('from', from)
    param.set('to', to)

    return param.toString()
  }
  useEffect(() => {
    componentIsMountedRef.current = true
    if (componentIsMountedRef.current) {
     const queryParameters = constructPaginationUrlParameters()

      const computedUrl = `${url}?${queryParameters}`
      setTransactionsUrl(() => computedUrl)
    }
    return () => {
      componentIsMountedRef.current = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PROGRAM_ID, componentIsMountedRef])



  useEffect(() => {
    if (componentIsMountedRef.current) {
      const queryParameters = constructPaginationUrlParameters()
      const newContextPagination = {
        ...state.pagination,
        limit: paginationParameters.limit,
        nextPage: JSON.stringify(state?.fetchedTransactions?.last)
      }
      dispatch({ type: UPDATE_PAGINATION, payload: newContextPagination })
      setTransactionsUrl(`${url}?${queryParameters}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginationParameters,
    PROGRAM_ID,
    componentIsMountedRef
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
      callback,
      transactionsUrl
    }),
    [state, callback, transactionsUrl]
  )

  return <DataDisplayContext.Provider value={contextValue} {...restProps} />
}

export { DataDisplayProvider, useDataDisplay }
