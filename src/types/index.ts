
export type MakeApiRequest = {
  (url: string): Promise<TransactionItem[]>
}

export type RendererStyles = {
  unitHeightOfRow: number
  totalLengthOfItems: number
}

export type Card = {
  id: string,
  lastNumbers: string,
  scheme: string
}
export type TransactionLocation = {
  address: string,
  city: string,
  countryCode: string,
  id: string,
  geolocation: string | null,
  postcode: string | null,
  timezone: string | null,
  metadata: string | null
}
export type TransactionIdentifiers = {
  amexApprovalCode: string | null,
  mastercardAuthCode: string | null,
  mastercardRefNumber: string | null,
  mastercardTransactionSequenceNumber: string | null,
  MID: string | null,
  visaAuthCode: string | null
}
export type TransactionBrand = {
  id: string,
  name: string | null,
  logoURL: string | null,
  metadata: string | null
}
export type LastTransaction = {
  programIdDel: string,
  id: string,
  time: string
}
export type TransactionItem = {
  currency: string,
  programId: string,
  accountId: string,
  created: string,
  updated: string,
  amount: number,
  auth?: boolean,
  cleared: boolean,
  wallet?: string | null
  offer?: string | null
  datetime: string,
  card: Card,
  location: TransactionLocation,
  brand: TransactionBrand,
  identifiers: TransactionIdentifiers
}

export type Transactions = {
  count: number,
  items: TransactionItem[]
  resource: string,
  status: number,
  execution: number
  last?: LastTransaction
}


export type HashType<T> = {
  key?: number | string
  value?: T
}

export type FilterType = {
  currentPage: number | string
  last?: LastTransaction
  from: Date
  to: Date
  limit: number
}
export type ContextState = {
  hashMap: Map<string | number, TransactionItem[]>
  filter: FilterType
  appLoading: boolean
  moreLoading: boolean
  filterUpdatedAt: Date | null
  errorFetchingInitialData?: string
  errorFetchingMoreData?: string
}

export enum NotificationTypes {
  error = 'error',
  info = 'info',
  warning = 'warning'
}