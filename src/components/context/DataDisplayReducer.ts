import { FilterType, ContextState, TransactionItem } from '../../types'
import { initState } from '../default.data'
import {
  UPDATE_FILTERS,
  ACTION_TYPE,
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


type ReducerActionPayloadType = {
  type: ACTION_TYPE
  payload?:
    | FilterType
    | TransactionItem[]
    | string
    | Map<string | number, TransactionItem[]>
    | Date
}


export const DataDisplayReducer = (
  state: ContextState,
  action: ReducerActionPayloadType
): ContextState => {
  switch (action.type) {
    case UPDATE_FILTERS:
      return {
        ...state,
        filter: action.payload as FilterType
      }
    case FETCHING_INITIAL_DATA:
      return {
        ...state,
        hashMap: new Map(),
        appLoading: true,
        moreLoading: false,
        errorFetchingInitialData: undefined,
        errorFetchingMoreData: undefined
      }
    case ERROR_FETCHING_INITIAL_DATA:
      return {
        ...state,
        appLoading: false,
        moreLoading: false,
        errorFetchingInitialData: action.payload as string,
        errorFetchingMoreData: undefined
      }
    case DONE_FETCHING_INITIAL_DATA:
    case DONE_FETCHING_MORE_DATA:
      return {
        ...state,
        appLoading: false,
        moreLoading: false,
        errorFetchingInitialData: undefined,
        errorFetchingMoreData: undefined
      }
    case FETCHING_MORE_DATA:
      return {
        ...state,
        appLoading: false,
        moreLoading: true,
        errorFetchingInitialData: undefined,
        errorFetchingMoreData: undefined
      }
    case ERROR_FETCHING_MORE_DATA:
      return {
        ...state,
        appLoading: false,
        moreLoading: false,
        errorFetchingInitialData: undefined,
        errorFetchingMoreData: action.payload as string
      }
    case UPDATE_HASH_MAP:
      return {
        ...state,
        hashMap: action.payload as Map<string | number, TransactionItem[]>
      }
    case FILTER_UPDATE_LOG:
      return {
        ...state,
        filterUpdatedAt: new Date()
      }
    case CLEANUP:
      return initState

    default:
      return initState
  }
}

export default DataDisplayReducer