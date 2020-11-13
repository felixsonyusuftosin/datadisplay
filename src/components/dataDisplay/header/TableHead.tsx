import React from 'react'
import '../commons/Columns.css'
import Checkbox from './Checkbox'

const attributes = [
  'Currency',
  'Auth',
  'Amount',
  'Account Id',
  'Cleared',
  'Wallet',
  'Offer',
  'Date',
  'Card Type'
]

const TableHead = () => {
  return (
    <div className='table-column table-head'>
      <Checkbox />
      {attributes.map((attribute: string) => (
        <div key={attribute} className='column'>
          {attribute}
        </div>
      ))}
    </div>
  )
}

export default TableHead