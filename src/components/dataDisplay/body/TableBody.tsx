import React from 'react'
import AdapterRenderer from '../../../commons/AdapterRenderer'
import { RendererStyles } from '../../../types'
import { useDataDisplay } from '../../context/DataDisplay.context'
import CircularProgress from '@material-ui/core/CircularProgress'
import DataRow from './DataRow'
import './TableBody.css'
import AppLoader from '../../dataDisplay/body/AppLoader'

export const TableBody = () => {
  const {
    state,
    callback,
    transactionsUrl,
    resetPaginationData,
    setPaginationParameters,
    paginationParameters
  } = useDataDisplay() as any
  const { pagination } = state
  const { limit } = pagination
  const styles: RendererStyles = {
    unitHeightOfRow: 60,
    totalLengthOfItems: limit
  }
  const LoaderElement = () => (
    <div className='loader-container'>
      <CircularProgress />
    </div>
  )

  return (
    <div className='table-container'>
      <AdapterRenderer
        AppLoader={AppLoader}
        resetPaginationData={resetPaginationData}
        callback={callback}
        parameters={transactionsUrl}
        styles={styles}
        LoaderElement={LoaderElement}
        Row={DataRow}
        paginationParameters={paginationParameters}
        setPaginationParameters={setPaginationParameters}
        pagination={pagination}
      />
    </div>
  )
}
export default TableBody
