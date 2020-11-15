
import { DataDisplayContextState, Pagination } from '../types';
import { getFirstDayOfYear } from '../utils/dates';

export const paginationParameterContextDefaults = {
    currentPage: 0,
    last: null,
    limit: 24,
    from: getFirstDayOfYear(),
    to: new Date()
}

export const defaultPagination: Pagination = {
  limit: 0,
  currentPage: 0,
  nextPage: null
}

 export const initState: DataDisplayContextState = {
  pagination: defaultPagination,
  fetchingTransactions: false,
  fetchedTransactions: null,
  errorFetchingTransactions: null
}