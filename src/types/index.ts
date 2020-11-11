
export type MakeApiRequest = {
  (url: string): Promise<unknown[]>
}
export type Pagination = {
  currentPage: number | string
  nextPage: string | number | null
  totalPages?: number
  limit: number
}

export type RendererStyles = {
  unitHeightOfRow: number
  totalLengthOfItems: number
}

export type Card = {
  id: string,
  lastNumbers: string,
  schema: string
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
  cleared: boolean,
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