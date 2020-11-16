import React, { useState } from 'react'
import '../commons/Columns.css'
import { Card, TransactionItem } from '../../../types'
import './DataRow.css'
import { formatCurrency$ } from '../../../utils/currency'
import { formatDate } from '../../../utils/dates'
import Checkbox from '../header/Checkbox'

enum ImageOptions {
  masterCard = 'https://avatars.sched.co/7/e0/7507288/avatar.jpg?c05',
  visa = 'https://e7.pngegg.com/pngimages/594/666/png-clipart-visa-logo-credit-card-debit-card-payment-card-bank-visa-blue-text.png'
}

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
  const [selected, setSelected ] = useState(false)

  const schemaImage = () => {
    switch (scheme) {
      case 'mastercard':
        return ImageOptions.masterCard
      case 'visa':
        return ImageOptions.visa
      default:
        return ''
    }
  }
  const toggleSelection = (): void => {
    setSelected(!selected)
  }

  return (
    <div className='table-column data-row' onClick={toggleSelection}>
      <Checkbox checked={selected} onChange={toggleSelection}/>
      <div className='column'>{currency}</div>
      <div className='column'>{auth ? 'Authorized' : 'Not Authorized'}</div>
      <div className='column bolder dark-text'>
        {formatCurrency$(amount, currency)}
      </div>
      <div className='column'>{accountId}</div>
      <div className='column  bolder dark-text align-center'>
        {cleared ? 'Cleared' : 'Not Cleared'}
      </div>
      <div className='column'>{wallet ? wallet : '-'}</div>
      <div className='column'>{offer ? offer : '-'}</div>
      <div className='column column  bolder dark-text '>
        {formatDate(new Date(datetime))}
      </div>
      <div className='column center'>
        <img src={schemaImage()} className='card-type-image' alt='schema' />
        {/* <span>{scheme}</span> */}
      </div>
    </div>
  )
}

export default DataRow
