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
import { TransactionItem, Transactions } from '../../types'
import { makeRestApiCall } from '../makeApiRequest'
import { DataDisplayReducer } from './DataDisplayReducer'
import { paginationParameterContextDefaults, initState } from '../default.data'

const DataDisplayContext: any = createContext({})
const PROGRAM_ID = process.env.REACT_APP_PROGRAM_ID || ''
const url = `programs/${PROGRAM_ID}/transactions`

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
  const [filterParameters, setFilterParameters] = useState(
    paginationParameterContextDefaults
  )
  const [transactionsUrl, setTransactionsUrl] = useState('')
  const componentIsMountedRef = useRef(false)

  const constructPaginationUrlParameters = useCallback((): string => {
    const param = new URLSearchParams()
    const start =
      filterParameters.last && JSON.stringify(filterParameters.last)
    const limit = filterParameters.limit
    const from = filterParameters.from.toISOString()
    const to = filterParameters.to.toISOString()

    if (start) {
      param.set('start', start)
    }
    param.set('limit', String(limit))
    param.set('from', from)
    param.set('to', to)

    return param.toString()
  }, [
    filterParameters.from,
    filterParameters.last,
    filterParameters.limit,
    filterParameters.to
  ])

  // update local pagination parameters when context parameter changes to set the next url
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
  }, [
    componentIsMountedRef,
    constructPaginationUrlParameters,
    filterParameters
  ])

  const resetPaginationData = () => {
    dispatch({ type: UPDATE_PAGINATION, payload: { ...initState.pagination } })
    setFilterParameters(paginationParameterContextDefaults)
  }

  // data clean up when component un mounts
  useEffect((): (() => void) => {
    componentIsMountedRef.current && resetPaginationData()
    return () => componentIsMountedRef.current && resetPaginationData()
  }, [componentIsMountedRef])

  const callback = useCallback(async (): Promise<TransactionItem[] | undefined> => {
    dispatch({ type: FETCHING_TRANSACTIONS })
    try {
      const { data } = await makeRestApiCall(transactionsUrl)

      dispatch({ type: FETCHED_TRANSACTIONS, payload: data })
      const { last, items } = data as Transactions
      const newContextPagination = {
        ...state.pagination,
        currentPage: +state.pagination.currentPage + 1,
        nextPage: last && JSON.stringify(last),
        limit: items.length
      }
      
      dispatch({
        type: UPDATE_PAGINATION,
        payload: { ...newContextPagination }
      })
      setFilterParameters((p: any) => ({
        ...p,
        currentPage: p.currentPage += 1,
        last
      }))
      return data.items
    } catch (error) {
      dispatch({ type: ERROR_FETCHING_TRANSACTIONS, payload: error.message })
    }
  }, [state.pagination, transactionsUrl])

  const contextValue = useMemo(
    () => ({
      state,
      callback,
      transactionsUrl,
      resetPaginationData,
      setFilterParameters,
      filterParameters
    }),
    [state, callback, transactionsUrl, filterParameters]
  )

  return <DataDisplayContext.Provider value={contextValue} {...restProps} />
}

export { DataDisplayProvider, useDataDisplay }
