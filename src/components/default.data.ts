
import { ContextState } from '../types';
import { getFirstDayOfYear } from '../utils/dates';


export const initState: ContextState = {
  hashMap: new Map(),
  filter: {
    currentPage: 0,
    from: getFirstDayOfYear(),
    to: new Date(),
    limit: 24
  },
  filterUpdatedAt: null,
  appLoading: false,
  moreLoading: false,
  errorFetchingInitialData: undefined,
  errorFetchingMoreData: undefined
}