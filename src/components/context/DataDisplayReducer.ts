import { DataDisplayContextState, Pagination, Transactions } from '../../types'
import {
  ACTION_TYPE,
  UPDATE_PAGINATION,
  FETCHING_TRANSACTIONS,
  FETCHED_TRANSACTIONS,
  ERROR_FETCHING_TRANSACTIONS
} from './action'

const defaultPagination: Pagination = {
  limit: 50,
  currentPage: 1,
  nextPage: 2
}

type ReducerActionPayloadType = {
  type: ACTION_TYPE
  payload?: Pagination | unknown[] | unknown | string | null
}

export const initState: DataDisplayContextState = {
  pagination: defaultPagination,
  fetchingTransactions: false,
  fetchedTransactions: null,
  errorFetchingTransactions: null
}

export const DataDisplayReducer = (
  state: DataDisplayContextState,
  action: ReducerActionPayloadType
): DataDisplayContextState => {
  switch (action.type) {
    case UPDATE_PAGINATION:
      return {
        ...state,
        pagination: action.payload as Pagination
      }
    case FETCHING_TRANSACTIONS:
      return {
        ...state,
        fetchingTransactions: true,
        errorFetchingTransactions: null,
        fetchedTransactions: null
      }
    case FETCHED_TRANSACTIONS:
      return {
        ...state,
        fetchingTransactions: false,
        errorFetchingTransactions: null,
        fetchedTransactions: action.payload as Transactions
      }
    case ERROR_FETCHING_TRANSACTIONS:
      return {
        ...state,
        fetchingTransactions: false,
        fetchedTransactions: null,
        errorFetchingTransactions: action.payload as string
      }

    default:
      return initState
  }
}
