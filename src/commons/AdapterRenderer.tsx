import React, { useRef, useState, useEffect, ReactElement } from 'react'
import useScrollObserver from '../hooks/useScrollObserver'
import AdapterDisplay from '../commons/AdapterDisplay'
import useAdapterRender from '../hooks/useAdapterRender'
import {
  MakeApiRequest,
  Pagination,
  RendererStyles,
  TransactionItem
} from '../types'

const defaultData: any[] = []
const defaultDisplay: any[] = []

export type AdapterRendererProps = {
  callback: MakeApiRequest
  pagination: Pagination
  styles: RendererStyles
  LoaderElement: React.FC<{}>
  Row: React.FC<TransactionItem>
  rowProps?: unknown
  parameters: string
  AppLoader: React.FC<{}>
}

const AdapterRenderer: React.FC<AdapterRendererProps> = ({
  Row,
  styles,
  callback,
  pagination,
  LoaderElement,
  rowProps,
  parameters = '',
  AppLoader
}): ReactElement => {
  const container = useRef(null)
  const element = useRef(null)

  const [htmlElements, setHtmlElements] = useState({
    containerElement: container.current,
    observedElement: element.current
  })

  const [loading, setLoading] = useState(false)
  const [appLoading, setAppLoading] = useState(false)
  const [dataDisplay, setDataDisplay] = useState(defaultData)
  const [displayItems, setDisplayItems] = useState(defaultDisplay)
  const [isScrolling, setIsScrolling] = useState(false)

  const {
    callbackReference,
    resetCallbackMethod
  } = useScrollObserver(
    htmlElements.containerElement,
    htmlElements.observedElement,
    () => setIsScrolling(true)
  )

  const {
    setElementContent,
    getElementContent,
    resetElementContent
  } = useAdapterRender()
  const refresh = () => {
    resetElementContent()
    setDataDisplay(defaultDisplay)
    setDisplayItems([])
  }
  useEffect((): (() => void) => {
    console.log('res etting element content ===>')
    refresh()
    return () => refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const reference = callbackReference
      const reset = resetCallbackMethod
      if (pagination.nextPage && !loading && !appLoading) {
        setLoading(true)
        try {
          const response = await callback.call(this, parameters)
          reset(reference)
          setElementContent(pagination.currentPage, response)
          setDataDisplay(d => [...d, pagination.currentPage])
          setLoading(false)
          setIsScrolling(false)
        } catch (err) {
          reset(reference)
          setIsScrolling(false)
        }
      }
    }
    if (isScrolling) {
      fetchData()
    }
  }, [
    appLoading,
    callback,
    callbackReference,
    isScrolling,
    loading,
    pagination,
    parameters,
    resetCallbackMethod,
    setElementContent
  ])

  useEffect(() => {
    const fetchInitialData = async (reset: any, reference: unknown) => {
      setAppLoading(true)
      const response = await callback.call(this, parameters)
      reset(reference)
      setElementContent(pagination.currentPage, response)
      setDataDisplay(d => [...d, pagination.currentPage])
      setAppLoading(false)
      return
    }
    if (pagination.currentPage === 0 && !appLoading && !loading && parameters) {
      fetchInitialData(resetCallbackMethod, callbackReference)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, parameters])

  useEffect(() => {
    if (container.current && element.current) {
      setHtmlElements({
        containerElement: container.current,
        observedElement: element.current
      })
    }
  }, [container, element])

  const fetchRenderedItem = (callbackReference: number) => {
    const elements = getElementContent(callbackReference) || []
    setDisplayItems(elements)
  }

  return (
    <div id='container' ref={container} className='container'>
      <div className='scroller'>
        {dataDisplay?.map((pageItem, index) => (
          <AdapterDisplay
            key={index}
            itemsLength={styles.totalLengthOfItems}
            unitHeight={styles.unitHeightOfRow}
            root={container.current}
            callback={fetchRenderedItem}
            selector={pageItem}>
            {displayItems.map(dataItems => {
              return <Row key={dataItems.id} {...dataItems} {...rowProps} />
            })}
          </AdapterDisplay>
        ))}
        {appLoading && <AppLoader />}
        <div ref={element} id='observed' className='observed'>
          {loading ? <LoaderElement /> : ' '}
        </div>
      </div>
    </div>
  )
}

export default AdapterRenderer
