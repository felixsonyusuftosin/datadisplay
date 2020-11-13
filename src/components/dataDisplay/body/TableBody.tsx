import React from 'react'
import AdapterRenderer from '../../../commons/AdapterRenderer'
import { RendererStyles } from '../../../types'
import { useDataDisplay } from '../../context/DataDisplay.context'
import CircularProgress from '@material-ui/core/CircularProgress'
import DataRow from './DataRow'
import './TableBody.css'

export const TableBody = () => {
  const { state, callback, transactionsUrl } = useDataDisplay() as any
  const { limit, pagination } = state
  const styles: RendererStyles = {
    unitHeightOfRow: 60,
    totalLengthOfItems: 11
  }
  const LoaderElement = () => (
    <div className='loader-container'>
      <CircularProgress />
    </div>
  )
  return (
    <div className='table-container'>
      <AdapterRenderer
        callback={callback}
        parameters={transactionsUrl}
        styles={styles}
        LoaderElement={LoaderElement}
        Row={DataRow}
        pagination={pagination}
      />
    </div>
  )
}
export default TableBody
