import React, { useState } from 'react'
import '../commons/Columns.css'
import { Card, TransactionItem } from '../../../types'
import './DataRow.css'
import { formatCurrency$ } from '../../../utils/currency'
import { formatDate } from '../../../utils/dates'
import Checkbox from '../header/Checkbox'

const masterCardLogo = process.env.REACT_APP_MASTERCARD_LOGO as string 
const visaCardLogo = process.env.REACT_APP_VISA_LOGO as string 

const ImageOptions =  {
  masterCard: masterCardLogo || '',
  visa: visaCardLogo || ''
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
      </div>
    </div>
  )
}

export default DataRow
