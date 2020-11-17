import React from 'react'
import AdapterRenderer from '../../../commons/AdapterRenderer'
import { RendererStyles, ContextState, FilterType } from '../../../types'
import { useDataDisplay } from '../../context/DataDisplay.context'
import CircularProgress from '@material-ui/core/CircularProgress'
import DataRow from './DataRow'
import './TableBody.css'
import AppLoader from '../../dataDisplay/body/AppLoader'

export const TableBody = () => {
  const { state } = useDataDisplay() as any
  const { filter } = state as ContextState
  const { limit } = filter as FilterType
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
        styles={styles}
        LoaderElement={LoaderElement}
        Row={DataRow}
      />
    </div>
  )
}
export default TableBody
