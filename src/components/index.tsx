import React from 'react'
import './index.css'
import Header from './dataDisplay/header/Header'
import TableBody from './dataDisplay/body/TableBody';

const DataDisplay = () => {
  return (
    <main className='data-display-skeleton'>
      <Header />
      <TableBody />
    </main>
  )
}
export default DataDisplay
