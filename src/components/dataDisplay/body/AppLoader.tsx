import React from 'react'
import './DataRow.css'
import spinner from './spinner.svg'


const AppLoader = () => (
  <div className='app-loader'>
    <img src={spinner} alt='loader' />
  </div>
)

export default AppLoader
