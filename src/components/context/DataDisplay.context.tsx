import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback
} from 'react'
import DataDisplayReducer from './DataDisplayReducer'
import {
  TransactionItem,
  Transactions,
  FilterType,
  ContextState
} from '../../types'
import { makeRestApiCall } from '../makeApiRequest'
import { initState } from '../default.data'
import {
  UPDATE_FILTERS,
  FETCHING_INITIAL_DATA,
  ERROR_FETCHING_INITIAL_DATA,
  DONE_FETCHING_INITIAL_DATA,
  FETCHING_MORE_DATA,
  ERROR_FETCHING_MORE_DATA,
  DONE_FETCHING_MORE_DATA,
  UPDATE_HASH_MAP,
  FILTER_UPDATE_LOG,
  CLEANUP
} from './action'

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

type AsyncDataReturnType = { 
  currentPage: number ,
  data: TransactionItem[]
}

const DataDisplayProvider = ({ ...restProps }): typeof DataDisplayContext => {
  const [state, dispatch] = useReducer(DataDisplayReducer, initState)

  const constructUrlFromFilters = (filter: FilterType): string => {
    const param = new URLSearchParams()
    const start = filter.last && JSON.stringify(filter.last)
    const limit = filter.limit
    const from = filter.from.toISOString()
    const to = filter.to.toISOString()

    if (filter.last && start) {
      param.set('start', start)
    }

    param.set('limit', String(limit))
    param.set('from', from)
    param.set('to', to)
    return `${url}?${param.toString()}`
  }

  const fetchInitialData = useCallback(async ():Promise<AsyncDataReturnType|undefined> => {
    const hash: Map<string | number, TransactionItem[]> = new Map()
    const newInitState = { ...initState}
    const defaultFilter = newInitState.filter
    const url = constructUrlFromFilters(defaultFilter)
    dispatch({ type: FETCHING_INITIAL_DATA })
    try {
      const { data } = await makeRestApiCall(url)
      const { last, items = [] } = data as Transactions
      const newFilter: FilterType = {
        ...defaultFilter,
        currentPage: 0,
        limit: items.length,
        last
      }
      hash.set(0, items)

      dispatch({ type: UPDATE_FILTERS, payload: newFilter })
      dispatch({ type: DONE_FETCHING_INITIAL_DATA })
      dispatch({ type: UPDATE_HASH_MAP, payload: hash })
      return { currentPage: newFilter.currentPage, data: items } as AsyncDataReturnType
    } catch (err) {
      dispatch({ type: ERROR_FETCHING_INITIAL_DATA, payload: err.message })
    }
  }, [])

  const fetchSubsequentPaginatedData = useCallback(async ():Promise<AsyncDataReturnType|undefined> => {
    const hash = state.hashMap
    const { filter } = state as ContextState
    const copyFilter = { ...filter}
    if (!copyFilter.last) {
      return undefined
    }
    const url = constructUrlFromFilters(copyFilter)
    dispatch({ type: FETCHING_MORE_DATA })
    try {
      const { data } = await makeRestApiCall(url)
      const { last, items = [] } = data as Transactions
      const { currentPage } = copyFilter as FilterType
      const newPage = (currentPage as number) + 1
      const newFilter = { ...copyFilter, currentPage: newPage, last, limit: items.length}
      hash.set(newPage, items)
      dispatch({ type: UPDATE_FILTERS, payload: newFilter })
      dispatch({ type: DONE_FETCHING_MORE_DATA })
      dispatch({ type: UPDATE_HASH_MAP, payload: hash })
      return { currentPage: newFilter.currentPage, data: items } as AsyncDataReturnType
    } catch (err) {
      dispatch({ type: ERROR_FETCHING_MORE_DATA, payload: err.message })
    }
  }, [state])

  const resetDataWhenFilterChanges = useCallback(
    async (from: Date, to: Date): Promise<AsyncDataReturnType | undefined> => {
      const hash: Map<string | number, TransactionItem[]> = new Map()
      const copyFilter = { ...initState.filter}
      const defaultFilter = copyFilter
      const url = constructUrlFromFilters({ ...defaultFilter, last: undefined, from, to })
      dispatch({ type: FETCHING_INITIAL_DATA })
      try {
        const { data } = await makeRestApiCall(url)
        const { last, items = [] } = data as Transactions
        const newFilter: FilterType = {
          ...defaultFilter,
          from,
          to,
          currentPage: 0,
          last,
          limit: items.length
        }
        hash.set(0, items)
        dispatch({ type: UPDATE_HASH_MAP, payload: hash })
        dispatch({ type: UPDATE_FILTERS, payload: newFilter })
        dispatch({ type: DONE_FETCHING_INITIAL_DATA })
        return { currentPage: newFilter.currentPage, data: items } as AsyncDataReturnType
      } catch (err) {
        dispatch({ type: ERROR_FETCHING_INITIAL_DATA, payload: err.message })
      }
    },
    []
  )

  const setFilter = useCallback((filter: FilterType) => { 
    dispatch({ type: UPDATE_FILTERS, payload: filter })
    dispatch({ type: FILTER_UPDATE_LOG})
  },[])

  const getData = useCallback(
    (key: string | number): TransactionItem[] => {
      const hash = state.hashMap
      const value = hash.get(key as number)
      return value as TransactionItem[]
    },
    [state.hashMap]
  )
  // clean up
  useEffect(() => {
    return () => { 
      dispatch({type: CLEANUP })
    }
  },[])

  const contextValue = useMemo(
    () => ({
      state,
      setFilter,
      fetchInitialData,
      fetchSubsequentPaginatedData,
      resetDataWhenFilterChanges,
      getData
    }),
    [
      state,
      setFilter,
      fetchInitialData,
      fetchSubsequentPaginatedData,
      resetDataWhenFilterChanges,
      getData
    ]
  )

  return <DataDisplayContext.Provider value={contextValue} {...restProps} />
}

export { DataDisplayProvider, useDataDisplay }
