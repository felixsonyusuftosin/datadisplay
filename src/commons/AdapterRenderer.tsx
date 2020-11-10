import React, { useRef, useState, useEffect, ReactElement } from 'react'
import useScrollObserver from '../hooks/useScrollObserver'
import AdapterDisplay from '../commons/AdapterDisplay'
import useAdapterRender from '../hooks/useAdapterRender'

const defaultData: any[] = []
const defaultDisplay: any[] = []

export type MakeApiRequest = {
  (url: string): Promise<unknown[]>
}
export type Pagination = {
  currentPage: number
  nextPage: number
  totalPages: number
  limit: number
}

export type RendererStyles = {
  unitHeightOfRow: number
  totalLengthOfItems: number
}

export type AdapterRendererProps = {
  callback: MakeApiRequest
  pagination: Pagination
  styles: RendererStyles
  LoaderElement: any
  Row: any
  rowProps: unknown
  parameters: string
}

const AdapterRenderer: React.FC<AdapterRendererProps> = ({
  Row,
  styles,
  callback,
  pagination,
  LoaderElement,
  rowProps,
  parameters = ''
}): ReactElement => {
  const container = useRef(null)
  const element = useRef(null)

  const [htmlElements, setHtmlElements] = useState({
    containerElement: container.current,
    observedElement: element.current
  })

  const [loading, setLoading] = useState(false)
  const [dataDisplay, setDataDisplay] = useState(defaultData)
  const [displayItems, setDisplayItems] = useState(defaultDisplay)

  useEffect(() => {
    if (container.current && element.current) {
      setHtmlElements({
        containerElement: container.current,
        observedElement: element.current
      })
    }
  }, [container, element])
  const { setElementContent, getElementContent } = useAdapterRender()

  const fetchData = async (
    reset: (reference: unknown) => void,
    reference: unknown
  ) => {
    setLoading(true)
    const response = await callback.call(this, parameters)
    reset(reference)
    setElementContent(pagination.currentPage, response)
    setDataDisplay(d => [...d, pagination.currentPage])
    setLoading(false)
  }

  const {
    callbackReference,
    resetCallbackMethod
  } = useScrollObserver(
    htmlElements.containerElement,
    htmlElements.observedElement,
    () => fetchData(resetCallbackMethod, callbackReference)
  )
  const fetchRenderedItem = (callbackReference: number) => {
    const elements = getElementContent(callbackReference) || []
    setDisplayItems(elements)
  }
  return (
    <div id='container' ref={container} className='container'>
      <div className='scroller'>
        {dataDisplay?.map((pageItem) => (
          <AdapterDisplay
            key={pageItem}
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
        <div ref={element} id='observed' className='observed'>
          {loading ? <LoaderElement /> : ' '}
        </div>
      </div>
    </div>
  )
}

export default AdapterRenderer
