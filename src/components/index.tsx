import React, { useState } from 'react'
import './index.css'
import Header from './dataDisplay/header/Header'
import TableBody from './dataDisplay/body/TableBody'
import Modal from '@material-ui/core/Modal'
import DateFilter from './dataDisplay/DateFilter/DateFilter'

const DataDisplay = () => {
  const [open, setOpen] = useState(false)
  const toggleModal = () => setOpen(!open)
  return (
    <main className='data-display-skeleton'>
      <Modal
        className='modal-class'
        open={open}
        onClose={toggleModal}
        aria-labelledby='date-control'
        aria-describedby='toggle-date-control'>
        <div>
          <DateFilter toggleFilter={toggleModal} />
        </div>
      </Modal>
      <Header toggleFilter={toggleModal} />
      <TableBody />
    </main>
  )
}
export default DataDisplay
