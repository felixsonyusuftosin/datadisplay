import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import './DataRow.css'

const range = (start = 0, end = 10) => {
  const length = end - start
  return Array.from({ length }, (_, i) => start + i)
}

const LoaderRow = () => (
  <div className=' table-column data-row'>
    {range(0, 10).map(val => (
      <Skeleton key={val} height={60} animation='wave' className='skeleton' />
    ))}
  </div>
)

const AppLoader = () => (
  <>
    {range(0, 11).map(val => (
      <LoaderRow key={val} />
    ))}
  </>
)

export default AppLoader
