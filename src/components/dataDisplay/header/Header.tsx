import React, { useState } from 'react'
import './Header.css'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import FilterListIcon from '@material-ui/icons/FilterList'
import GetAppIcon from '@material-ui/icons/GetApp'
import TableHead from './TableHead'

const Search = ({ ...props }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    props.onChange(value)
    setSearchTerm(value)
  }
  const clearInput = () => {
    setSearchTerm('')
    props.onChange('')
  }

  return (
    <div className='search-box'>
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
          2,700 Total
        </Typography>
        <div className='button-row-container'>
          <div className='curved-button-row'>
            <button className='blue white-text'>Last Month</button>
            <button className='white dark-text'>Last Year</button>
            <button className='white dark-text'> Custom</button>
          </div>
        </div>
        <div className='details-container light-text'>
          <Typography variant='body1' className='dark-text truncate'>
            Results from Last Year
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