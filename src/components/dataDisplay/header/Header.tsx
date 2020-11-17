import React, { useState } from 'react'
import './Header.css'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import FilterListIcon from '@material-ui/icons/FilterList'
import GetAppIcon from '@material-ui/icons/GetApp'
import TableHead from './TableHead'
import { useDataDisplay } from '../../context/DataDisplay.context'
import { ContextState, FilterType, NotificationTypes } from '../../../types'
import { getLastYear, getWordDate, getLastMonth } from '../../../utils/dates'
import Notification  from '../../../commons/Notification'

const Search = ({ ...props }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [info, setInfo] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    props.onChange(value)
    setSearchTerm(value)
    setInfo('This Feature is comming soon')
  }
  const clearInput = () => {
    setSearchTerm('')
    props.onChange('')
    setInfo('')
  }

  return (
    <div className='search-box'>
      <Notification message={info} context={NotificationTypes.info} />
      <SearchIcon className='icon' />
      <input
        {...props}
        value={searchTerm}
        onChange={handleChange}
        type='text'
        placeholder='Search'
      />
      {searchTerm && <CloseIcon onClick={clearInput} className='icon rotate' />}
    </div>
  )
}

type HeaderProps = { 
  toggleFilter: () => void
}

export const Header: React.FC<HeaderProps> = ({ toggleFilter}) => {
  const { state, setFilter } = useDataDisplay() as any
  const { filter } = state as ContextState
  const { from, to } = filter as FilterType
  const localDateReadableFormatFrom = getWordDate(from)
  const  localDateReadableFormatTo = getWordDate(to)

  const [filterVisibilityState, setFilterVisibilityState ] = useState({ 
    matchesLastMonth: getLastMonth(new Date()) === from,
    matchesLastYear:  getLastYear(new Date()) === from
  })

  const handleFilterLastYearChanged = () => { 
    const fromDate = getLastYear(new Date())
      setFilter({
        ...filter,
        from: fromDate,
        to: new Date()
      })  
     setFilterVisibilityState({ matchesLastMonth: false, matchesLastYear: true})
  }
  

  const handleFilterLastMonthChanged = () => { 
    const fromDate = getLastMonth(new Date())
    setFilter({
      ...filter,
      from: fromDate,
      to: new Date()
    })
    setFilterVisibilityState({ matchesLastMonth: true, matchesLastYear: false})
  }

  const handleCustomSelection = () => { 
    setFilterVisibilityState({ matchesLastMonth: false, matchesLastYear: false})
    toggleFilter()
  }

  const { matchesLastYear, matchesLastMonth } = filterVisibilityState

  return (
    <nav className='highlight'>
      <div className='row'>
        <Search onChange={(e: string) => console.log(e)} />
      </div>
      <div className='row heading-row'>
        <Typography variant='h4' className='dark-text truncate' gutterBottom>
          Transactions
        </Typography>
        <Typography variant='h6' className='light-text' gutterBottom>
          '  '
        </Typography>
        <div className='button-row-container'>
          <div className='curved-button-row'>
            <button onClick={handleFilterLastMonthChanged} className={matchesLastMonth ? 'blue white-text' : 'white dark-text'}>Last Month</button>
            <button onClick={handleFilterLastYearChanged} className={matchesLastYear ? 'blue white-text' : 'white dark-text'}>Last Year</button>
            <button className='white dark-text' onClick={handleCustomSelection}> Custom</button>
          </div>
        </div>
        <div className='details-container light-text'>
          <Typography variant='body1' className='dark-text truncate bolder'>
           {`Results from ${localDateReadableFormatFrom} To ${localDateReadableFormatTo}`}
          </Typography>
          <FilterListIcon onClick={toggleFilter} className='filter dark-text' />
          <GetAppIcon className='filter dark-text' />
        </div>
      </div>
      <div className='row'>
        <TableHead />
      </div>
    </nav>
  )
}

export default Header