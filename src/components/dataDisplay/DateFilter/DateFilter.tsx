import React, { useState, useEffect } from 'react'
import 'date-fns'
import './DateFilter.css'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import DateFnsUtils from '@date-io/date-fns'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers'
import { getLastYear } from '../../../utils/dates'

type Filter = {
  currentPage: number
  last: null
  limit: number
  from: Date
  to: Date
}

type FilterProps = {
  toggleFilter: () => void
  from: string
  to: string
  setDateFilter: React.Dispatch<React.SetStateAction<Filter>>
}

const commonProps = {
  disableFuture: true
}

export const DateFilter: React.FC<FilterProps> = ({
  toggleFilter,
  from,
  to,
  setDateFilter
}) => {
  const [fromDate, setFromDate] = useState(new Date(from))
  const [toDate, setToDate] = useState(new Date(to))
  const [fromDateProps, setFromDateProps] = useState({ maxDate: new Date(to) })
  const [toDateProps, setToDateProps] = useState({ minDate: new Date(from) })

  const handleFromDateChange = (date: any) => {
    setFromDate(date)
    setToDateProps({ minDate: date })
  }
  const handleToDateChange = (date: any) => {
    setToDate(date)
    setFromDateProps({ maxDate: date })
  }

  // useEffect(() => {
  //   return () => {
  //     setFromDate(getLastYear())
  //     setToDate(new Date())
  //     setFromDateProps({ maxDate: new Date() })
  //     setToDateProps({ minDate: fromDate })
  //   }
  // })

  const handleSubmit = () => {
    if (fromDate && toDate) {
      setDateFilter((filter: Filter) => ({
        ...filter,
        from: fromDate,
        to: toDate
      }))
      toggleFilter()
    }
  }

  return (
    <section className='filter-content'>
      <div className='filter-row filter-heading'>
        <Typography variant='h4'>Filter By Date</Typography>
        <IconButton  onClick={toggleFilter} >
          <CloseIcon/>
        </IconButton>
      </div>
      <div className='filter-row form-section'>
        <div className='form-row'>
          <div className='date-row'>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                {...commonProps}
                {...fromDateProps}
                disableToolbar
                variant='inline'
                format='MM/dd/yyyy'
                margin='normal'
                label='From Date'
                value={fromDate}
                onChange={handleFromDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                {...commonProps}
                {...toDateProps}
                disableToolbar
                variant='inline'
                format='MM/dd/yyyy'
                margin='normal'
                label='To Date'
                value={toDate}
                onChange={handleToDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          <div>
            <div className='button-row'>
              <button onClick={handleSubmit} className='filter-button'>
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='filter-row'></div>
    </section>
  )
}

export default DateFilter
