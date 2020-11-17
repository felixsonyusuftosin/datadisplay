import React, { useRef, useState, useEffect, ReactElement } from 'react'
import useScrollObserver from '../hooks/useScrollObserver'
import AdapterDisplay from './AdapterDisplay'
import { useDataDisplay } from '../components/context/DataDisplay.context'
import {
  RendererStyles,
  TransactionItem,
  ContextState,
  NotificationTypes
} from '../types'
import Notification from './Notification'

const defaultData: any = {}
const defaultDisplay: any[] = []

export type AdapterRendererProps = {
  styles: RendererStyles
  LoaderElement: React.FC<{}>
  Row: React.FC<TransactionItem>
  rowProps?: unknown
  AppLoader: React.FC<{}>
}

const AdapterRenderer: React.FC<AdapterRendererProps> = ({
  Row,
  styles,
  LoaderElement,
  rowProps,
  AppLoader
}): ReactElement => {
  const {
    state,
    fetchInitialData,
    fetchSubsequentPaginatedData,
    resetDataWhenFilterChanges,
    getData
  } = useDataDisplay() as any

  const {
    filter,
    appLoading,
    moreLoading,
    filterUpdatedAt,
    errorFetchingInitialData,
    errorFetchingMoreData
  } = state as ContextState || {}
  const [dataDisplay, setDataDisplay] = useState(defaultData)
  const [isScrolling, setIsScrolling] = useState(false)
  const [displayItems, setDisplayItems] = useState(defaultDisplay)
  const [errorMessage, setErrorMessage] = useState('')

  const container = useRef(null)
  const element = useRef(null)

  const [htmlElements, setHtmlElements] = useState({
    containerElement: container.current,
    observedElement: element.current
  })

  // set this effect to set up ref on subsequent render
  useEffect(() => {
    if (container.current && element.current) {
      setHtmlElements({
        containerElement: container.current,
        observedElement: element.current
      })
    }
  }, [container, element])

  const { callbackReference, resetCallbackMethod } = useScrollObserver(
    htmlElements.containerElement,
    htmlElements.observedElement,
    () => {
      setIsScrolling(true)
    }
  )

  // Effect to run when app just loads
  useEffect(() => {
    const fetchData = async () => {
      const { currentPage } = (await fetchInitialData()) || {}
      if (currentPage !== 0 && !currentPage) return
      setDataDisplay((d: { key: string; value: number }) => ({
        ...d,
        [currentPage]: currentPage
      }))
    }
    if (!appLoading) {
      fetchData()
    }
    return () => {
      setDataDisplay(defaultData)
      setDisplayItems(defaultDisplay)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Effect to run when user scrolls
  useEffect(() => {
    const fetchData = async () => {
      const { currentPage } = (await fetchSubsequentPaginatedData()) || {}
      if (currentPage !== 0 && !currentPage) return
      setDataDisplay((d: { key: string; value: number }) => ({
        ...d,
        [currentPage]: currentPage
      }))
      resetCallbackMethod(callbackReference)
      setIsScrolling(false)
    }
    if (isScrolling && !appLoading) {
      fetchData()
    }
    return () => setIsScrolling(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrolling])

  // Effect to run when filter changes
  useEffect(() => {
    const fetchData = async (from: Date, to: Date) => {
      const { currentPage } = (await resetDataWhenFilterChanges(from, to)) || {}
      if (currentPage !== 0 && !currentPage) return
      setDataDisplay((d: { key: string; value: number }) => ({
        [currentPage]: currentPage
      }))
    }
    if (filterUpdatedAt && !appLoading) {
      fetchData(filter.from, filter.to)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterUpdatedAt])

  const fetchRenderedItem = (callbackReference: number) => {
    const elements = getData(callbackReference) || []
    setDisplayItems(elements)
  }

  useEffect(() => {
    if (errorFetchingInitialData || errorFetchingMoreData) {
      if (errorFetchingInitialData) {
        setErrorMessage((errorFetchingInitialData as string) )
      } else {
        setErrorMessage((errorFetchingMoreData as string))
      }
      return 
    }
    setErrorMessage('')
    return () => {
      setErrorMessage('')
    }
  }, [errorFetchingInitialData, errorFetchingMoreData])

  return (
    <div id='container' ref={container} className='container'>
      <Notification context={NotificationTypes.error} message={errorMessage} />
      <div className='scroller'>
        {!appLoading && (
          <>
            {Object.keys(dataDisplay)?.map((pageItem, index) => (
              <AdapterDisplay
                key={index}
                itemsLength={styles.totalLengthOfItems}
                unitHeight={styles.unitHeightOfRow}
                root={container.current}
                callback={() => fetchRenderedItem(+pageItem)}
                selector={+pageItem}>
                {displayItems?.map(
                  (dataItems: TransactionItem, index: number) => {
                    return <Row key={index} {...dataItems} {...rowProps} />
                  }
                )}
              </AdapterDisplay>
            ))}
          </>
        )}
        {appLoading && <AppLoader />}
        <div ref={element} id='observed' className='observed'>
          {moreLoading ? <LoaderElement /> : ' '}
        </div>
      </div>
    </div>
  )
}

export default AdapterRenderer
