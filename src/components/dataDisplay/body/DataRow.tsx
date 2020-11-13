import React from 'react'
import '../commons/Columns.css'
import { Card, TransactionItem } from '../../../types'
import './DataRow.css'
import { formatCurrency$ } from '../../../utils/currency'
import { formatDate } from '../../../utils/dates'
import Checkbox from '../header/Checkbox'

export const DataRow: React.FC<TransactionItem> = (item: TransactionItem) => {
  const {
    currency,
    auth,
    amount,
    accountId,
    cleared,
    wallet,
    offer,
    datetime,
    card
  }: TransactionItem = item
  const { scheme }: Card = card
  return (
    <div className='table-column data-row'>
       <Checkbox />
      <div className='column'>{currency}</div>
      <div className='column'>{auth ? 'Authorized' : 'Not Authorized'}</div>
      <div className='column'>{formatCurrency$(amount, currency)}</div>
      <div className='column'>{accountId}</div>
      <div className='column'>{cleared ? 'Cleared' : 'Not Cleared'}</div>
      <div className='column'>{wallet ? wallet : '-'}</div>
      <div className='column'>{offer ? offer : '-'}</div>
      <div className='column'>{formatDate(new Date(datetime))}</div>
      <div className='column'>{scheme}</div>
    </div>
  )
}

export default DataRow
